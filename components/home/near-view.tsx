"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Holds a place for something, and puts the something in it once it is nearly on
 * screen.
 *
 * For the parts of a page that are expensive to load rather than expensive to
 * draw. The scoping tool at the foot of the landing page is a hundred and fifty
 * kilobytes of JavaScript plus its uploader, and it is four screenfuls below the
 * fold - so on arrival it is downloaded, parsed and hydrated by everybody, to be
 * looked at by the people who scroll that far.
 *
 * Deferred behind a dynamic import alone, the chunk still leaves as soon as the
 * page hydrates: `next/dynamic` moves work off the first bundle, not off the
 * first minute. This is the second half of that - the import is not reached
 * until the reader is heading towards it.
 *
 * `margin` is how much warning to take. It is deliberately generous, because the
 * point is that nobody ever sees this working: at six hundred pixels the fetch
 * starts most of a screenful before the section arrives, which at any ordinary
 * scrolling speed is well over a second - long enough for a chunk that size on a
 * slow connection, and long before the space it is holding comes into view.
 *
 * `min` is the room to keep until then, and it matters more than it looks. A
 * placeholder shorter than what replaces it makes the page grow under the
 * reader's thumb the moment it loads, which moves whatever they were reading.
 * Roughly right is enough; exactly right is not worth chasing, because the thing
 * arrives before the space is on screen.
 *
 * Once it has been shown it stays shown. There is no unmounting on the way back
 * up: the cost this exists to avoid is the fetch, and that has already been
 * paid.
 */
export function NearView({
  min,
  margin = 600,
  children,
}: {
  /** How tall to stand until the contents arrive, in pixels. */
  min: number;
  /** How far ahead of the viewport to start, in pixels. */
  margin?: number;
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = box.current;
    if (!node) return;

    /* No observer where there is no observer. Nothing on this site needs to
       support a browser without one, but a page that throws on arrival is worse
       than a page that loads something early.

       On a timeout rather than straight out of the effect body: setting state
       synchronously there is a second render before the first has been shown,
       and the checker is right to refuse it. A tick costs nothing on a path
       nothing takes. */
    if (typeof IntersectionObserver === "undefined") {
      const soon = setTimeout(() => setNear(true), 0);
      return () => clearTimeout(soon);
    }

    const watch = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          watch.disconnect();
        }
      },
      { rootMargin: `${margin}px 0px ${margin}px 0px` },
    );

    watch.observe(node);
    return () => watch.disconnect();
  }, [margin]);

  return (
    <div ref={box} style={near ? undefined : { minHeight: min }}>
      {near ? children : null}
    </div>
  );
}
