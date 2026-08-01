"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SiteRail } from "./site-rail";

/**
 * The two columns under the header.
 *
 * A client component only because the rail collapses, and whether it is collapsed
 * has to be known by the row that lays both columns out. Everything inside stays a
 * server component: `children` is passed through, so pages are still rendered on
 * the server and this only decides how wide the space they land in is.
 *
 * `items-start` is what lets the rail be sticky. A stretched flex child is already
 * as tall as its parent and has nothing left to stick within.
 *
 * Home is the one route without a footer. It is built to exactly one screenful,
 * so a footer under it would exist only to be scrolled past, and a page that
 * says it is one screen should not have a second one hiding below the fold.
 * Every other route keeps it.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <SiteHeader />

      <div className="flex flex-1 items-start">
        <SiteRail collapsed={collapsed} onCollapsedChange={setCollapsed} />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">{children}</main>
          {pathname === "/" ? null : <SiteFooter />}
        </div>
      </div>
    </>
  );
}
