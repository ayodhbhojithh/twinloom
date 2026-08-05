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
 * Once shown, a block is let go. A reveal that reverses on the way back up
 * means content disappearing from under somebody scrolling to re-read it, which
 * is a page arguing with its reader.
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

    root.dataset.reveal = "armed";

    const watcher = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          watcher.unobserve(entry.target);
        }
      },
      {
        /* Held back from the bottom edge. A block that starts the moment its
           first pixel appears has finished arriving while it is still off the
           bottom of the screen, which is the same as not animating at all. An
           eighth of the window up is where it reads as having been reached. */
        rootMargin: "0px 0px -12% 0px",
        threshold: 0,
      },
    );

    const blocks = document.querySelectorAll(".reveal:not([data-in])");
    for (const block of blocks) watcher.observe(block);

    return () => watcher.disconnect();
    /* Re-run per route: a client navigation swaps the whole page under this
       and the new one's blocks have never been looked at. */
  }, [pathname]);

  return null;
}
