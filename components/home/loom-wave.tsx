"use client";

import { useCallback, useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   The loom, as a wave of threads - and playable.

   A dense field of vertical strands standing on a slow swell, coloured from the
   mark's blue on the left to its green on the right, with one bright thread
   running through the middle of them. It reads as a waveform and it is meant
   to: a loom's warp is a row of parallel threads, and a row of parallel threads
   under a travelling wave is what this company is named after doing.

   Two things carry the whole look, and neither is the wave.

   The first is that most strands are short and a very few are tall. The short
   ones crowd along the swell and make a solid ribbon of it; the tall ones are
   rare enough to read as spikes rather than as a comb. A field where every
   strand is near the average is a fence.

   The second is that the colour arrives in patches rather than as an even ramp.
   A slow wave of its own decides how lit each part of the field is, so the
   colour gathers into runs against the ink either side of them - which is what
   makes it look like a signal and not a gradient with lines drawn on it.

   It is played the same way the woven version was: crossing a strand plucks it,
   its neighbours take a share of the movement, and a note goes with it. The
   scale is pentatonic so that dragging across a hundred of them cannot sound
   wrong, and the audio does not exist until the first gesture anywhere on the
   page has given a browser its permission.

   Everything not moving is deterministic. Heights, alphas and families all come
   from one hash of the strand's index, so the field is the same on the server's
   render and the browser's and does not boil between frames.
--------------------------------------------------------------------------- */

/**
 * How far apart the strands stand, in pixels.
 *
 * Six and a half, which is far enough that every one of them has white either
 * side of it. It was three, and three is not a field of threads - it is a solid
 * mass with a texture. What makes this read as a warp rather than as a smudge is
 * that you can see between them.
 */
const GAP = 6.5;

/**
 * The swell they stand on: three waves, none of their rates a multiple of
 * another - so the shape never repeats inside the width and the eye cannot find
 * the loop. One sine is a rope; three is water.
 */
const SWELL = [
  { reach: 0.088, turns: 3.05, speed: 0.14 },
  { reach: 0.042, turns: 1.35, speed: -0.09 },
  { reach: 0.022, turns: 5.4, speed: 0.06 },
] as const;

/**
 * The ribbon, and the traces that stand clear of it.
 *
 * `CORE` is how deep the band is where the field is quiet and `SWELL_BULK` how
 * much deeper it gets where the field is busy; `TRACE` is the rare tall one,
 * which is nearly the whole box.
 */
const CORE = 0.1;
const BULK = 0.3;
const TRACE = 0.9;

/**
 * How often a strand is a tall trace rather than part of the band.
 *
 * About one in eight. Fewer and the field is a plain ribbon; more and the
 * traces stop being exceptions and become a second, taller comb.
 */
const TRACE_SHARE = 0.87;

/** Ink, for the strands not carrying colour, and the blue a struck one rings. */
const INK: Rgb = [16, 28, 52];
const RUNG: Rgb = [90, 200, 255];

/* The pentatonic, and where it starts.

   Pentatonic because every note in it agrees with every other one: somebody
   dragging a cursor across a field of strands is not composing, so the scale
   has to make whatever they do sound deliberate. Many strands share each note,
   or a sweep is a siren rather than a run. */
const SCALE = [0, 3, 5, 7, 10];
const ROOT = 174.61;
const PER_NOTE = 14;

type Rgb = readonly [number, number, number];

function ink(value: string, fallback: Rgb): Rgb {
  const hex = value.trim();
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return fallback;
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

const blend = (a: Rgb, b: Rgb, u: number): Rgb => [
  a[0] + (b[0] - a[0]) * u,
  a[1] + (b[1] - a[1]) * u,
  a[2] + (b[2] - a[2]) * u,
];

const css = (c: Rgb, a: number) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;

/**
 * A number between nought and one that is always the same for the same strand.
 *
 * The usual trick: take something irrational, multiply, keep the fraction.
 * Neighbouring indices give unrelated answers, which is the whole requirement -
 * a field where each strand knows nothing about the one beside it has texture
 * rather than a pattern.
 */
const speck = (n: number, salt: number) => {
  const v = Math.sin(n * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

function pitchOf(strand: number) {
  const note = Math.floor(strand / PER_NOTE);
  const step =
    SCALE[note % SCALE.length] + 12 * Math.floor(note / SCALE.length);
  return ROOT * 2 ** (step / 12);
}

interface Strand {
  /** How far it has been pushed from where it was strung, and where in the ring. */
  amp: number;
  phase: number;
  /** When it was last struck, so a resting cursor cannot retrigger it. */
  struck: number;
}

export function LoomWave({
  className,
  speed = 1,
}: {
  className?: string;
  speed?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLCanvasElement>(null);
  const audio = useRef<{ ctx: AudioContext; master: GainNode } | null>(null);

  /* The room, built once and only when it is first wanted.

     A short delay with a little feedback, which is the cheapest convincing room
     there is - without it the notes sound struck inside a cupboard. */
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

    void audio.current.ctx.resume();
  }, []);

  /* The first real gesture anywhere is what a browser counts as permission, so
     that is what opens the audio. Resuming a running context is free, which is
     why this does not bother being clever about unhooking. */
  useEffect(() => {
    const unlock = () => ensure();
    const kinds = ["pointerdown", "touchstart", "keydown", "click"] as const;
    for (const kind of kinds) {
      window.addEventListener(kind, unlock, { passive: true });
    }
    return () => {
      for (const kind of kinds) window.removeEventListener(kind, unlock);
    };
  }, [ensure]);

  useEffect(
    () => () => {
      void audio.current?.ctx.close();
      audio.current = null;
    },
    [],
  );

  useEffect(() => {
    const wrap = box.current;
    const canvas = sheet.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const style = getComputedStyle(document.documentElement);
    const BLUE = ink(
      style.getPropertyValue("--color-thread-blue"),
      [42, 152, 254],
    );
    const TEAL = ink(
      style.getPropertyValue("--color-thread-teal"),
      [6, 219, 175],
    );

    let width = 0;
    let height = 0;
    let count = 0;
    let strands: Strand[] = [];
    let frame = 0;
    let seen = true;
    let clock = 0;
    let last = 0;
    let dpr = 1;
    let lastAt = -1;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    /** Where the swell is, at this point across the field, at this moment. */
    const ride = (along: number, t: number) => {
      let y = 0;
      for (const wave of SWELL) {
        y +=
          height *
          wave.reach *
          Math.sin(along * Math.PI * 2 * wave.turns + t * wave.speed * speed);
      }
      return height / 2 + y;
    };

    /**
     * How busy this part of the field is, nought to one.
     *
     * One envelope, and both the height of the band and its colour are read off
     * it - which is the whole difference between this and a row of lines with
     * random lengths. In the picture this is drawn from, the tall strands arrive
     * in runs and the bright colour arrives in the same runs: a stretch of field
     * is loud, and being loud is what makes it both tall and lit.
     *
     * Two slow waves multiplied rather than one. One gives evenly spaced bands,
     * which is a pattern; two at rates that do not divide into each other give
     * runs of different lengths, which is a signal.
     */
    const bulk = (along: number, t: number) => {
      const a = 0.5 + 0.5 * Math.sin(along * Math.PI * 4.1 - t * 0.2 * speed);
      const b = 0.5 + 0.5 * Math.sin(along * Math.PI * 1.7 + t * 0.11 * speed);
      return Math.pow(a * b, 0.55);
    };

    function pluck(at: number, force: number) {
      const strand = strands[at];
      if (!strand) return;

      const now = performance.now();
      /* A cursor resting on a strand should not retrigger it every frame. */
      if (now - strand.struck < 70) return;
      strand.struck = now;

      /* Cloth is connected, so its neighbours move too. This is what turns a
         pluck into a ripple across the field rather than one twitching line. */
      for (let off = -14; off <= 14; off += 1) {
        const near = strands[at + off];
        if (!near) continue;
        const share = force * (1 - Math.abs(off) / 15) ** 2;
        if (share <= 0) continue;
        near.amp = Math.min(1, near.amp + share);
        if (off === 0) near.phase = 0;
      }

      const kit = audio.current;
      if (!kit || kit.ctx.state !== "running") return;

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

    const draw = (t: number, step: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width < 2 || height < 2) return;

      ctx.lineCap = "butt";

      for (let i = 0; i <= count; i += 1) {
        const along = count === 0 ? 0 : i / count;
        const strand = strands[i];

        /* Where it stands, and how far its own ringing has moved it. The ring
           decays on its own clock so a struck field settles back to still. */
        let sway = 0;
        if (strand && strand.amp > 0.001) {
          strand.phase += step * 7.5;
          strand.amp *= Math.pow(0.22, step);
          sway = Math.sin(strand.phase) * strand.amp * height * 0.09;
        }

        const x = along * width;
        const middle = ride(along, t) + sway;

        const grit = speck(i, 1);
        const glow = bulk(along, t);
        const hue = blend(BLUE, TEAL, along);
        const ringing = strand ? Math.min(1, strand.amp) : 0;

        /* Two kinds of strand, and they are sized by different things.

           A trace is nearly the height of the box whatever else is going on -
           it is a spike, and a spike that grows and shrinks with the band is not
           a spike. Everything else belongs to the band, and the band's depth is
           the envelope: deep where the field is busy, shallow where it is not,
           with each strand taking its own share of whatever is going. */
        const tall = grit > TRACE_SHARE;
        const reach = tall
          ? height * TRACE * 0.5 * (0.7 + 0.3 * speck(i, 6))
          : height * (CORE + BULK * glow) * 0.5 * (0.45 + 0.55 * grit);

        const kind = speck(i, 2);

        let paint: Rgb;
        let alpha: number;
        let wide: number;

        if (tall) {
          paint = blend(INK, hue, 0.25 + glow * 0.35);
          alpha = 0.09 + 0.13 * speck(i, 3);
          wide = 1.2;
        } else if (kind < glow * glow) {
          /* Squared, so colour only takes a strand where the field is properly
             busy. Linear, half the field ended up coloured and the runs stopped
             being runs. */
          paint = hue;
          alpha = 0.5 + 0.42 * glow;
          wide = 1.8;
        } else {
          paint = INK;
          alpha = 0.3 + 0.32 * speck(i, 4);
          wide = 1.7;
        }

        if (ringing > 0.01) {
          paint = blend(paint, RUNG, ringing);
          alpha = Math.min(1, alpha + ringing * 0.4);
        }

        /* Thinned at both ends, so the cloth runs out of the box rather than
           stopping at it. Squared, because a straight fade reads as a band with
           an edge at each end. */
        const edge = Math.min(1, Math.min(along, 1 - along) / 0.1);
        alpha *= edge * edge;

        ctx.strokeStyle = css(paint, alpha);
        ctx.lineWidth = wide;
        ctx.beginPath();
        ctx.moveTo(x, middle - reach);
        ctx.lineTo(x, middle + reach);
        ctx.stroke();

        /* A dot on the tip of the tallest traces. It is the one thing here that
           is not a thread, and it is what stops them reading as scratches. */
        if (tall && grit > 0.965) {
          ctx.fillStyle = css(hue, Math.min(1, alpha * 3));
          ctx.beginPath();
          ctx.arc(x, middle - reach, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* And the thread through the middle of them.

         Drawn three times, widest and faintest first, which is a glow without a
         blur filter - at this width three passes is cheaper than asking the
         canvas for one. White rather than coloured, because everything it
         crosses is coloured and a light line is the only mark that reads at
         every point along it. */
      const path = () => {
        ctx.beginPath();
        for (let n = 0; n <= 240; n += 1) {
          const along = n / 240;
          const x = along * width;
          const y = ride(along, t);
          if (n === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      };

      ctx.lineCap = "round";
      for (const pass of [
        { wide: 8, alpha: 0.2 },
        { wide: 3.4, alpha: 0.45 },
        { wide: 1.5, alpha: 0.95 },
      ]) {
        ctx.strokeStyle = `rgba(255,255,255,${pass.alpha})`;
        ctx.lineWidth = pass.wide;
        path();
        ctx.stroke();
      }
    };

    const tick = (now: number) => {
      const gap = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      clock += gap;
      draw(clock, gap);
      frame = requestAnimationFrame(tick);
    };

    const run = () => {
      cancelAnimationFrame(frame);
      if (still.matches || !seen) {
        draw(clock, 0);
        return;
      }
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const size = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      count = Math.max(24, Math.round(width / GAP));
      /* Kept across a resize where they can be, so a window being dragged does
         not silence a field somebody is in the middle of playing. */
      strands = Array.from(
        { length: count + 1 },
        (_unused, i) => strands[i] ?? { amp: 0, phase: 0, struck: -1 },
      );

      draw(clock, 0);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const at = Math.round(((event.clientX - rect.left) / rect.width) * count);
      if (at < 0 || at > count) return;
      /* Only on crossing, so moving along a strand does not hold it down. */
      if (at !== lastAt) {
        pluck(at, 0.9);
        lastAt = at;
      }
    };

    const onLeave = () => {
      lastAt = -1;
    };

    const onKey = (event: KeyboardEvent) => {
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
          Math.min(count, (lastAt < 0 ? -step : lastAt) + step),
        );
        pluck(lastAt, 1);
        return;
      }

      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        pluck(Math.max(0, lastAt), 1);
      }
    };

    const bounds = new ResizeObserver(size);
    bounds.observe(wrap);

    /* Off the screen, it stops. */
    const eye = new IntersectionObserver(
      (entries) => {
        seen = entries[0]?.isIntersecting ?? true;
        run();
      },
      { threshold: 0 },
    );
    eye.observe(wrap);

    wrap.addEventListener("pointermove", onPointer);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("keydown", onKey);
    still.addEventListener("change", run);

    size();
    run();

    return () => {
      cancelAnimationFrame(frame);
      bounds.disconnect();
      eye.disconnect();
      wrap.removeEventListener("pointermove", onPointer);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("keydown", onKey);
      still.removeEventListener("change", run);
    };
  }, [speed]);

  return (
    <div className={className}>
      <div
        ref={box}
        tabIndex={0}
        role="group"
        aria-label="A loom of threads under a wave. Move across it, or use the arrow keys, to play it."
        className="relative w-full cursor-crosshair rounded-card outline-none focus-visible:ring-2 focus-visible:ring-ink"
        /* Height off the width rather than the window's.

           The strands are placed across the width and their heights are a share
           of the box, so a box measured against the window changed the cloth's
           proportions every time somebody resized: tall and empty on a short
           wide screen, cramped on a tall narrow one. */
        style={{ height: "clamp(150px, 21vw, 380px)" }}
      >
        <canvas ref={sheet} aria-hidden className="block h-full w-full" />
      </div>
    </div>
  );
}
