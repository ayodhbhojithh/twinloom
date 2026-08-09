"use client";

import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   The loom, as a wave of threads.

   A field of vertical threads standing on a slow swell, with one bright thread
   running through the middle of them. It reads as a waveform and it is meant to:
   a loom's warp is a row of parallel threads, and a row of parallel threads
   under a travelling wave is what this company is named after doing.

   It is a picture and nothing else. An earlier version wove a word out of the
   same threads and played a note for every one you crossed; the word went first
   and the instrument has gone with it. Nothing here answers to a pointer,
   nothing makes a sound, and there is no state outside the drawing loop.

   Three things carry the look, and the wave is the least of them.

   The colour is a ramp, not a rule. It was a blend from the mark's blue to its
   green with an envelope deciding which threads took colour at all - a
   reasonable idea that comes out looking like a gradient with lines drawn on it.
   What the picture wants is nine stops that go bright, near-black, bright again,
   so the field arrives in runs of colour with ink between them and the runs are
   placed rather than emergent.

   The height is a sum, not a shape. Two squared sines at different rates make
   the broad clusters and two more, indexed by thread rather than by position,
   roughen every thread inside them. Squared because a sine spends half its life
   below zero and what is wanted is a swell that never inverts: `sin²` is a row
   of humps.

   And there are two layers. The ghosts stand taller than the field and are drawn
   in pale grey-blue behind it, so the band has something to sit in front of. One
   layer of threads is a graph; two is a picture of one.

   The count is fixed rather than taken from the width, because the roughness is
   indexed by thread - a field that changed its count with the window would
   change its texture every time somebody dragged an edge.
--------------------------------------------------------------------------- */

/** How many threads, whatever the box is. */
const COUNT = 315;

/**
 * How much of the box the field is allowed, and where its middle sits.
 *
 * Every vertical number below is a share of the height, and they add up: the
 * floor, both clusters, both roughnesses and the ghosts' extra reach. Summed at
 * their worst that came to more than half the box from the middle, which is a
 * field with its tallest threads sliced off at the top and bottom edges.
 *
 * `ROOM` scales all of them together so the worst case fits, and the middle sits
 * at the middle - nothing to clip, and one number to change if the box ever gets
 * taller.
 */
const ROOM = 0.78;
const CENTRE = 0.5;

/** The swell: one fast wave and one slow, both as shares of the height. */
const RIDE = [
  { reach: 0.069, turns: 9, phase: -0.75, speed: 0.1 },
  { reach: 0.027, turns: 2.55, phase: 0.6, speed: -0.06 },
] as const;

/** A floor every thread gets, and the clusters that lift it in places. */
const FLOOR = 0.215;
const SWELL = [
  { reach: 0.131, turns: 4.9, phase: 0.15, speed: 0.07 },
  { reach: 0.065, turns: 10.1, phase: 1.5, speed: -0.05 },
] as const;

/** And the roughness, by thread, so the band's edge is ragged rather than drawn. */
const ROUGH = [
  { reach: 0.031, rate: 0.7 },
  { reach: 0.019, rate: 1.87 },
] as const;

/** How much further the ghosts reach than the field in front of them. */
const GHOST = 0.092;
const GHOST_ROUGH = 0.038;

/* The ramp, and the one behind it.

   Nine stops rather than two colours mixed. The middle of this list is where the
   field is brightest and the quarter points are where it is nearly black, which
   is a decision about composition - not something a blend between two brand
   colours arrives at on its own. */
const RAMP = [
  [0, "#2a56ff"],
  [0.16, "#1f47d8"],
  [0.28, "#0b1c59"],
  [0.4, "#16347a"],
  [0.5, "#1cc6ff"],
  [0.61, "#0d90dc"],
  [0.72, "#0d215d"],
  [0.84, "#21afbf"],
  [1, "#3bd8c1"],
] as const;

const GHOST_RAMP = [
  [0, "#a8b8ff"],
  [0.28, "#879bd7"],
  [0.5, "#96e5ff"],
  [0.75, "#8ab0da"],
  [1, "#9fe5d2"],
] as const;

type Rgb = readonly [number, number, number];

const ink = (hex: string): Rgb => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

/** A ramp read into numbers once, so a frame is arithmetic rather than parsing. */
const read = (ramp: readonly (readonly [number, string])[]) =>
  ramp.map(([at, hex]) => [at, ink(hex)] as const);

const RAMP_RGB = read(RAMP);
const GHOST_RGB = read(GHOST_RAMP);

/** The colour at a point along a ramp. */
function sample(ramp: readonly (readonly [number, Rgb])[], along: number) {
  const u = along <= 0 ? 0 : along >= 1 ? 1 : along;
  let n = 0;
  while (n < ramp.length - 2 && ramp[n + 1][0] < u) n += 1;
  const [fromAt, from] = ramp[n];
  const [toAt, to] = ramp[n + 1];
  const step = toAt === fromAt ? 0 : (u - fromAt) / (toAt - fromAt);
  return [
    from[0] + (to[0] - from[0]) * step,
    from[1] + (to[1] - from[1]) * step,
    from[2] + (to[2] - from[2]) * step,
  ] as const;
}

const css = (c: Rgb, a: number) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;

export function LoomWave({
  className,
  speed = 1,
}: {
  className?: string;
  speed?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = box.current;
    const canvas = sheet.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let seen = true;
    let clock = 0;
    let last = 0;
    let dpr = 1;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    /** Where the swell is, at this point across the field, at this moment. */
    const ride = (along: number, t: number) => {
      let y = height * CENTRE;
      for (const wave of RIDE) {
        y +=
          height *
          ROOM *
          wave.reach *
          Math.sin(
            along * Math.PI * wave.turns + wave.phase + t * wave.speed * speed,
          );
      }
      return y;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width < 2 || height < 2) return;

      ctx.lineCap = "round";

      /* Two passes over the same threads: the ghosts first, so the field is
         drawn in front of them rather than through them. Interleaved, every
         ghost would sit on top of the thread beside it. */
      for (const ghosts of [true, false]) {
        for (let i = 0; i < COUNT; i += 1) {
          const along = i / (COUNT - 1);
          const x = along * width;
          const middle = ride(along, t);

          let reach = height * ROOM * FLOOR;
          for (const wave of SWELL) {
            reach +=
              height *
              ROOM *
              wave.reach *
              Math.sin(
                along * Math.PI * wave.turns +
                  wave.phase +
                  t * wave.speed * speed,
              ) **
                2;
          }
          for (const grain of ROUGH) {
            reach += height * ROOM * grain.reach * Math.sin(i * grain.rate);
          }

          /* Thinned at both ends. An arch rather than a ramp, because the field
             has two ends and both of them should run out. */
          const edge = Math.sin(Math.PI * along);

          if (ghosts) {
            reach += height * ROOM * (GHOST + GHOST_ROUGH * Math.sin(i * 0.41));
            ctx.strokeStyle = css(sample(GHOST_RGB, along), 0.16 + edge * 0.24);
            ctx.lineWidth = i % 4 === 0 ? 0.9 : 0.6;
          } else {
            ctx.strokeStyle = css(
              sample(RAMP_RGB, along),
              (0.34 + edge * 0.64) * 0.85,
            );
            /* Three weights on a seven and a three. Every thread the same width
               is a comb; a heavier one every seventh gives the field its grain
               without any of them reading as placed. */
            ctx.lineWidth = i % 7 === 0 ? 2.1 : i % 3 === 0 ? 1.3 : 0.85;
          }

          ctx.beginPath();
          ctx.moveTo(x, middle - reach);
          ctx.lineTo(x, middle + reach);
          ctx.stroke();

          /* A dot on some of the tips. It is the one thing here that is not a
             thread, and it is what stops the tallest reading as scratches. */
          if (!ghosts && (i % 5 === 0 || i % 11 === 0)) {
            const dot = i % 11 === 0 ? 1.35 : 0.92;
            ctx.fillStyle = css(sample(RAMP_RGB, along), 0.35 + edge * 0.55);
            ctx.beginPath();
            ctx.arc(x, middle - reach, dot, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, middle + reach, dot * 0.9, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      /* And the thread through the middle of them.

         Four passes, widest and faintest first, which is a glow without a blur
         filter - at this width four strokes is cheaper than asking the canvas
         for one. Near-white rather than coloured, because everything it crosses
         is coloured and a light line is the only mark that reads at every point
         along it. */
      const path = () => {
        ctx.beginPath();
        for (let n = 0; n <= 320; n += 1) {
          const along = n / 320;
          const x = along * width;
          const y = ride(along, t);
          if (n === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      };

      for (const pass of [
        { wide: 14, tint: "142,241,255", alpha: 0.13 },
        { wide: 7, tint: "216,253,255", alpha: 0.3 },
        { wide: 3.7, tint: "255,255,255", alpha: 0.9 },
        { wide: 1.2, tint: "247,255,255", alpha: 0.95 },
      ]) {
        ctx.strokeStyle = `rgba(${pass.tint},${pass.alpha})`;
        ctx.lineWidth = pass.wide;
        path();
        ctx.stroke();
      }

      /* The ends given away, by erasing rather than by painting.

         It used to fill the two ends with the page's own grey, which meant this
         drawing had to know what colour the page behind it was - and it had the
         wrong one, so both ends came out as pale rectangles laid over a slightly
         darker ground. `destination-out` takes the alpha away instead: the
         threads simply stop existing towards the edges and whatever is behind
         shows through, on any page and any colour. */
      ctx.globalCompositeOperation = "destination-out";
      const fade = ctx.createLinearGradient(0, 0, width, 0);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(0.05, "rgba(0,0,0,0.72)");
      fade.addColorStop(0.12, "rgba(0,0,0,0)");
      fade.addColorStop(0.88, "rgba(0,0,0,0)");
      fade.addColorStop(0.95, "rgba(0,0,0,0.72)");
      fade.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      const gap = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      clock += gap;
      draw(clock);
      frame = requestAnimationFrame(tick);
    };

    const run = () => {
      cancelAnimationFrame(frame);
      if (still.matches || !seen) {
        draw(clock);
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
      draw(clock);
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

    still.addEventListener("change", run);
    size();
    run();

    return () => {
      cancelAnimationFrame(frame);
      bounds.disconnect();
      eye.disconnect();
      still.removeEventListener("change", run);
    };
  }, [speed]);

  return (
    <div className={className}>
      <div
        ref={box}
        aria-hidden
        className="relative w-full"
        /* Height off the width rather than the window's.

           The threads are placed across the width and their heights are a share
           of the box, so a box measured against the window changed the cloth's
           proportions every time somebody resized: tall and empty on a short
           wide screen, cramped on a tall narrow one. */
        style={{ height: "clamp(190px, 23vw, 320px)" }}
      >
        <canvas ref={sheet} className="block h-full w-full" />
      </div>
    </div>
  );
}
