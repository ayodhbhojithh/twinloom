"use client";

import Link from "next/link";

import { RAIL_PAGES, type NavLink as NavLinkData } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Where the two levels sit, as the prototype sets them.
 *
 * Its rail indents a sub page by 12 and leaves the 2px marker where it was, at
 * the rail's own left edge. So the bar is in one column down the whole list and
 * only the text steps in. A bar that moved with the indent would give the eye
 * two vertical lines to follow and make the second level look like a different
 * navigation rather than part of this one.
 *
 * The phone menu sits almost against its own edge: a sheet has less width to
 * spend and nothing to the left of it to line up with.
 */
const GUTTER = { rail: 24, menu: 8 } as const;
const NEST = 12;

/**
 * Every page on the site, shared by the docked rail and the phone menu.
 *
 * One component for both, because they are the same navigation seen at two
 * widths. Written twice, the menu quietly lost its indents and a phone got a
 * flat list where a laptop got a structured one.
 *
 * No headings and nothing to open or shut. Fifteen links do not need chapters;
 * they need to be short, in a sensible order, and always on screen.
 *
 * Ink marks the page you are on, not the accent. Blue is the site's one action
 * colour, and a rail that paints the current page in it competes with every
 * button on the screen for the same meaning. The prototype uses ink here and it
 * is right: this is where you are, not something to do.
 */
export function RailNav({
  pathname,
  onNavigate,
  size = "rail",
}: {
  pathname: string;
  /** The menu closes itself on the way out; the docked rail has nothing to do. */
  onNavigate?: () => void;
  size?: keyof typeof GUTTER;
}) {
  return (
    <ul>
      {RAIL_PAGES.map((page) => (
        <li key={page.href}>
          <Row page={page} pathname={pathname} onNavigate={onNavigate} size={size} />

          {page.children?.map((child) => (
            <Row
              key={child.href}
              page={child}
              pathname={pathname}
              onNavigate={onNavigate}
              size={size}
              nested
            />
          ))}
        </li>
      ))}
    </ul>
  );
}

function Row({
  page,
  pathname,
  onNavigate,
  size,
  nested,
}: {
  page: NavLinkData;
  pathname: string;
  onNavigate?: () => void;
  size: keyof typeof GUTTER;
  nested?: boolean;
}) {
  const here = pathname === page.href;
  const gutter = GUTTER[size];

  return (
    <Link
      href={page.href}
      onClick={onNavigate}
      aria-current={here ? "page" : undefined}
      style={{
        /* The 2px bar is drawn inside the link's own left edge, so the padding
           carries it and the text still lands where it should. */
        paddingLeft: gutter + (nested ? NEST : 0) - 2,
        paddingRight: gutter,
      }}
      className={cn(
        "block border-l-2 leading-[1.4] transition-colors",
        size === "menu" ? "py-2.5" : "py-[7px]",
        nested
          ? size === "menu"
            ? "text-[14.5px]"
            : "text-[14px]"
          : size === "menu"
            ? "text-[15.5px]"
            : "text-[15px]",
        here
          ? "border-ink font-semibold text-ink"
          : "border-transparent text-body hover:text-ink",
      )}
    >
      {page.label}
    </Link>
  );
}
