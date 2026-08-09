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

/* A halftone lattice: regular grid, and the dot sizes carry the picture.

   This can be dense because size is doing the drawing. Eighteen rows was the
   answer while the wave was carried by where the dots were - each row had to be
   separately traceable, so the field had to be sparse. A halftone works the
   other way: the grid stays regular and the crest of a swell is where the dots
   are fat, the hollow is where they shrink to almost nothing. The shape is in
   the weight, which is legible at any density and is what makes a printed
   halftone a picture rather than a screen. */
const ROWS = 54;
const COLUMNS = 214;

/* The spheres are gone.

   Seven glossy balls stood on the sheet and rode the wave, and taking them off
   is not a loss of detail - it is what the drawing was for. The field is a
   halftone: five and a half thousand dots whose size and spacing are the whole
   picture. A row of shaded spheres in front of it is a second picture, drawn in
   a different language, standing where the first one is densest.

   What went with them: `drawSphere` and its four gradients a frame, the depth
   sort, and the clamp that kept a ball off the card's edge. Only `place` is
   left, and only the dots read it now.

*/

/**
 * How far the whole field sits to the right of centre, as a share of the width.
 *
 * Nought, now that the words are centred.
 *
 * It was a sixth of the width to the right, and that was right at the time: the
 * card's left was a headline, a paragraph and two buttons, and its right was
 * this. Centred then, the field would have spent its densest rows under the type
 * and run out of card on the side actually being looked at.
 *
 * The words moved to the middle and the reason went with them. A sheet pushed
 * off to one side under a centred block of type is a sheet that has been pushed,
 * and the swell's own middle - the part worth seeing - was hanging off the right
 * edge of the card.
 *
 * Kept as a number rather than deleted, because where the field sits is a
 * decision and one that has already changed once.
 */
const SHIFT = 0;

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

export function WaveDots({
  className,
  /** How far the sheet rolls. */
  amplitude = 1,
  /** How fast the wave travels across it. */
  speed = 1,
  /** Whether the sheet tilts towards the pointer. */
  interactive = true,
  /**
   * Where in the wave to stand.
   *
   * Changing it moves the surface to a different part of the same swell, and it
   * glides rather than cuts - the loop eases towards whatever it is given. That
   * is what makes it worth having: the card's arrows change this, so pressing
   * one visibly rolls the wave instead of swapping one identical white slide for
   * another.
   */
  phase = 0,
  /**
   * How much of the lattice to draw, against the full one.
   *
   * The counts above are set for a field that fills the window. The same numbers
   * inside a thumbnail two hundred pixels wide are eleven thousand dots inside
   * an area that can show a few hundred - which costs the same as the full field
   * and looks like grey paper. A share of them, and it reads as the same drawing
   * seen from further away, which is what a preview is.
   */
  density = 1,
}: {
  className?: string;
  amplitude?: number;
  speed?: number;
  interactive?: boolean;
  phase?: number;
  density?: number;
}) {
  const surface = useRef<HTMLCanvasElement>(null);

  /* The live settings, for the loop to read. Written in an effect rather than
     during render, because assigning to a ref while rendering is a side effect
     in render - and read from the loop, so changing one sets a number rather
     than restarting the whole field. */
  const live = useRef({ amplitude, speed, interactive, phase });

  useEffect(() => {
    live.current = { amplitude, speed, interactive, phase };
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
    const rows = Math.max(8, Math.round(ROWS * density));
    const columns = Math.max(24, Math.round(COLUMNS * density));

    const columnInk = Array.from({ length: columns + 1 }, (_unused, col) => {
      const c = mixRgb(from, to, col / columns);
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

    /* The phase, followed rather than set. Given straight to the wave it would
       jump, and a wave that jumps is a picture being swapped. Eased, the surface
       rolls to the new shape, which is the same information arriving as motion
       rather than as a cut.

       Started from the ref rather than from the prop, so this effect does not
       have to list the prop and be torn down whenever it changes - which would
       rebuild the whole canvas to move a number, and defeat the point. */
    let heldPhase = live.current.phase;

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

      /* Rows crowd towards the far edge, but not nearly as hard as they did.
         At 2.1 the far half of the band collapsed into two or three lines and
         the near half ran off the bottom; 1.55 keeps every row separate enough
         to be followed, which is the whole requirement. */
      const near = Math.pow(depth, 1.55);

      /* The horizon sits above the middle, and the pointer tips it a little -
         which reads as leaning over the sheet rather than as the sheet moving. */
      /* A band across the card rather than a floor at the bottom of it. Its far
         edge is a fifth of the way down and its near edge runs to the foot, so
         it covers the height rather than sitting in the lower half with white
         above it. */
      /* The horizon, near the top edge rather than a fifth of the way down.

         It sat at a fifth, which left the top of the card white and the sheet
         reading as an object placed in it. The card is a window onto something
         larger, and a window's top edge is not where the world stops - so the
         far rows run up to it and the fade at the edge is what ends them. */
      const horizon = height * (-0.16 - (held.y - 0.5) * 0.07 * lean);
      const groundY = horizon + height * 1.36 * near;

      /* Rows widen as they come forward, and the whole sheet slides with the
         pointer, so the far edge moves less than the near one. That difference
         is what makes it read as depth rather than as a picture being dragged. */
      /* Far rows are narrow and near rows are wide, and it is the same count of
         dots either way - so the gaps close with distance. That is what
         perspective does to evenly spaced things, and the ratio between the two
         ends is how hard it does it. Four-fold read as a slightly narrower row;
         this is over ten-fold, which reads as distance.

         Both ends are up, and the far one three times over. At a fifth of the
         width the back of the sheet was a thin band in the middle of the card
         with white either side of it; at half it reached the sides but left the
         top corners; and now past the full width of it, so even the farthest
         row runs out of the card on both sides rather than ending inside it. The
         ratio between the ends is still nearly three to one, which is all the
         perspective needs - what it stopped doing is deciding
         how much of the card gets a picture on it. Widened, the near rows run past the edges and the far ones
         cover the top - so the surface is a piece of something larger that the
         card is a window onto, rather than an object placed in the middle of
         it. */
      const spread = 1.35 + 2.25 * near;
      const slide = (held.x - 0.5) * width * 0.16 * near * lean;
      const x = width * (0.5 + SHIFT) + (along - 0.5) * width * spread + slide;

      /* And the roll, which is the whole thing.

         Written in cycles rather than radians, and that is the fix rather than a
         tidy-up. It was `sin(along * 2.35)`, and `along` runs nought to one - so
         the argument covered 2.35 radians across the entire width, which is a
         third of one cycle. A third of a sine is not a wave, it is a slope, and
         that is exactly what was on the screen. `PI * 3` is a cycle and a half:
         two crests and a trough, which is enough to be read as a wave and few
         enough to be read at a glance.

         One wave dominates and it runs across the sheet rather than into it -
         `along` carries the weight and `depth` only tilts the crest, so it
         arrives at the near rows a moment after the far ones. That ratio is what
         makes it one surface: when every row crests in nearly the same place the
         eye joins them, and when each crests somewhere else it reads as noise.

         The second is longer, slower and turning the other way, at a third of
         the height. Two waves at unrelated rates never come back into step, so
         the surface never repeats - and being a third, it bends the crest
         without ever competing to be it. */
      const roll =
        Math.sin(along * Math.PI * 3 - depth * 0.8 + t * 0.34 + heldPhase) *
          0.74 +
        Math.sin(
          along * Math.PI * 1.3 - depth * 1.9 - t * 0.19 - heldPhase * 0.6,
        ) *
          0.26;

      /* Not scaled by `near` alone. That flattened the far half to nothing, so
         the only rows carrying the wave were the ones running off the bottom.
         Every row shows it; the near ones just show more. */
      const y =
        groundY + roll * height * 0.2 * now.amplitude * (0.45 + 0.55 * near);

      /* The roll goes back with the point, because the light on this surface
         depends on where the point sits in the wave - and only the wave knows
         that. */
      return { x, y, near, roll };
    };

    /**
     * A number between nought and one that is always the same for the same dot.
     *
     * Not random. Random would differ between the server's render and the
     * browser's, and would differ again on every frame - the field would boil.
     * This is the usual trick for the job: take something irrational, multiply,
     * and keep the fraction. The same two indices always give the same answer,
     * and neighbouring ones give unrelated answers, which is all that is wanted.
     */
    const speck = (col: number, row: number) => {
      const n = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453;
      return n - Math.floor(n);
    };

    const draw = (ms: number) => {
      const now = live.current;
      const t = (ms / 1000) * now.speed;

      ink.clearRect(0, 0, width, height);

      held.x += (wanted.x - held.x) * 0.05;
      held.y += (wanted.y - held.y) * 0.05;
      held.pull += (wanted.pull - held.pull) * 0.05;
      heldPhase += (now.phase - heldPhase) * 0.045;

      for (let row = 0; row < rows; row += 1) {
        const depth = (row + 0.5) / rows;

        for (let col = 0; col <= columns; col += 1) {
          const along = col / columns;
          const { x, y, near, roll } = place(along, depth, t);

          if (x < -24 || x > width + 24) continue;

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
          /* Faded against the canvas rather than against the row.

             It used to fade on `along`, which is a dot's place in its own row -
             and near rows are eleven times wider than far ones, so the same
             `along` is at the middle of one row and off the side of another.
             What that produced was a field fading in the middle of the card
             while its widest rows were still being cut dead by the edge.

             Measured in pixels from the sides and the foot, every row thins in
             the same place: where the card ends. The far edge still fades on
             depth, because there is no screen edge there - it is a horizon, and
             a horizon is a thing dissolving rather than a thing being cut. */
          const softX = Math.min(1, Math.min(x, width - x) / (width * 0.075));
          const softY = Math.min(1, (height - y) / (height * 0.07));
          const edge = Math.max(0, softX) * Math.max(0, softY);
          const across = Math.sin(depth * Math.PI) ** 0.16;

          /* The wave, read as light. A crest faces up and a hollow faces away,
             and `roll` already is that reading - which is why it is used rather
             than a light source being invented for it. Nought at the bottom of a
             swell, one at the top. */
          const lit = 0.5 + 0.5 * roll;

          /* A little grit, fixed per dot. Without it a lattice this regular
             reads as a printed screen rather than as something made. */
          const grit = speck(col, row);

          /* And here is the whole halftone.

             The size swing is enormous and deliberately so: raised to a power,
             a dot on a crest comes out several times the area of one in a
             hollow, and troughs nearly disappear. That ratio is what a halftone
             is - the shape is in the weight of the marks and not in where they
             are, which is why the lattice underneath can stay perfectly
             regular and dense and the picture still reads.

             It was the other way round before: opacity carried the shape and
             size barely moved, which is a shaded grid. A shaded grid at this
             density is a grey wash, which is why the field had to be sparse to
             say anything at all.

             The numbers matter as much as the idea. The first pass at this had
             the base at `0.32 + 3.1` and the power at `1.7`, which put a dot at
             mid-height on a mid row at 0.42 of a pixel - a quarter of the field
             was rounding to nothing and the rest was thin. The floor is what
             fixes it: a dot in a hollow should be small, not absent, and the
             swing has to happen between something and something else. */
          const weight = Math.pow(0.44 + 0.56 * lit, 1.12);

          const r = (1.6 + 4.7 * near) * weight * (0.85 + 0.3 * grit);

          /* Alpha does almost nothing now, and that is the point: it only says
             where the field ends. Left carrying the wave as well, the two would
             be saying the same thing twice and the dots would fade instead of
             thinning. */
          const alpha =
            (0.9 + 0.1 * near) *
            /* Barely more than once. It was `edge * edge`, which is a gentle
               fade and also a wide one - most of the card was somewhere inside
               it, and the field never reached full strength anywhere. A quarter
               power over the top keeps the softness at the very edge and gives
               everything inside it back at full weight. */
            edge *
            Math.pow(edge, 0.25) *
            across *
            (0.86 + 0.14 * grit);

          ink.globalAlpha = Math.min(alpha, 1);
          ink.fillStyle = columnInk[col];
          ink.beginPath();
          ink.arc(x, y, r, 0, Math.PI * 2);
          ink.fill();
        }
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
    /* The density is read once, at mount, and it is the only prop here that is:
       the lattice, the column colours and the whole loop are built from it, so
       changing it means building all of that again. Nothing changes it while a
       card is on the screen - the full field asks for one and the thumbnail asks
       for a fraction, and each of them is a different element. */
  }, [density]);

  return (
    <canvas
      ref={surface}
      aria-hidden
      className={cn("block size-full", className)}
    />
  );
}
