"use client";

import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { SITE } from "@/lib/site";

import { RailNav, useRailGroups } from "./rail-nav";

/**
 * The left rail: every page on the site, grouped and indented.
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
  const groups = useRailGroups();

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
      className="sticky hidden w-[252px] shrink-0 overflow-y-auto border-r border-border bg-field pb-10 lg:block xl:w-[272px] 2xl:w-[290px]"
      style={stick}
    >
      {/* The head stays put while the list scrolls under it: it holds the only
          control that puts the rail away, and the only one that brings it back. */}
      <div className="sticky top-0 z-10 bg-field pt-4 pb-3">
        <div className="flex items-start gap-2 px-6">
          <p className="min-w-0 flex-1 text-[14px] leading-[1.35] font-bold text-ink">
            {SITE.name}
          </p>

          <button
            type="button"
            onClick={() => onCollapsedChange(true)}
            aria-label="Hide all pages"
            title="Hide all pages"
            className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-field text-quiet transition-colors hover:bg-well hover:text-ink"
          >
            <PanelLeftClose className="size-[18px]" />
          </button>
        </div>

        <div className="mt-3 flex gap-4 px-6">
          <button
            type="button"
            onClick={groups.expandAll}
            className="font-mono text-[10.5px] font-semibold tracking-[0.08em] text-quiet uppercase transition-colors hover:text-ink"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={groups.collapseAll}
            className="font-mono text-[10.5px] font-semibold tracking-[0.08em] text-quiet uppercase transition-colors hover:text-ink"
          >
            Collapse all
          </button>
        </div>
      </div>

      <RailNav
        pathname={pathname}
        closed={groups.closed}
        onToggle={groups.toggle}
      />
    </nav>
  );
}
