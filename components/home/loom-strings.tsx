"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   A loom you can play.

   The company is named for a loom, so the hero is warp threads strung across the
   screen. Move a cursor through them and they pluck: each one bows, rings, and
   sounds a note. It is the brand rather than a decoration that happens to be on
   the brand's page.

   The notes are synthesised, not loaded. A plucked string is an oscillator, a
   falling filter and a decay envelope, which the Web Audio API has had all along
   and which costs no download at all.

   Sound never starts on its own. It waits for somebody to ask for it, both
   because browsers rightly refuse otherwise and because a page that makes a
   noise at you unbidden has already lost the argument.
--------------------------------------------------------------------------- */

const THREADS = 19;

/**
 * A minor pentatonic, low to high, left to right.
 *
 * Pentatonic because every note in it agrees with every other one. A visitor
 * dragging a cursor across nineteen strings is not composing, so the scale has
 * to guarantee that whatever they do sounds deliberate.
 */
const SCALE = [0, 3, 5, 7, 10];
const ROOT = 174.61;

const pitchOf = (at: number) =>
  ROOT *
  2 ** ((SCALE[at % SCALE.length] + 12 * Math.floor(at / SCALE.length)) / 12);

interface String_ {
  /** How hard it is ringing, 0 to 1, always falling. */
  amp: number;
  /** Where it is in its cycle. */
  phase: number;
  /** Radians a second, from the note it carries. */
  speed: number;
  /** When it was last struck, so a lingering cursor does not machine-gun it. */
  struck: number;
}

/**
 * The threads, played by pointer or keyboard.
 *
 * The canvas is a picture of state that lives outside React: sixty times a
 * second is far too often to be re-rendering a component tree, and none of the
 * ringing is anything the rest of the page needs to know about.
 */
export function LoomStrings({ className }: { className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLCanvasElement>(null);

  const [sound, setSound] = useState(false);
  const [touched, setTouched] = useState(false);

  /* Read by the animation loop, which is outside React and must not close over
     a stale value. */
  const wantSound = useRef(false);
  const audio = useRef<{
    ctx: AudioContext;
    master: GainNode;
  } | null>(null);

  useEffect(() => {
    wantSound.current = sound;
    if (!sound) return;

    /* Built on the click that asked for it, which is the only moment a browser
       will allow it. */
    if (!audio.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;

      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0.16;

      /* A short delay with a little feedback, which is the cheapest convincing
         room there is. Without it the notes sound like they were struck inside a
         cupboard. */
      const echo = ctx.createDelay(1);
      echo.delayTime.value = 0.28;
      const back = ctx.createGain();
      back.gain.value = 0.26;
      const wet = ctx.createGain();
      wet.gain.value = 0.4;

      master.connect(ctx.destination);
      master.connect(echo);
      echo.connect(back);
      back.connect(echo);
      echo.connect(wet);
      wet.connect(ctx.destination);

      audio.current = { ctx, master };
    }

    void audio.current?.ctx.resume();
  }, [sound]);

  useEffect(
    () => () => {
      void audio.current?.ctx.close();
      audio.current = null;
    },
    [],
  );

  useEffect(() => {
    const box = frame.current;
    const canvas = surface.current;
    if (!box || !canvas) return;

    const paper = canvas.getContext("2d");
    if (!paper) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const strings: String_[] = Array.from({ length: THREADS }, (_unused, at) => ({
      amp: 0,
      phase: 0,
      /* Higher notes shimmer faster, which is what a real string does and what
         makes the picture agree with the sound. */
      speed: 7 + at * 0.9,
      struck: -1,
    }));

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let lastAt = -1;
    let cursorY = -1;
    let born = performance.now();

    function pluck(at: number, force: number) {
      const string = strings[at];
      if (!string) return;

      const now = performance.now();
      /* A cursor resting on a thread should not retrigger it every frame. */
      if (now - string.struck < 90) return;

      string.struck = now;
      string.amp = Math.min(1, string.amp + force);
      string.phase = 0;

      const kit = audio.current;
      if (!wantSound.current || !kit || kit.ctx.state !== "running") return;

      const t = kit.ctx.currentTime;
      const freq = pitchOf(at);

      const tone = kit.ctx.createOscillator();
      tone.type = "triangle";
      tone.frequency.value = freq;

      /* A second voice a few cents off. Two almost identical notes beat against
         each other, which is most of what makes a string sound like a string
         rather than a test tone. */
      const twin = kit.ctx.createOscillator();
      twin.type = "sine";
      twin.frequency.value = freq * 1.003;

      /* The brightness of a plucked string falls away faster than its volume. */
      const colour = kit.ctx.createBiquadFilter();
      colour.type = "lowpass";
      colour.frequency.setValueAtTime(Math.min(freq * 7, 7000), t);
      colour.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.4, 220), t + 0.9);

      const level = kit.ctx.createGain();
      const peak = 0.28 * (0.55 + force * 0.45);
      level.gain.setValueAtTime(0.0001, t);
      level.gain.exponentialRampToValueAtTime(peak, t + 0.008);
      level.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);

      tone.connect(colour);
      twin.connect(colour);
      colour.connect(level);
      level.connect(kit.master);

      tone.start(t);
      twin.start(t);
      tone.stop(t + 2.3);
      twin.stop(t + 2.3);
    }

    function resize() {
      if (!box || !canvas || !paper) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.clientWidth;
      height = box.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      paper.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      if (!paper) return;

      const dt = Math.min((now - last) / 1000, 1 / 20) || 0;
      last = now;

      /* The threads draw themselves in from the left on arrival. */
      const arrived = Math.min((now - born) / 900, 1);

      paper.clearRect(0, 0, width, height);

      const gap = width / (THREADS + 1);
      const top = height * 0.06;
      const bottom = height * 0.94;
      const span = bottom - top;

      /* The weft: a few faint crossing threads, so it reads as cloth on a loom
         rather than as a row of lines. */
      paper.lineWidth = 1;
      paper.strokeStyle = "rgba(229, 231, 235, 0.9)";
      for (let row = 1; row <= 3; row += 1) {
        const y = top + (span * row) / 4;
        paper.beginPath();
        paper.moveTo(0, y);
        paper.lineTo(width * arrived, y);
        paper.stroke();
      }

      for (let at = 0; at < THREADS; at += 1) {
        const string = strings[at];
        const x = gap * (at + 1);

        /* Each thread has its own moment of arrival, left to right. */
        const mine = Math.max(
          0,
          Math.min((arrived - (at / THREADS) * 0.55) / 0.45, 1),
        );
        if (mine <= 0) continue;

        if (!still) {
          string.phase += string.speed * dt;
          /* Ring down. Higher strings die away sooner, as they do. */
          string.amp *= Math.exp(-dt * (1.5 + at * 0.05));
          if (string.amp < 0.001) string.amp = 0;
        }

        const swing =
          Math.sin(string.phase) * string.amp * Math.min(gap * 0.85, 34);

        const reach = top + (bottom - top) * mine;

        paper.beginPath();
        paper.moveTo(x, top);
        /* A standing wave: still at the ends, furthest at the middle. One
           quadratic with the control point pushed twice the displacement lands
           the curve exactly on it. */
        paper.quadraticCurveTo(x + swing * 2, (top + reach) / 2, x, reach);

        const lit = Math.min(1, string.amp * 1.6);
        paper.lineWidth = 1 + lit * 1.6;
        paper.strokeStyle =
          lit > 0.01
            ? `rgba(37, 99, 235, ${0.3 + lit * 0.7})`
            : "rgba(17, 24, 39, 0.22)";
        paper.stroke();

        /* A bead riding the middle of a ringing string. */
        if (lit > 0.05) {
          paper.beginPath();
          paper.arc(x + swing, (top + reach) / 2, 2 + lit * 3, 0, Math.PI * 2);
          paper.fillStyle = `rgba(37, 99, 235, ${lit * 0.9})`;
          paper.fill();
        }
      }

      /* Where the hand is. */
      if (cursorY >= 0 && lastAt >= 0) {
        paper.beginPath();
        paper.arc(gap * (lastAt + 1), cursorY, 3, 0, Math.PI * 2);
        paper.fillStyle = "rgba(17, 24, 39, 0.25)";
        paper.fill();
      }
    }

    function onPointer(event: PointerEvent) {
      if (!box) return;
      const bounds = box.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      cursorY = event.clientY - bounds.top;

      const gap = bounds.width / (THREADS + 1);
      const at = Math.round(x / gap) - 1;
      if (at < 0 || at >= THREADS) return;

      /* Only on crossing, so moving along a thread does not hold it down. */
      if (at !== lastAt) {
        const near = 1 - Math.min(Math.abs(x - gap * (at + 1)) / (gap / 2), 1);
        pluck(at, 0.55 + near * 0.45);
        lastAt = at;
        setTouched(true);
      }
    }

    function onLeave() {
      lastAt = -1;
      cursorY = -1;
    }

    function onKey(event: KeyboardEvent) {
      const step =
        event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

      if (step) {
        event.preventDefault();
        lastAt = Math.max(0, Math.min(THREADS - 1, (lastAt < 0 ? -1 : lastAt) + step));
        pluck(lastAt, 0.9);
        setTouched(true);
        return;
      }

      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        pluck(Math.max(0, lastAt), 1);
        setTouched(true);
      }
    }

    const watcher = new ResizeObserver(resize);
    watcher.observe(box);

    box.addEventListener("pointermove", onPointer);
    box.addEventListener("pointerleave", onLeave);
    box.addEventListener("keydown", onKey);

    resize();
    born = performance.now();
    last = performance.now();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      watcher.disconnect();
      box.removeEventListener("pointermove", onPointer);
      box.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className={className}>
      <div
        ref={frame}
        tabIndex={0}
        role="group"
        aria-label="A loom of nineteen strings. Move across them, or use the arrow keys, to play."
        className="relative w-full cursor-crosshair rounded-card outline-none focus-visible:ring-2 focus-visible:ring-active"
        style={{ height: "clamp(200px, 34svh, 360px)" }}
      >
        <canvas ref={surface} aria-hidden className="block h-full w-full" />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={() => setSound((was) => !was)}
          aria-pressed={sound}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-pill border py-2 pr-4 pl-3 text-[13.5px] font-semibold transition-colors",
            sound
              ? "border-active bg-active text-white"
              : "border-border bg-field text-body hover:border-ink hover:text-ink",
          )}
        >
          {sound ? (
            <Volume2 aria-hidden className="size-4" />
          ) : (
            <VolumeX aria-hidden className="size-4" />
          )}
          {sound ? "Sound on" : "Turn the sound on"}
        </button>

        <p className="font-mono text-[9.5px] font-bold tracking-[0.2em] text-planned uppercase">
          {touched
            ? sound
              ? "Every note agrees with every other one"
              : "Now turn the sound on"
            : "Run your cursor across the threads"}
        </p>
      </div>
    </div>
  );
}
