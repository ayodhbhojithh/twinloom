"use client";

import Link from "next/link";

import { RAIL_PAGES, type NavLink as NavLinkData } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Where the marker sits, and how far a sub page steps in.
 *
 * The list holds one thing only: the gap between the 2px marker and the label
 * it marks. Its own left edge is the marker's column, so whatever holds the list
 * decides where that column falls - hard against the rail's edge, or inside the
 * phone sheet's padding with the rest of the sheet. A list that set a side
 * gutter of its own would carry a second inset on top of its container's and
 * line up with nothing.
 *
 * A sub page indents by 12 and the marker stays put, so the bar is in one column
 * down the whole list and only the text steps in. A bar that moved with the
 * indent would give the eye two vertical lines to follow and make the second
 * level look like a different navigation rather than part of this one.
 */
const HANG = 12;
const NEST = 12;

/**
 * Every page on the site, shared by the docked rail and the phone menu.
 *
 * One component for both, because they are the same navigation seen at two
 * widths. Written twice, the menu quietly lost its indents and a phone got a
 * flat list where a laptop got a structured one.
 *
 * No headings and nothing to open or shut. A handful of links do not need
 * chapters; they need to be short, in a sensible order, and always on screen.
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
  size?: "rail" | "menu";
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
  size: "rail" | "menu";
  nested?: boolean;
}) {
  const here = pathname === page.href;

  return (
    <Link
      href={page.href}
      onClick={onNavigate}
      aria-current={here ? "page" : undefined}
      style={{
        /* The 2px bar is drawn inside the link's own left edge, so the padding
           carries it and the text still lands on the lane. */
        paddingLeft: HANG - 2 + (nested ? NEST : 0),
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
