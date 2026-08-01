"use client";

import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { SITE } from "@/lib/site";

import { RailNav } from "./rail-nav";

/**
 * The left rail: every page on the site, in reading order.
 *
 * The draft's own navigation, and the thing that makes this site legible. Forty
 * eight pages is more than a header can hold, so the header carries the seven a
 * visitor is most likely to want and the rail carries all of them, the way
 * documentation sites and admin tools do.
 *
 * Sticky under the header and its own scroll container, so it stays put while a
 * long legal page runs past it and stops where the header ends rather than sliding
 * behind it. It keeps a scrollbar rather than hiding one: forty eight items do not
 * fit on a laptop screen and how far down the list you are is worth knowing.
 *
 * The rule down its edge is `hair`, the palette's lightest, rather than `border`.
 * It runs the full height of the window beside a page whose own sections are
 * divided by `border` rules, so at that weight it would read as the strongest line
 * on screen and give the eye a second grid to follow. At `hair` it marks the edge
 * without competing with the content.
 *
 * It collapses to a 48px strip. At 1280 the rail is a fifth of the window, and
 * somebody reading a long legal page wants that width back; the strip keeps the way
 * to reopen it exactly where the rail was, so nothing moves but the boundary.
 *
 * Below `lg` it is not rendered at all. The header's menu carries the same list
 * from the same component, so a phone reaches every page rather than the seven in
 * the header.
 */
export function SiteRail({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();

  const stick = {
    top: "var(--nav-height)",
    height: "calc(100svh - var(--nav-height))",
  };

  if (collapsed) {
    return (
      <div
        className="sticky hidden w-12 shrink-0 border-r border-border bg-field pt-4 lg:block"
        style={stick}
      >
        <button
          type="button"
          onClick={() => onCollapsedChange(false)}
          aria-label="Show all pages"
          title="Show all pages"
          className="mx-auto flex size-8 items-center justify-center rounded-field text-quiet transition-colors hover:bg-well hover:text-ink"
        >
          <PanelLeftOpen className="size-[18px]" />
        </button>
      </div>
    );
  }

  return (
    <nav
      aria-label="All pages"
      className="sticky hidden w-[284px] shrink-0 overflow-y-auto border-r border-border bg-field pb-10 lg:block xl:w-[308px] 2xl:w-[328px]"
      style={stick}
    >
      {/* The head stays put while the list scrolls under it: it holds the only
          control that puts the rail away, and the only one that brings it back.

          No name in here. The header above already carries it, and repeating it
          two rows lower said the same thing twice in the same eyeline. Nothing
          to expand or collapse either, now that the list has no groups to open:
          two controls that operated on something invisible. */}
      <div className="sticky top-0 z-10 flex items-center justify-end bg-field pt-3 pb-2">
        <button
          type="button"
          onClick={() => onCollapsedChange(true)}
          aria-label="Hide all pages"
          title="Hide all pages"
          className="mr-4 flex size-8 shrink-0 items-center justify-center rounded-field text-quiet transition-colors hover:bg-well hover:text-ink"
        >
          <PanelLeftClose className="size-[18px]" />
        </button>
      </div>

      <RailNav pathname={pathname} />

      {/* The prototype's own foot note. It says what this site is while you are
          looking at the list of everything in it, which is the one place the
          admission is useful rather than apologetic. */}
      <div className="mt-7 border-t border-border px-6 pt-[18px]">
        <p className="text-[12.5px] leading-[1.5] text-label">{SITE.status}</p>
      </div>
    </nav>
  );
}
