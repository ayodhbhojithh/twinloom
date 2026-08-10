"use client";

import { useEffect, useRef, useState } from "react";

import { outline, type Cuts } from "./notched-card";

/* ---------------------------------------------------------------------------
   A film, in a shape rather than in a rectangle.

   Everything on this site that holds something is a surface with pieces taken
   out of it - the landing card, the desk, the panels in the run-through - and
   the one thing that was not was the film, which sat in the middle of the card
   as a plain box. A rectangle on a page made of cut surfaces is the one element
   that looks pasted on.

   So it is cut from the same function the card is, `outline`, at its own size.
   Not a copy of the geometry and not a rounded rectangle that resembles it: the
   same code, so the day a flare changes on the card it changes here, and the
   two go on reading as one drawing.

   One cut, and it holds something, which is the rule the shape exists for. A cut
   is a hole - one with nothing in it shows the surface behind through the
   picture, which is a fault rather than a detail. So there is a notch, and the
   notch says what the screen is.

   There was a corner cut as well, with a sound control standing in it. The film
   is silent now and always will be, so the control went - and the cut had to go
   with it. A corner given up for a button that is not there is a bite out of the
   picture for no reason.
--------------------------------------------------------------------------- */

/**
 * What stands in the notch, measured rather than guessed.
 *
 * The notch is sized from the plate in it, exactly as it is on the card. A cut
 * sized as a fraction of the picture is a cut too small for its contents on a
 * phone and a hole on a desk.
 */
const PLATE = 26;

export function FilmStage({ src, kind }: { src: string; kind: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const node = box.current;
    if (!node) return;

    const measure = () =>
      setSize({ w: node.clientWidth, h: node.clientHeight });

    const watcher = new ResizeObserver(measure);
    watcher.observe(node);
    measure();

    return () => watcher.disconnect();
  }, []);

  const cut: Cuts = (() => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    /* The card's own two numbers at this size, from the same expressions. */
    const radius = Math.max(14, Math.min(w * 0.018 + 10, 26));
    const flare = Math.max(14, Math.min(h * 0.04, 22));

    /* The notch takes its depth from what stands in it, which is where its two
       arcs meet - anything deeper is a straight wall between them. */
    const barFlare = Math.min(flare, (PLATE + 8) / 2);
    return {
      radius,
      /* Wide enough for a short word and its air, capped so there is edge left
         either side of it - a notch stops reading as one when there is not. */
      barWidth: Math.min(Math.max(96, w * 0.14), w - 2 * (radius + flare) - 20),
      barDepth: barFlare * 2,
      barRadius: barFlare,
      barFlare,
      /* Nought, which `outline` reads as no cut at all - and the corner comes
         back as an ordinary rounded one. */
      biteWidth: 0,
      biteHeight: 0,
      biteRadius: flare,
      biteFlare: flare,
      dropWidth: 0,
      dropHeight: 0,
      dropRadius: flare,
      dropFlare: flare,
    };
  })();

  const path = size.w > 40 ? outline(size.w, size.h, cut) : "";

  return (
    /* The box is the film's own shape - sixteen by nine, and never wider than
       the file is. The clip is drawn in the coordinates of the element it is
       set on, so the element has to be exactly the picture for the path to
       describe it. */
    <div
      ref={box}
      className="relative aspect-video max-h-full w-full max-w-[1280px]"
    >
      <video
        aria-hidden
        className="absolute inset-0 size-full object-cover"
        style={{ clipPath: path ? `path("${path}")` : undefined }}
        src={src}
        autoPlay
        /* Silent, always. Not a default somebody can change - there is nothing
           to change it with, and a film on a landing page that can start making
           noise is a landing page people close. */
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        tabIndex={-1}
      />

      {/* What it is, standing in the notch. No plate behind it: the notch is
          already the outline, and a pill drawn inside it is a second shape
          inside the first. */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 flex -translate-x-1/2 items-center justify-center"
        style={{ width: cut.barWidth, height: cut.barDepth }}
      >
        <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-label uppercase">
          {kind}
        </span>
      </div>
    </div>
  );
}
