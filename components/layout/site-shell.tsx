"use client";

import { usePathname } from "next/navigation";

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

      <div className="flex flex-1 items-start">
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
    </>
  );
}
