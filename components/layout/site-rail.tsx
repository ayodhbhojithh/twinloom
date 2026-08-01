"use client";

import { usePathname } from "next/navigation";

import { RailNav } from "./rail-nav";

/**
 * The left rail: every page on the site, in reading order.
 *
 * The thing that makes this site legible. More pages than a header can hold, so
 * the header carries the five a visitor is most likely to want and the rail
 * carries all of them, the way documentation sites and admin tools do.
 *
 * Sticky under the header and its own scroll container, so it stays put while a
 * long legal page runs past it, and stops where the header ends rather than
 * sliding behind it.
 *
 * Nothing to collapse and nothing to expand. Every control this rail had acted
 * on the rail itself rather than on the site, and a navigation that has to be
 * operated before it can be read is one asking to be ignored. What is left is
 * the list.
 *
 * Below `lg` it is not rendered at all. The header's menu carries the same list
 * from the same component, so a phone reaches every page rather than the five in
 * the header.
 */
export function SiteRail() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="All pages"
      className="sticky hidden w-[284px] shrink-0 overflow-y-auto border-r border-border bg-field pt-6 pb-10 lg:block xl:w-[308px] 2xl:w-[328px]"
      style={{
        top: "var(--nav-height)",
        height: "calc(100svh - var(--nav-height))",
      }}
    >
      <RailNav pathname={pathname} />
    </nav>
  );
}
