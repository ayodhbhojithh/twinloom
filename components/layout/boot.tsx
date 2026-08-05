"use client";

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

   Two things on the screen and nothing else. A loading screen is the one place
   where anything additional is only there to be looked at while somebody waits,
   which is a poor reason to draw it.
--------------------------------------------------------------------------- */

/** The mark's own size, and the cuts at that size. */
const MARK = 76;

const SMALL: Cuts = {
  radius: 14,
  barWidth: 26,
  barDepth: 9,
  barRadius: 6,
  barFlare: 7,
  biteWidth: 24,
  biteHeight: 24,
  biteRadius: 6,
  biteFlare: 7,
  dropWidth: 22,
  dropHeight: 22,
  dropRadius: 6,
  dropFlare: 7,
};

const SHAPE = outline(MARK, MARK, SMALL);

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
      <svg
        width={MARK}
        height={MARK}
        viewBox={`0 0 ${MARK} ${MARK}`}
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

      <span className="mt-5 font-mono text-[9px] font-bold tracking-[0.22em] text-label uppercase">
        TwinLoom
      </span>
    </div>
  );
}
