"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SiteRail } from "./site-rail";

/**
 * The two columns under the header.
 *
 * A client component only because home is the one route without a footer, and
 * that is a decision about the current path. Everything inside stays a server
 * component: `children` is passed through, so pages are still rendered on the
 * server and this only decides what surrounds them.
 *
 * `items-start` is what lets the rail be sticky. A stretched flex child is
 * already as tall as its parent and has nothing left to stick within.
 *
 * Home has no footer because it is built to exactly one screenful, so a footer
 * under it would exist only to be scrolled past. Every other route keeps it.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <SiteHeader />

      <div className="flex flex-1 items-start">
        <SiteRail />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">{children}</main>
          {pathname === "/" ? null : <SiteFooter />}
        </div>
      </div>
    </>
  );
}
