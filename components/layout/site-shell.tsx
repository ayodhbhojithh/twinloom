"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { DeskDock } from "@/components/build/v5/desk-dock";
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

  return (
    <>
      {/* Two arrangements, one component.

          Everywhere but the landing page the bar is simply there, stuck to the
          top of the window from the first pixel.

          The landing page puts a header inside its card, because the card is the
          whole window there and a bar above it would be a bar above the page
          rather than part of it. That one scrolls away with the card it is in,
          which leaves the rest of the page with no way back - so a second copy
          waits off the top of the window and comes down once the card has gone.
          It is the same component and the same links; what differs is that this
          one is not there until it is needed. */}
      {pathname === ROUTES.home ? <SiteHeader appear={240} /> : <SiteHeader />}

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
      <DeskDock face={face} onFace={setFace} />
    </>
  );
}
