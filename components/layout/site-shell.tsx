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
      {/* Everywhere but the landing page. That page puts the header inside its
          card - the card is the whole window there, and a bar above it would be
          a bar above the page rather than part of it. `NotchedCard` renders it,
          bare. */}
      {pathname === ROUTES.home ? null : <SiteHeader />}

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
