"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The name, woven, and playable.

   The company is named for a loom, so the hero is warp threads strung across the
   screen with the wordmark woven into them. Where a thread passes through a
   letter it is ink; everywhere else it is a hairline. So the word is not drawn on
   top of the cloth, it is made of it, and there is nothing on screen that is not
   a thread.

   Which is what makes plucking worth doing: a bowed thread carries its share of
   the letter with it, so the word ripples like fabric rather than sitting still
   while something happens behind it.

   The notes are synthesised, not loaded. A plucked string is an oscillator, a
   falling filter and a decay envelope, which the Web Audio API has had all along
   and which costs no download at all.

   Sound is on from the start, but no browser will let a page make a noise before
   somebody has touched it, so the audio is unlocked by the first click, tap or
   key anywhere on the document rather than by a button that has to be found and
   pressed. Until that happens the threads still pluck, silently, and the caption
   says why. The mute is still there for anyone who wants it.
--------------------------------------------------------------------------- */

/** Threads per hundred pixels. Close enough that letters read, far enough to see through. */
const DENSITY = 7.5;

/** Points down a thread. Enough for the curve to look drawn rather than folded. */
const STEPS = 34;

/**
 * The bow of a plucked string: still at the ends, furthest in the middle.
 *
 * Computed rather than read from a table. A lookup meant rounding each point to
 * the nearest of twenty-six, which put a visible facet in every curve where two
 * samples landed on the same entry. A few thousand sines a frame is nothing, and
 * the difference between a faceted curve and a smooth one is the whole effect.
 */
const bow = (t: number) => Math.sin(t * Math.PI);

/**
 * A minor pentatonic, low to high, left to right.
 *
 * Pentatonic because every note in it agrees with every other one. Somebody
 * dragging a cursor across a hundred threads is not composing, so the scale has
 * to guarantee that whatever they do sounds deliberate.
 */
const SCALE = [0, 3, 5, 7, 10];
const ROOT = 174.61;

/** Many threads, few notes: neighbours share a pitch so a sweep is a run, not a siren. */
const PER_NOTE = 6;

function pitchOf(thread: number) {
  const note = Math.floor(thread / PER_NOTE);
  const step = SCALE[note % SCALE.length] + 12 * Math.floor(note / SCALE.length);
  return ROOT * 2 ** (step / 12);
}

interface Thread {
  x: number;
  /** Ink runs down this thread, as pairs of y. Where the letters are. */
  runs: Float32Array;
  amp: number;
  phase: number;
  speed: number;
  struck: number;
}

/**
 * The cloth, played by pointer or keyboard.
 *
 * The canvas is a picture of state kept outside React. Sixty times a second is
 * far too often to re-render a component tree, and none of the ringing is
 * anything the rest of the page needs to know about.
 */
export function LoomStrings({
  word,
  className,
}: {
  word: string;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLCanvasElement>(null);

  const [sound, setSound] = useState(true);
  /* Whether the browser has actually let the audio start. */
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);

  /* Read by the animation loop, which is outside React and must not close over
     a stale value. */
  const wantSound = useRef(true);
  const audio = useRef<{ ctx: AudioContext; master: GainNode } | null>(null);

  const ensure = useCallback(() => {
    if (!audio.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;

      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0.15;

      /* A short delay with a little feedback, which is the cheapest convincing
         room there is. Without it the notes sound struck inside a cupboard. */
      const echo = ctx.createDelay(1);
      echo.delayTime.value = 0.3;
      const back = ctx.createGain();
      back.gain.value = 0.28;
      const wet = ctx.createGain();
      wet.gain.value = 0.42;

      master.connect(ctx.destination);
      master.connect(echo);
      echo.connect(back);
      back.connect(echo);
      echo.connect(wet);
      wet.connect(ctx.destination);

      audio.current = { ctx, master };
    }

    const kit = audio.current;
    if (!kit) return;

    void kit.ctx.resume().then(() => setReady(kit.ctx.state === "running"));
  }, []);

  /* The first real gesture anywhere is what a browser counts as permission, so
     that is what opens the audio. Resuming an already running context is free,
     which is why this does not bother unhooking itself. */
  useEffect(() => {
    const unlock = () => ensure();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [ensure]);

  useEffect(() => {
    wantSound.current = sound;
    if (sound) ensure();
  }, [sound, ensure]);

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

    let threads: Thread[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let born = performance.now();
    let lastAt = -1;
    let alive = true;
    let rebuilding: number | undefined;

    /* The fade, built once per resize rather than once per frame. */
    let fadeY: CanvasGradient | null = null;
    let fadeX: CanvasGradient | null = null;

    /**
     * Weave the word into the warp.
     *
     * The word is drawn once to an offscreen canvas in the site's own typeface,
     * then each thread reads the column of pixels it stands in and keeps the
     * stretches where it found ink. Sampling the glyphs rather than describing
     * them means the cloth carries Archivo's own curves, and changing the name
     * changes the weave with nothing to re-export.
     */
    async function build() {
      if (document.fonts?.ready) await document.fonts.ready;
      if (!alive || !box || width < 2 || height < 2) return;

      const probe = document.createElement("canvas");
      probe.width = Math.round(width);
      probe.height = Math.round(height);

      const ink = probe.getContext("2d", { willReadFrequently: true });
      if (!ink) return;

      const family = getComputedStyle(box).fontFamily || "system-ui, sans-serif";

      /* As large as the box will take, then backed off so the letters have air
         above and below to be plucked into. */
      let size = Math.min((width * 0.94) / (word.length * 0.56), height * 0.62);
      ink.font = `900 ${size}px ${family}`;
      const measured = ink.measureText(word).width;
      if (measured > width * 0.94) size *= (width * 0.94) / measured;

      ink.font = `900 ${size}px ${family}`;
      ink.textAlign = "center";
      ink.textBaseline = "middle";
      ink.fillStyle = "#000";
      ink.fillText(word, width / 2, height / 2);

      const pixels = ink.getImageData(0, 0, probe.width, probe.height).data;

      const count = Math.max(24, Math.round((width / 100) * DENSITY));
      const gap = width / (count + 1);
      const next: Thread[] = [];

      for (let at = 0; at < count; at += 1) {
        const x = gap * (at + 1);
        const column = Math.min(probe.width - 1, Math.max(0, Math.round(x)));

        /* Walk the column and keep the stretches with ink in them. */
        const runs: number[] = [];
        let from = -1;

        for (let y = 0; y < probe.height; y += 1) {
          const on = pixels[(y * probe.width + column) * 4 + 3] > 128;
          if (on && from < 0) from = y;
          if (!on && from >= 0) {
            if (y - from > 1) runs.push(from, y);
            from = -1;
          }
        }
        if (from >= 0) runs.push(from, probe.height);

        next.push({
          x,
          runs: Float32Array.from(runs),
          amp: 0,
          phase: 0,
          /* Higher threads shimmer faster, as a shorter string does. */
          speed: 6 + (at / count) * 9,
          struck: -1,
        });
      }

      threads = next;
      born = performance.now();
    }

    function pluck(at: number, force: number) {
      const thread = threads[at];
      if (!thread) return;

      const now = performance.now();
      /* A cursor resting on a thread should not retrigger it every frame. */
      if (now - thread.struck < 70) return;
      thread.struck = now;

      /* Cloth is connected, so its neighbours move too. This is what turns a
         pluck into a ripple through the letters rather than one twitching line. */
      for (let off = -5; off <= 5; off += 1) {
        const near = threads[at + off];
        if (!near) continue;
        const share = force * (1 - Math.abs(off) / 6) ** 2;
        if (share <= 0) continue;
        near.amp = Math.min(1, near.amp + share);
        if (off === 0) near.phase = 0;
      }

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
      colour.frequency.exponentialRampToValueAtTime(
        Math.max(freq * 1.4, 220),
        t + 0.9,
      );

      const level = kit.ctx.createGain();
      const peak = 0.26 * (0.55 + force * 0.45);
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
      const nextWidth = box.clientWidth;
      const nextHeight = box.clientHeight;
      if (!nextWidth || !nextHeight) return;

      width = nextWidth;
      height = nextHeight;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      paper.setTransform(ratio, 0, 0, ratio, 0, 0);
      paper.lineCap = "round";
      paper.lineJoin = "round";

      /* Threads that stop dead at the edge of a box look cut off, and a cut off
         edge is the one thing that says "canvas". Fading them out lets the warp
         carry on past the frame, which is what gives it depth.

         Erased with `destination-out` rather than masked in CSS: it works
         everywhere, it composites once, and the horizontal pass doubles up in
         the corners, which is a vignette for free. */
      fadeY = paper.createLinearGradient(0, 0, 0, height);
      fadeY.addColorStop(0, "rgba(0,0,0,1)");
      fadeY.addColorStop(0.14, "rgba(0,0,0,0)");
      fadeY.addColorStop(0.86, "rgba(0,0,0,0)");
      fadeY.addColorStop(1, "rgba(0,0,0,1)");

      fadeX = paper.createLinearGradient(0, 0, width, 0);
      fadeX.addColorStop(0, "rgba(0,0,0,0.9)");
      fadeX.addColorStop(0.07, "rgba(0,0,0,0)");
      fadeX.addColorStop(0.93, "rgba(0,0,0,0)");
      fadeX.addColorStop(1, "rgba(0,0,0,0.9)");

      /* Re-weaving reads back a whole bitmap, so it waits for the drag to stop.
         Doing it on every resize event turns a window drag into a slideshow. */
      window.clearTimeout(rebuilding);
      rebuilding = window.setTimeout(() => void build(), threads.length ? 160 : 0);
    }

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      if (!paper) return;

      /* Clamped, so returning to a backgrounded tab resumes rather than jumps. */
      const dt = Math.min((now - last) / 1000, 1 / 20) || 0;
      last = now;

      paper.clearRect(0, 0, width, height);
      if (!threads.length) return;

      const arrived = Math.min((now - born) / 1100, 1);
      const reach = Math.max(28, Math.min(width / threads.length, 26));

      for (let at = 0; at < threads.length; at += 1) {
        const thread = threads[at];

        /* Each thread is strung in turn, left to right. */
        const mine = Math.max(
          0,
          Math.min((arrived - (at / threads.length) * 0.5) / 0.5, 1),
        );
        if (mine <= 0) continue;

        if (!still) {
          thread.phase += thread.speed * dt;
          /* Ring down. Higher threads die away sooner, as they do. */
          thread.amp *= Math.exp(-dt * (1.6 + (at / threads.length) * 0.9));
          if (thread.amp < 0.0015) thread.amp = 0;
        }

        /* A slow travelling breath, so the cloth is alive before it is touched
           and the word shifts like something hanging rather than printed. */
        const idle = still
          ? 0
          : Math.sin(now * 0.00075 + thread.x * 0.011) * 0.9;

        const swing = Math.sin(thread.phase) * thread.amp * reach + idle;
        const lit = Math.min(1, thread.amp * 1.7);
        const bottom = height * mine;

        /* The whole thread, faint: the warp you can see through. */
        paper.beginPath();
        for (let step = 0; step < STEPS; step += 1) {
          const t = step / (STEPS - 1);
          const y = bottom * t;
          const x = thread.x + swing * bow(height ? y / height : t);
          if (step === 0) paper.moveTo(x, y);
          else paper.lineTo(x, y);
        }
        paper.lineWidth = 1;
        paper.strokeStyle = lit
          ? `rgba(37, 99, 235, ${0.16 + lit * 0.44})`
          : "rgba(17, 24, 39, 0.085)";
        paper.stroke();

        /* And the stretches that fall inside a letter, firm: the cloth is the
           word. Each run is walked with the same bow, so the letter bends with
           the thread instead of standing still behind it. */
        paper.lineWidth = 2.7;
        paper.strokeStyle = lit
          ? `rgba(37, 99, 235, ${0.62 + lit * 0.38})`
          : "rgba(17, 24, 39, 0.9)";

        for (let run = 0; run < thread.runs.length; run += 2) {
          const from = thread.runs[run];
          const to = thread.runs[run + 1];
          if (from > bottom) continue;

          const end = Math.min(to, bottom);
          paper.beginPath();

          const parts = Math.max(2, Math.round((end - from) / 5));
          for (let step = 0; step <= parts; step += 1) {
            const y = from + ((end - from) * step) / parts;
            const x = thread.x + swing * bow(height ? y / height : 0);
            if (step === 0) paper.moveTo(x, y);
            else paper.lineTo(x, y);
          }

          paper.stroke();
        }
      }

      if (fadeY && fadeX) {
        paper.globalCompositeOperation = "destination-out";
        paper.fillStyle = fadeY;
        paper.fillRect(0, 0, width, height);
        paper.fillStyle = fadeX;
        paper.fillRect(0, 0, width, height);
        paper.globalCompositeOperation = "source-over";
      }
    }

    function onPointer(event: PointerEvent) {
      if (!box || !threads.length) return;
      const bounds = box.getBoundingClientRect();
      const x = event.clientX - bounds.left;

      const gap = bounds.width / (threads.length + 1);
      const at = Math.round(x / gap) - 1;
      if (at < 0 || at >= threads.length) return;

      /* Only on crossing, so moving along a thread does not hold it down. */
      if (at !== lastAt) {
        pluck(at, 0.9);
        lastAt = at;
        setTouched(true);
      }
    }

    function onLeave() {
      lastAt = -1;
    }

    function onKey(event: KeyboardEvent) {
      const step =
        event.key === "ArrowRight"
          ? PER_NOTE
          : event.key === "ArrowLeft"
            ? -PER_NOTE
            : 0;

      if (step) {
        event.preventDefault();
        lastAt = Math.max(
          0,
          Math.min(threads.length - 1, (lastAt < 0 ? -step : lastAt) + step),
        );
        pluck(lastAt, 1);
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
    last = performance.now();
    raf = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(rebuilding);
      watcher.disconnect();
      box.removeEventListener("pointermove", onPointer);
      box.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("keydown", onKey);
    };
  }, [word]);

  return (
    <div className={className}>
      <div
        ref={frame}
        tabIndex={0}
        role="group"
        aria-label={`${word}, woven into a loom of strings. Move across it, or use the arrow keys, to play it.`}
        className="relative w-full cursor-crosshair rounded-card outline-none focus-visible:ring-2 focus-visible:ring-active"
        style={{ height: "clamp(210px, 36svh, 380px)" }}
      >
        <canvas ref={surface} aria-hidden className="block h-full w-full" />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={() => setSound((was) => !was)}
          aria-pressed={sound}
          aria-label={sound ? "Mute the loom" : "Unmute the loom"}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-pill py-1.5 pr-3.5 pl-3 text-[13px] font-semibold transition-colors",
            sound
              ? "bg-ink text-white hover:opacity-85"
              : "bg-well text-quiet hover:text-ink",
          )}
        >
          {sound ? (
            <Volume2 aria-hidden className="size-[15px]" />
          ) : (
            <VolumeX aria-hidden className="size-[15px]" />
          )}
          {sound ? "Sound on" : "Muted"}
        </button>

        <p className="font-mono text-[9.5px] font-bold tracking-[0.2em] text-planned uppercase">
          {!sound
            ? "Unmute to hear it"
            : ready
              ? touched
                ? "Every note agrees with every other one"
                : "Run your cursor across the name"
              : "Click anywhere once to let it ring"}
        </p>
      </div>
    </div>
  );
}
