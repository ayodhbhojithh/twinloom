"use client";

import { usePathname } from "next/navigation";

import { ROUTES } from "@/lib/site";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SiteRail } from "./site-rail";

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
      <SiteHeader />

      <div className="flex flex-1 items-start">
        {/* The landing page has no rail. It is a front door rather than a page
            of the site, and a list of every other page beside a front door is a
            corridor with a doormat in it. Everything reached from it has one. */}
        {pathname === ROUTES.home ? null : <SiteRail />}

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">{children}</main>
          {NO_FOOTER.includes(pathname) ? null : <SiteFooter />}
        </div>
      </div>
    </>
  );
}
