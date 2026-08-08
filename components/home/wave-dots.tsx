"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   A plane of dots, seen at an angle, with weight sitting on it.

   Two things, and the second is the point of the first. The field is a surface
   drawn in perspective - rows of dots receding towards a horizon, the whole
   sheet rolling in a slow wave. The spheres sit on that surface and are the only
   solid things in the picture, each one reflected in the sheet it is standing
   on.

   Dots rather than a line or a mesh, for the reason the mark is drawn rather
   than loaded: a stroke says "a path" and a sheet of separate marks says "a
   woven thing", which is the word this company is named for. A grid of dots also
   does what no stroke can - it shows a surface bending without drawing a single
   edge, because the spacing does all the telling.

   Painted on a 2D canvas rather than in a fragment shader. A shader's cost is
   per pixel and it needs a WebGL context, a compile step and a library; this is
   a few thousand filled circles a frame, which a phone does without noticing,
   and it needs nothing.

   The colours are read off the stylesheet rather than repeated here, so this,
   the name in the header and the gradient on the buttons are painted from one
   pair of values.
--------------------------------------------------------------------------- */

/* How many dots, and it is a lot of them.

   The gaps were the complaint and the arithmetic says why: sixty-eight dots
   spread across a row a full screen and a half wide is one every twenty pixels,
   which is a grid somebody counts rather than a surface. These numbers put them
   at roughly a third of that, which is close enough that a run of them reads as
   a line without ever quite being one.

   Five and a half thousand circles a frame sounds like a lot and is not: the
   cost that would have mattered is building a colour string per dot, and the
   colour of a dot depends only on which column it is in, so those are worked out
   once and the alpha is carried on the context instead. */
const ROWS = 52;
const COLUMNS = 108;

/**
 * Where the spheres stand.
 *
 * `along` is across the sheet and `depth` is how near, both nought to one; `size`
 * is a share of the box's height, so the group keeps its proportions whatever
 * shape the card is. `hue` is where each one sits on the mark's own ramp, so
 * every sphere is the same two colours at a different mix rather than a new
 * colour introduced for decoration.
 */
const SPHERES = [
  { along: 0.2, depth: 0.66, size: 0.05, hue: 0.95 },
  { along: 0.36, depth: 0.44, size: 0.03, hue: 0.55 },
  { along: 0.55, depth: 0.8, size: 0.075, hue: 0.12 },
  { along: 0.73, depth: 0.38, size: 0.024, hue: 0.34 },
  { along: 0.87, depth: 0.6, size: 0.042, hue: 0.02 },
] as const;

/** Where the mark's colours come from, and what to use before CSS has loaded. */
const FALLBACK = { from: "#2a98fe", to: "#06dbaf" };

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function readRgb(value: string, fallback: string): Rgb {
  const hex = (value.trim() || fallback).replace("#", "");
  const full =
    hex.length === 3
      ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      : hex.slice(0, 6);

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

const mixRgb = (a: Rgb, b: Rgb, t: number): Rgb => ({
  r: Math.round(a.r + (b.r - a.r) * t),
  g: Math.round(a.g + (b.g - a.g) * t),
  b: Math.round(a.b + (b.b - a.b) * t),
});

const shade = (c: Rgb, t: number): Rgb => ({
  r: Math.round(c.r * t),
  g: Math.round(c.g * t),
  b: Math.round(c.b * t),
});

const css = (c: Rgb, alpha = 1) =>
  `rgba(${c.r}, ${c.g}, ${c.b}, ${Math.max(0, Math.min(alpha, 1))})`;

export function WaveDots({
  className,
  /** How far the sheet rolls. */
  amplitude = 1,
  /** How fast the wave travels across it. */
  speed = 1,
  /** Whether the sheet tilts towards the pointer. */
  interactive = true,
}: {
  className?: string;
  amplitude?: number;
  speed?: number;
  interactive?: boolean;
}) {
  const surface = useRef<HTMLCanvasElement>(null);

  /* The live settings, for the loop to read. Written in an effect rather than
     during render, because assigning to a ref while rendering is a side effect
     in render - and read from the loop, so changing one sets a number rather
     than restarting the whole field. */
  const live = useRef({ amplitude, speed, interactive });

  useEffect(() => {
    live.current = { amplitude, speed, interactive };
  });

  useEffect(() => {
    const canvas = surface.current;
    const ink = canvas?.getContext("2d");
    if (!canvas || !ink) return;

    const roots = getComputedStyle(document.documentElement);
    const from = readRgb(
      roots.getPropertyValue("--color-thread-blue"),
      FALLBACK.from,
    );
    const to = readRgb(
      roots.getPropertyValue("--color-thread-teal"),
      FALLBACK.to,
    );

    /* Every dot's colour, worked out once.

       A dot's colour depends only on how far across the sheet it is, and there
       are a hundred and eight of those - so a hundred and nine strings, built at
       mount, replace five and a half thousand built every frame. Its alpha is
       carried on the context instead, which is a number rather than a string to
       parse. That is the whole reason this many dots is affordable. */
    const columnInk = Array.from({ length: COLUMNS + 1 }, (_unused, col) => {
      const c = mixRgb(from, to, col / COLUMNS);
      return `rgb(${c.r}, ${c.g}, ${c.b})`;
    });

    /* Asked for less motion, and this is nothing but motion. One frame is drawn
       so the card is not blank, and the loop never starts. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;

    const size = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = box.width;
      height = box.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      /* Drawn in CSS pixels and scaled once, so nothing below has to know what
         kind of screen it is on. */
      ink.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const wanted = { x: 0.5, y: 0.5, pull: 0 };
    const held = { x: 0.5, y: 0.5, pull: 0 };

    /**
     * Where a point on the sheet lands on the screen.
     *
     * The sheet is flat and level; what makes it a surface rather than a grid is
     * that near rows are further apart than far ones and wider than them. Both
     * come from raising the depth to a power, which is the whole of the
     * perspective here - there is no camera and no matrix, because a sheet seen
     * from one fixed place needs neither.
     */
    const place = (along: number, depth: number, t: number) => {
      const now = live.current;
      /* Nought where the pointer is not wanted, so the two lines below can be
         written once rather than twice with a branch between them. */
      const lean = now.interactive ? held.pull : 0;

      /* Rows crowd towards the horizon. */
      const near = Math.pow(depth, 2.1);

      /* The horizon sits above the middle, and the pointer tips it a little -
         which reads as leaning over the sheet rather than as the sheet moving. */
      const horizon = height * (0.18 - (held.y - 0.5) * 0.06 * lean);
      const groundY = horizon + (height * 1.02 - horizon) * near;

      /* Rows widen as they come forward, and the whole sheet slides with the
         pointer, so the far edge moves less than the near one. That difference
         is what makes it read as depth rather than as a picture being dragged. */
      const spread = 0.34 + 1.15 * near;
      const slide = (held.x - 0.5) * width * 0.16 * near * lean;
      const x = width / 2 + (along - 0.5) * width * spread + slide;

      /* And the roll, which is the whole thing.

         One wave dominates and it runs across the sheet rather than into it -
         `along` carries almost all of the weight and `depth` only a little. That
         ratio is the difference between a wave and a texture: when every row
         crests in nearly the same place, the eye joins them into one surface
         lifting; when each row crests somewhere else, it reads as noise.

         The second wave is long, slow and turning the other way. It is there so
         the first never repeats exactly - two waves at unrelated rates do not
         come back into step - and it is a third of the height, so it bends the
         crest without ever competing to be it. */
      const roll =
        Math.sin(along * 2.35 - depth * 0.55 + t * 0.42) * 0.78 +
        Math.sin(along * 1.05 - depth * 1.5 - t * 0.23) * 0.3;

      const y = groundY + roll * height * 0.115 * now.amplitude * near;

      return { x, y, near };
    };

    const drawSphere = (
      x: number,
      y: number,
      r: number,
      colour: Rgb,
      depth: number,
    ) => {
      /* The reflection first, so the ball sits on top of its own. It starts at
         the ball's foot rather than below it - a gap between a thing and its
         reflection is the thing hovering - and it fades out fast, because a
         sheet is a surface with a sheen and not a mirror. */
      const pool = ink.createLinearGradient(x, y + r * 0.7, x, y + r * 2.4);
      pool.addColorStop(0, css(colour, 0.26 * depth));
      pool.addColorStop(1, css(colour, 0));

      ink.beginPath();
      ink.ellipse(x, y + r * 1.45, r * 0.7, r * 0.85, 0, 0, Math.PI * 2);
      ink.fillStyle = pool;
      ink.fill();

      /* The ball. Lit from up and to the left, every one of them from the same
         place - five balls each lit from its own direction is five balls in five
         different rooms. */
      const lit = ink.createRadialGradient(
        x - r * 0.34,
        y - r * 0.38,
        r * 0.04,
        x,
        y,
        r * 1.05,
      );
      lit.addColorStop(0, css(mixRgb(colour, { r: 255, g: 255, b: 255 }, 0.82)));
      lit.addColorStop(0.34, css(colour));
      lit.addColorStop(1, css(shade(colour, 0.62)));

      ink.beginPath();
      ink.arc(x, y, r, 0, Math.PI * 2);
      ink.fillStyle = lit;
      ink.fill();

      /* One small highlight on top of the gradient. It is the difference between
         a shaded circle and something with a surface. */
      const spark = ink.createRadialGradient(
        x - r * 0.36,
        y - r * 0.44,
        0,
        x - r * 0.36,
        y - r * 0.44,
        r * 0.42,
      );
      spark.addColorStop(0, "rgba(255,255,255,0.9)");
      spark.addColorStop(1, "rgba(255,255,255,0)");

      ink.beginPath();
      ink.arc(x - r * 0.36, y - r * 0.44, r * 0.42, 0, Math.PI * 2);
      ink.fillStyle = spark;
      ink.fill();
    };

    const draw = (ms: number) => {
      const now = live.current;
      const t = (ms / 1000) * now.speed;

      ink.clearRect(0, 0, width, height);

      held.x += (wanted.x - held.x) * 0.05;
      held.y += (wanted.y - held.y) * 0.05;
      held.pull += (wanted.pull - held.pull) * 0.05;

      for (let row = 0; row < ROWS; row += 1) {
        const depth = (row + 0.5) / ROWS;

        for (let col = 0; col <= COLUMNS; col += 1) {
          const along = col / COLUMNS;
          const { x, y, near } = place(along, depth, t);

          if (x < -20 || x > width + 20) continue;

          /* Near dots are larger and firmer, far ones smaller and fainter. That
             is the whole of the depth cue, and it is why the field can be one
             flat colour and still read as a surface.

             Finer than they were, and there are more of them. A wave is read
             from the shape a run of marks makes, not from the marks - so the
             smaller each one is, the more clearly the run is a curve rather than
             a row of dots that happens to bend.

             Faded at both ends of every row, and again into the horizon, so the
             sheet dissolves into the card on three sides instead of stopping at
             an edge. */
          const edge = Math.sin(along * Math.PI);
          const r = 0.42 + 1.6 * near;
          const alpha =
            (0.04 + 0.34 * near) *
            (0.2 + 0.8 * edge) *
            Math.min(1, 0.25 + depth * 2.2);

          ink.globalAlpha = Math.min(alpha, 1);
          ink.fillStyle = columnInk[col];
          ink.beginPath();
          ink.arc(x, y, r, 0, Math.PI * 2);
          ink.fill();
        }
      }

      /* Back to solid before the spheres, which carry their own alpha in their
         gradients. Left at whatever the last dot set, every ball would be as
         faint as the corner of the sheet. */
      ink.globalAlpha = 1;

      /* Far to near, so a nearer ball covers a further one rather than the order
         they happen to be written in deciding it. */
      for (const sphere of [...SPHERES].sort((a, b) => a.depth - b.depth)) {
        const { x, y, near } = place(sphere.along, sphere.depth, t);
        const r = height * sphere.size * (0.55 + 0.75 * near);

        /* Its foot on the sheet, not its middle. Placed by the centre, a ball
           sinks into the surface by its own radius; placed by the foot, it
           stands on it - and it rides the wave, because the point it stands on
           is a point on the wave. */
        drawSphere(x, y - r, r, mixRgb(from, to, sphere.hue), near);
      }
    };

    size();
    draw(0);

    let frame = 0;
    let seen = true;

    const loop = (ms: number) => {
      frame = requestAnimationFrame(loop);
      /* Nothing is drawn for a card four screens down or a tab in the
         background. A field that keeps painting where it cannot be seen is a
         phone's battery spent on nothing. */
      if (!seen || document.hidden) return;
      draw(ms);
    };

    if (!still) frame = requestAnimationFrame(loop);

    const watcher = new ResizeObserver(() => {
      size();
      if (still) draw(0);
    });
    watcher.observe(canvas);

    const watchingView = new IntersectionObserver(
      (entries) => {
        seen = entries[0].isIntersecting;
      },
      { threshold: 0 },
    );
    watchingView.observe(canvas);

    const onMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      wanted.x = (event.clientX - box.left) / box.width;
      wanted.y = (event.clientY - box.top) / box.height;
      wanted.pull = 1;
    };

    const onLeave = () => {
      wanted.x = 0.5;
      wanted.y = 0.5;
      wanted.pull = 0;
    };

    if (!still) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      watcher.disconnect();
      watchingView.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={surface}
      aria-hidden
      className={cn("block size-full", className)}
    />
  );
}
