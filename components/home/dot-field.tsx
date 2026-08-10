"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The card's paper, with a swell running through it.

   It was two lines of CSS: a repeating radial gradient at a twenty pixel pitch,
   masked out of the middle so the words had somewhere to be read. That is a
   texture, and a texture is the right thing for it to be - but it was a still
   one, on the one screen of this card that never moves.

   A background cannot do this. `background-position` slides the whole sheet,
   which is a pattern being dragged rather than a surface bending; the only way
   to have the dots move relative to each other is to place each one. So the
   same grid is drawn on a canvas and every dot is displaced by a travelling
   wave, and it stays exactly as faint as it was - the point is still that you
   see the surface is not blank and never quite see what it is made of.

   Cheap on purpose, because it is scenery on the screen somebody lands on:

   - One path a frame, not one fill per dot. Four thousand dots are added to a
     single path and filled once, which is one draw call rather than four
     thousand.
   - Squares, not circles. An arc has to be flattened into line segments before
     anything can be filled - a couple of dozen per dot, so four thousand
     circles is the better part of a hundred thousand points a frame. A rect is
     four. At a pixel and a half, under a mask, at half the strength of a
     hairline, nobody has ever told the two apart.
   - No trigonometry in the inner loop. The wave is `sin(a + b)` with `a` per
     column and `b` per row, so the two are worked out once each along the
     edges and the identity `sin a cos b + cos a sin b` puts them together with
     two multiplies and an add.
   - It stops when it is off the screen, and it never starts where somebody has
     asked for less motion - there it is drawn once and left, which is the still
     texture this replaced.
--------------------------------------------------------------------------- */

/** The grid, as the stylesheet had it: a 20px pitch and a 1.5px dot. */
const PITCH = 20;
const DOT = 1.5;

/**
 * How strongly the dot's own weight follows the wave.
 *
 * Small, and it was not. It swung between about six tenths and full, which does
 * two wrong things at once: it takes a third of the ink off the whole field, so
 * the texture went faint - and because the size changes in place while the
 * displacement is only a few pixels, what the eye reads is every dot throbbing
 * rather than a surface passing under them. A pulse is a dot changing; a wave is
 * a dot moving.
 *
 * A third either way, which is more than that argument first allowed and is the
 * right amount for a different reason. The displacement is capped by the grid -
 * nine pixels out of twenty is as far as a dot can be lifted before it crosses
 * into the row above - so position alone can only ever say so much, and at that
 * size the wave was there and nobody could find it.
 *
 * Weight is not capped by anything. A crest drawn heavier is a bright band, and
 * a bright band travelling across a field is the most legible wave there is. It
 * only read as a pulse before because it was the whole of the signal while the
 * crest crawled; with the crest crossing the card in four seconds it reads as
 * what it is, which is the near side of a swell.
 *
 * Centred on one, so the field's average weight is exactly the weight the flat
 * grid had.
 */
const WEIGHT = 0.34;

/**
 * How far a dot is lifted out of its row.
 *
 * Under half the pitch, and that is the whole of the tuning. Past half, a dot
 * crosses the row above it and the grid stops reading as a grid - what is left
 * is a scatter that happens to be moving. Under it, every row stays its own row
 * and what the eye reads is a sheet bending.
 *
 * Nine of twenty, which is as near that ceiling as it goes. The displacement is
 * the animation - it is the only part of this that says wave rather than
 * flicker - so it takes all the room the grid can give it.
 */
const LIFT = 9;

export function DotField({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const face = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current;
    const canvas = face.current;
    if (!box || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let clock = 0;
    let last = 0;
    let seen = true;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* The dot's colour, read off the stylesheet rather than written here, so
       this and every hairline on the site come from one value. Read once and
       kept: `getComputedStyle` settles layout to answer, and this needs the
       answer sixty times a second. */
    let ink = "rgba(0,0,0,0.1)";

    const colour = () => {
      const raw = getComputedStyle(box)
        .getPropertyValue("--color-border")
        .trim();
      /* Whatever form the token is in - hex, `oklch`, `rgb` - `color-mix` takes
         it, so the alpha is applied by the browser rather than parsed here. */
      /* Well over the fifty-two the flat grid was set at, and for two reasons
         that compound. A moving dot is a fainter dot - it lands on a fresh
         sub-pixel position every frame, so the antialiaser spreads its ink over
         two pixels instead of settling it into one. And what is left after that
         is then faded again by the mask over it, which is a texture that only
         exists at the edges of the card. Fifty-two was a value chosen for ink
         that stayed still and was never dimmed twice. */
      ink = raw
        ? `color-mix(in oklab, ${raw} 74%, transparent)`
        : "rgba(0,0,0,0.14)";
    };

    /* Along the edges, not through the middle.

       Every dot's wave is the sum of a term that depends only on its column and
       one that depends only on its row, so both are worked out once per edge
       and the inner loop puts them together. Sized to the largest grid this can
       be asked for at a sane window, and reused - a resize writes over them. */
    let colSin = new Float32Array(0);
    let colCos = new Float32Array(0);
    let rowSin = new Float32Array(0);
    let rowCos = new Float32Array(0);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width < 2 || height < 2) return;

      const cols = Math.ceil(width / PITCH) + 1;
      const rows = Math.ceil(height / PITCH) + 1;

      if (colSin.length < cols) {
        colSin = new Float32Array(cols);
        colCos = new Float32Array(cols);
      }
      if (rowSin.length < rows) {
        rowSin = new Float32Array(rows);
        rowCos = new Float32Array(rows);
      }

      /* A swell running across, and a long slow lean down the height of it.

         The crest is a band standing more or less upright and travelling left
         to right, which is the shape anybody means by a wave. The row term is
         deliberately the weaker of the two - a wavelength three times the
         other's and drifting the other way - so it tilts the crest and stops it
         being a ruler sliding past, without turning the picture into a
         chequerboard of high and low patches.

         Long wavelengths on both: this is a card the width of a window, and a
         wave that fits into it twice is weather where one that fits ten times
         is corduroy.

         And quick enough to be seen. At the rate this first ran, the crest took
         eight seconds to cross and any one dot travelled about seven pixels in
         a second - which is not slow motion, it is no motion, because nobody
         watches a background for eight seconds to find out. It crosses in
         around four and a half now, which is a wave passing rather than a
         pattern that might be drifting. */
      for (let i = 0; i < cols; i += 1) {
        const a = (i * PITCH) / 260 + t * 1.35;
        colSin[i] = Math.sin(a);
        colCos[i] = Math.cos(a);
      }
      for (let j = 0; j < rows; j += 1) {
        const b = (j * PITCH) / 760 - t * 0.28;
        rowSin[j] = Math.sin(b);
        rowCos[j] = Math.cos(b);
      }

      ctx.fillStyle = ink;
      ctx.beginPath();

      for (let j = 0; j < rows; j += 1) {
        const y = j * PITCH;
        const sb = rowSin[j];
        const cb = rowCos[j];

        for (let i = 0; i < cols; i += 1) {
          /* `sin(a + b)`, without either sine being taken here. */
          const wave = colSin[i] * cb + colCos[i] * sb;

          /* Lifted, and a touch heavier where it is lifted. The displacement
             is the wave; the weight only says which side of it is nearer. */
          const r = DOT * (1 + WEIGHT * wave);
          const at = y + LIFT * wave;

          ctx.rect(i * PITCH - r, at - r, r + r, r + r);
        }
      }

      ctx.fill();
    };

    /* Every frame, now that a dot is four points rather than a flattened arc.

       It was held to thirty, on the argument that a swell moving a few pixels
       does not need sixty - and that is true of the wave and false of the eye.
       A crest crossing the card is a moving edge, and a moving edge at half
       rate is a moving edge somebody can count the steps of. The cost that
       argument was paying for went with the arcs. */
    const tick = (now: number) => {
      const gap = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      clock += gap;
      draw(clock);
      frame = requestAnimationFrame(tick);
    };

    /* Straight away, not after the entrance.

       It was held back a second and a half so nothing competed with the words
       arriving, and a second and a half is longer than anybody waits before
       deciding a thing does not move - so what the hold bought was a texture
       that appeared to be the still one it replaced. The cost it was avoiding
       went with the arcs; there is nothing left to stagger away from. */
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
      const rect = box.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;

      /* One. This is a field of pixel-and-a-half dots at two thirds of a
         hairline's strength, under a mask that fades most of them out - there
         is nothing in it a denser backing store could sharpen, and every pixel
         of it is cleared and painted every frame. At a device ratio of two it
         was clearing four times the area to draw the same four thousand marks.

         Held at one rather than one and a half for the same reason the swell
         behind the other screen is: what is being drawn has no edges. */
      const dpr = 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      colour();
      draw(clock);
    };

    const bounds = new ResizeObserver(size);
    bounds.observe(box);

    /* Off the screen, it stops. */
    const eye = new IntersectionObserver(
      (entries) => {
        seen = entries[0]?.isIntersecting ?? true;
        run();
      },
      { threshold: 0 },
    );
    eye.observe(box);

    still.addEventListener("change", run);
    size();
    run();

    return () => {
      cancelAnimationFrame(frame);
      bounds.disconnect();
      eye.disconnect();
      still.removeEventListener("change", run);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden className={cn("relative", className)}>
      <canvas ref={face} className="block h-full w-full" />
    </div>
  );
}
