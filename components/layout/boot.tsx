"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { outline, type Cuts } from "@/components/home/notched-card";

/* ---------------------------------------------------------------------------
   The wait, before the site is worth looking at.

   Not a spinner. A spinner is a borrowed part that belongs to no site in
   particular, and the one thing this site has that nothing else does is its
   shape: a surface with pieces taken out of it, every cut sweeping outward
   where it meets the edge. So the wait is that shape, small, drawing itself.

   It is the same function the landing card is cut with, at a fraction of the
   size. One outline, one set of rules: change how a cut curves and this changes
   with it, because there is no second copy of the geometry to forget about.

   The mark stands inside it. The shape alone is the site's geometry and not its
   name - it is recognisable to somebody who has already been here and is a small
   grey outline to everybody else - so the one thing worth adding is the thing
   that says whose site is loading. Inside the outline rather than beside it,
   because that is what the outline is: a surface with the mark standing on it,
   which is the landing card in miniature.

   Three things on the screen and nothing else. A loading screen is the one place
   where anything additional is only there to be looked at while somebody waits,
   which is a poor reason to draw it.
--------------------------------------------------------------------------- */

/**
 * The mark's own size, and the cuts at that size.
 *
 * Landscape, near the card's own three-to-two, because the proportion is half
 * of what makes it recognisable: the same cuts in a square read as a different
 * object entirely.
 *
 * The cuts are held to roughly the fractions the card uses - a bite at an
 * eighth of the width, a bar at a quarter, a drop at a sixth - rather than
 * being drawn as large as they will go. Sized by eye they ate most of the
 * bottom edge and left a neck between them, and the shape stopped reading as a
 * surface with pieces taken out and started reading as a shape in its own
 * right, which is the one thing the card is careful never to do.
 */
const MARK = { w: 88, h: 60 };

const SMALL: Cuts = {
  radius: 12,
  barWidth: 22,
  barDepth: 8,
  barRadius: 5,
  barFlare: 6,
  biteWidth: 20,
  biteHeight: 17,
  biteRadius: 5,
  biteFlare: 6,
  dropWidth: 16,
  dropHeight: 15,
  dropRadius: 5,
  dropFlare: 6,
};

const SHAPE = outline(MARK.w, MARK.h, SMALL);

/**
 * How long it may hold the screen, whatever happens.
 *
 * A loading screen that waits on something is a loading screen that can wait
 * forever - a video that never buffers on a bad connection, a request that
 * hangs. This is the answer to that: past it the site is shown regardless, half
 * loaded, which is worse than a finished page and far better than a blank one.
 */
const CAP = 3600;

/**
 * The shortest it is allowed to be seen.
 *
 * On a warm cache everything is ready before the first frame, and an overlay
 * that appears and leaves inside eighty milliseconds is a flash of white nobody
 * can read as anything but a fault.
 */
const FLOOR = 420;

export function Boot() {
  const [done, setDone] = useState(false);
  const from = useRef(0);

  useEffect(() => {
    from.current = performance.now();

    let alive = true;
    let capped = 0;

    const leave = () => {
      if (!alive) return;
      alive = false;
      window.clearTimeout(capped);

      /* Held to the floor, measured from when this mounted rather than from
         when the page started - those differ by however long the JavaScript
         took to arrive, and the floor is about what the eye sees, not about
         what the network did. */
      const seen = performance.now() - from.current;
      window.setTimeout(() => setDone(true), Math.max(0, FLOOR - seen));
    };

    capped = window.setTimeout(leave, CAP);

    /* Ready means two things, and the second is the whole reason this exists.

       The document being complete says the page can be looked at. The film on
       the landing card being playable says the largest thing on it will not
       arrive as a grey rectangle a second after somebody starts reading. A
       screen that leaves before the film is buffered has moved the wait rather
       than removed it.

       `readyState >= HAVE_FUTURE_DATA` rather than the `canplay` event alone,
       because on a warm cache the event has already fired by the time this
       runs and nothing would ever call back. */
    const ready = () => {
      if (document.readyState !== "complete") return false;

      const film = document.querySelector("video");
      return !film || film.readyState >= 3;
    };

    const check = () => {
      if (ready()) leave();
    };

    check();
    window.addEventListener("load", check);
    document.addEventListener("readystatechange", check);
    /* `canplay` bubbles nowhere, so it is caught on the way down instead of
       hunting for an element that may not have mounted yet. */
    document.addEventListener("canplay", check, true);
    document.addEventListener("loadeddata", check, true);

    return () => {
      alive = false;
      window.clearTimeout(capped);
      window.removeEventListener("load", check);
      document.removeEventListener("readystatechange", check);
      document.removeEventListener("canplay", check, true);
      document.removeEventListener("loadeddata", check, true);
    };
  }, []);

  return (
    <div
      className="boot"
      data-done={done ? "" : undefined}
      /* Not announced. It says nothing a person needs and it is gone in under a
         second; a screen reader should be reading the page, which is already
         underneath it. */
      aria-hidden
    >
      <span
        className="relative block"
        style={{ width: MARK.w, height: MARK.h }}
      >
        <svg
          width={MARK.w}
          height={MARK.h}
          viewBox={`0 0 ${MARK.w} ${MARK.h}`}
          fill="none"
        >
          {/* The shape, standing still. */}
          <path
            d={SHAPE}
            stroke="var(--color-hair)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* And the piece of it that travels. `pathLength` normalises the
              outline to 100 whatever its real length is, so the dash is a
              readable fraction of the shape rather than a number that has to be
              retuned every time a cut changes. */}
          <path
            className="boot-trace"
            d={SHAPE}
            stroke="var(--color-ink)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray="24 76"
          />
        </svg>

        {/* The mark, standing on the surface the outline draws.

            Centred on the whole shape rather than on what is left of it after
            the cuts. The notch is in the top edge and the two bites are in the
            bottom corners, so the middle is the one part of this shape that no
            cut reaches - and a mark offset to dodge cuts it never touches would
            look like a mark somebody had nudged.

            Loaded eagerly, because this is the first thing on the screen and
            the default is to wait until it has been discovered in the body. It
            is the same file the header uses, so on any page after the first it
            is already in the cache. */}
        <Image
          src="/assets/logo.png"
          alt=""
          width={192}
          height={192}
          draggable={false}
          loading="eager"
          fetchPriority="high"
          sizes="52px"
          /* Larger than the box it looks like it should take.

             The file is square and the mark inside it is not - it is a wide
             thing with a good deal of white above and below - so a box measured
             to the shape's own height draws a mark half that tall. Fifty-two in
             a shape sixty high is the box overshooting on purpose: what lands
             on the screen is the ink, and the margins the file carries fall
             outside the outline where there is nothing to collide with. */
          className="absolute top-1/2 left-1/2 size-[52px] -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </span>

      <span className="mt-5 font-mono text-[9px] font-bold tracking-[0.22em] text-label uppercase">
        TwinLoom
      </span>
    </div>
  );
}
