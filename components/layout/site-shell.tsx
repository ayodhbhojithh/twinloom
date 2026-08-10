"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import type { Face } from "@/components/build/v5/dock";
import { ROUTES } from "@/lib/site";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
// import { SiteRail } from "./site-rail";

/**
 * The routes that end at the fold.
 *
 * The home variants are each built to exactly one screenful, so a footer under
 * one would exist only to be scrolled past.
 *
 * The landing page is not on this list any more. It was one screen and is now
 * two, and a page that scrolls and then simply stops is a page missing its
 * end.
 */
/**
 * How far the landing page travels before its second header comes down.
 *
 * Read by two things that must agree: the header, which appears at it, and the
 * desk, which starts below the header once it has. */
const APPEAR = 240;

/* The desk, fetched after the page it is standing beside.

   It is on every route, so what it costs it costs everywhere: the panel, the
   notes list, the page list, the cut surface they are drawn on and the uploader
   behind the attach control - a couple of hundred kilobytes of tool, on a legal
   page that is four paragraphs of text.

   And none of it is needed to read anything. The desk is a flag against the
   right edge until somebody presses it, so it can arrive a moment after the page
   does without anybody being kept waiting for it - which is the opposite of the
   arrangement it had, where every page waited for the desk.

   `ssr: false` because there is nothing about it worth rendering on a server:
   what it shows is read out of the reader's own saved answers, which the server
   has never seen. It rendered an empty tab and then replaced it on hydration. */
const DeskDock = dynamic(
  () => import("@/components/build/v5/desk-dock").then((m) => m.DeskDock),
  { ssr: false },
);

const NO_FOOTER: readonly string[] = [
  ROUTES.homeV1,
  ROUTES.homeV2,
  ROUTES.homeV3,
  ROUTES.homeV4,
  ROUTES.homeV5,
  ROUTES.homeV6,
];

/**
 * The two columns under the header.
 *
 * A client component only because whether a route takes a footer is a decision
 * about the current path. Everything inside stays a server component: `children`
 * is passed through, so pages are still rendered on the server and this only
 * decides what surrounds them.
 *
 * `items-start` is what lets the rail be sticky. A stretched flex child is
 * already as tall as its parent and has nothing left to stick within.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /* Whether the desk is open, and it lives here rather than in the dock.

     Opening it moves the page aside, so the thing that lays the page out is
     the thing that has to know. Held here, one number in the stylesheet
     decides both how wide the panel is and how far everything else stands
     back, and neither can be changed without the other. */
  const [face, setFace] = useState<Face | null>(null);

  /* Whether there is a bar at the top of the window for the desk to start
     below.

     Everywhere but the landing page, always: the header is stuck to the top
     from the first pixel. On the landing page it is neither always nor never.
     The card carries its own header inside it, so at the top of that page
     there is no bar and the desk should take the whole height - and once the
     card has scrolled away a second copy comes down, which the desk then has
     to clear or it is cut off by it.

     So the same threshold the header itself appears at, read the same way it
     reads it. One number, `APPEAR`, passed to the header and compared here -
     written twice they would part company and the desk would clear a bar that
     had not arrived, or fail to clear one that had. */
  const [past, setPast] = useState(false);
  const floating = pathname === ROUTES.home;

  /* Whether the page has settled enough to go and get the desk.

     Deferred behind a dynamic import alone it would still be fetched the moment
     this component hydrates, which on a slow phone is exactly the busiest
     stretch there is: the page is parsing, laying out and painting, and a
     second bundle arriving in the middle of that competes with the thing
     somebody is actually looking at.

     So it waits for the browser to be idle, with a timeout as the floor - a
     page that never goes idle is a page where the wait would otherwise be
     forever. `requestIdleCallback` is not on every browser, and where it is
     missing a plain delay says the same thing less precisely. */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback;

    if (idle) {
      const id = idle(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }

    const soon = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(soon);
  }, []);

  useEffect(() => {
    if (!floating) return;

    let frame = 0;

    const settle = () => {
      frame = 0;
      setPast(window.scrollY > APPEAR);
    };

    const again = () => {
      if (!frame) frame = requestAnimationFrame(settle);
    };

    settle();
    window.addEventListener("scroll", again, { passive: true });
    window.addEventListener("resize", again);

    return () => {
      window.removeEventListener("scroll", again);
      window.removeEventListener("resize", again);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [floating]);

  const underHeader = floating ? past : true;

  return (
    <>
      {/* One bar, on every page, from the first pixel.

          It used to be two arrangements. The landing page put a header inside
          its card - the card is the whole window there, and the argument was
          that a bar above it would be a bar above the page rather than part of
          it - and because that copy scrolled away with the card it was in, a
          second one waited off the top of the window and came down once the card
          had gone.

          Two copies of one bar is two of everything: two places a link can be
          wrong, two sets of paddings, and a card whose top edge had to be
          measured around a row of links standing in it. It also meant the name
          and the nav were inside the one element on the page that turns, so they
          sat on a photograph on one screen and a moving field on the next, and
          two of the five screens had to hide them outright.

          Now it is simply the header, above the card, the same as everywhere
          else. The card keeps its notch and the three controls in it, which are
          about the card rather than about the site. */}
      <SiteHeader />

      {/* Aside, rather than under.

          The desk floats over the right of the window, and a panel over a page
          is a panel covering whatever it is open next to - which on this site
          is usually the thing somebody opened it to write about. So the page
          gives up the room instead: the same width the panel takes, as padding
          on the column that holds the sections and the footer.

          Only from `lg`, because `--desk-width` is nought below it. There is no
          room to stand aside on a phone, so there the desk covers the page and
          the veil under it says so.

          The header is deliberately not moved. It is fixed across the top and
          the desk is above it; a bar that shrank away from a panel would be a
          third thing moving on screen to say what the panel already says by
          being there. */}
      <div
        className="flex flex-1 items-start transition-[padding] duration-300 ease-out"
        style={{
          ["--desk-space" as string]: face ? "var(--desk-width)" : "0px",
          paddingRight: "var(--desk-space)",
        }}
      >
        {/* No rail. Every page it carried is in the header now, and a docked
            column repeating the bar above it spent a fifth of the window
            saying what one line already said.

            Left commented rather than deleted: the component, its remembered
            open state and its markers all still work, and this is the one line
            that puts them back.

            {pathname === ROUTES.home ? null : <SiteRail />} */}

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">{children}</main>
          {NO_FOOTER.includes(pathname) ? null : <SiteFooter />}
        </div>
      </div>

      {/* The desk, on every page.

          It hung off the edge of the run-through, which put it on one screen
          of one route - so a thought worth writing down that arrived while
          reading anything else had to survive the trip to the tool first.
          Here it is the same distance from every page, and the panel is the
          height of the window rather than of whatever it stood beside.

          Below the header in the markup and above it in nothing: the tab and
          the panel carry their own z, and the header's menu sheet is higher
          than both, so a menu open over the desk still covers it. */}
      {/* Not while the landing card is filling the screen.

          The tab is a small black flag against the right edge, and on every
          other page it stands against the page's own margin. On the home hero
          there is no margin: the card is the window, so the flag lands on the
          card itself - a second object clipped to the one thing that screen is.
          It arrives with the header, on the same scroll, which is the moment the
          page starts behaving like a page.

          `floating && !past` is exactly that state, and it is already worked out
          for the header - see `underHeader`. One measurement, two things that
          depend on it. */}
      {ready ? (
        <DeskDock
          face={face}
          onFace={setFace}
          underHeader={underHeader}
          showTab={!(floating && !past)}
        />
      ) : null}
    </>
  );
}
