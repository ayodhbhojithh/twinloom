"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * What turns the reveals on, and the only JavaScript any of them need.
 *
 * One watcher for the whole document rather than a wrapper component per block.
 * Every section stays a server component and marks a block by writing `reveal`
 * in its `className`, which is a class in the stylesheet and nothing else; this
 * finds them and says when each one has been reached.
 *
 * The hidden state is armed from here rather than written into the stylesheet
 * unconditionally. A page that never runs this - a crawler, a browser with
 * scripting off, a chunk that failed to load - has no `data-reveal` on its root
 * and so matches none of those rules, and every block is simply visible. The
 * failure mode of getting this wrong is a blank page, so it is worth the
 * attribute.
 *
 * It reveals in both directions, which is what the two observers are for. One
 * boundary cannot do it: a block has to arrive before it is fully on screen,
 * and it has to be put back only once it is fully off one. Read from a single
 * line, those are the same line - so a block scrolled back down towards the
 * bottom edge would blink out while a good part of it was still being looked
 * at. Two lines is hysteresis, and hysteresis is the whole trick.
 */
export function RevealWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    /* Nothing to arm against. Both of these mean every block should just be
       there: one is a browser too old to observe anything, the other is
       somebody who has said they do not want things moving. */
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      root.removeAttribute("data-reveal");
      return;
    }

    const blocks = Array.from(document.querySelectorAll(".reveal"));

    /* Whatever is already on screen is marked in this same tick, before the
       page is armed. Arming first and waiting on the observer's first callback
       leaves a frame in which a block that was visible a moment ago is not,
       and that frame is a blink on load rather than an entrance. */
    for (const block of blocks) {
      const box = block.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) {
        block.setAttribute("data-in", "");
      }
    }

    root.dataset.reveal = "armed";

    /* Arriving. Held back from the bottom edge, because a block that starts the
       moment its first pixel appears has finished arriving while it is still
       off the bottom of the screen - which is the same as not animating at all.
       An eighth of the window up is where it reads as having been reached. */
    const arrive = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.setAttribute("data-in", "");
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );

    /* Going back. On the window's own edges, with no inset, so a block is only
       put back once there is none of it left to see. Scroll the other way and
       it crosses the line above and arrives again. */
    const reset = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) entry.target.removeAttribute("data-in");
        }
      },
      { threshold: 0 },
    );

    for (const block of blocks) {
      arrive.observe(block);
      reset.observe(block);
    }

    return () => {
      arrive.disconnect();
      reset.disconnect();
    };
    /* Re-run per route: a client navigation swaps the whole page under this
       and the new one's blocks have never been looked at. */
  }, [pathname]);

  return null;
}
