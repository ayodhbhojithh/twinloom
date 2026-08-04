"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { RailNav } from "./rail-nav";

/* ---------------------------------------------------------------------------
   Whether the rail is open, remembered.

   Somebody who folds the rail away has said they want the width, and they have
   said it about the site rather than about the page they happened to be on.
   Forgetting it on the next click would make the control useless: it would have
   to be pressed again on every page, which is worse than not having it.

   Open is what the server renders, because `localStorage` does not exist there
   and a rail that draws open and then folds shut on hydration is a layout
   jumping under the reader's eyes.
--------------------------------------------------------------------------- */

const KEY = "twinloom.rail.open";

let open: boolean | undefined;
const listeners = new Set<() => void>();

function readOpen(): boolean {
  if (open !== undefined) return open;

  try {
    open = window.localStorage.getItem(KEY) !== "closed";
  } catch {
    /* Storage can be blocked outright. Open is the honest default: it is the
       state that shows the reader everything. */
    open = true;
  }

  return open;
}

function writeOpen(next: boolean) {
  open = next;
  try {
    window.localStorage.setItem(KEY, next ? "open" : "closed");
  } catch {
    /* Nothing to do. It reverts to open next visit, which is the least bad
       outcome available when a browser will not remember anything. */
  }
  for (const listener of listeners) listener();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const openOnServer = () => true;

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
 * It folds. Not because a navigation should need operating before it can be
 * read, but because some of these pages are working screens rather than reading
 * ones: the run-through is three columns of its own, and on a laptop the rail is
 * a quarter of a thousand pixels that screen would rather have. Folded it leaves
 * a strip with the control still on it, so the list is one press away and never
 * gone.
 *
 * Below `lg` it is not rendered at all. The header's menu carries the same list
 * from the same component, so a phone reaches every page rather than the five in
 * the header.
 */
export function SiteRail() {
  const pathname = usePathname();
  const shown = useSyncExternalStore(subscribe, readOpen, openOnServer);

  return (
    <div
      className={cn(
        "sticky hidden shrink-0 border-r border-border bg-field lg:block",
        /* Width, and only width. Animating what is inside as well would read as
           the page rebuilding itself rather than as a panel getting out of the
           way. */
        "transition-[width] duration-300 ease-out motion-reduce:transition-none",
        /* As narrow as the longest label needs and no narrower. The list is
           short words - `Blogs and articles` is the longest of them - and the
           width it was set to left a column of empty panel to the right of
           every line, which the page beside it would rather have. */
        shown ? "w-[228px] xl:w-[244px] 2xl:w-[260px]" : "w-[52px]",
      )}
      style={{
        top: "var(--nav-height)",
        height: "calc(100svh - var(--nav-height))",
      }}
    >
      <div className="flex h-full flex-col">
        {/* The control sits on the same right gutter the list does, so the panel
            has one right edge rather than a button tucked closer to it than
            anything underneath. Folded there is no gutter to keep: 52px of
            strip, and the button centred in it. */}
        <div
          className={cn(
            "flex flex-none items-center pt-4 pb-1",
            shown ? "justify-end px-(--rail-gutter)" : "justify-center px-2",
          )}
        >
          <button
            type="button"
            onClick={() => writeOpen(!shown)}
            aria-expanded={shown}
            aria-controls="site-rail-nav"
            aria-label={shown ? "Fold the page list away" : "Show every page"}
            title={shown ? "Fold the page list away" : "Show every page"}
            /* One mark in both states rather than two. This opens and shuts
               the same thing, and swapping the icon for a cross would say it
               dismisses something, which it does not: the list is still there
               behind a 52px strip. The state is carried by the fill. */
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-field transition-colors",
              shown
                ? "bg-well text-ink hover:bg-hair"
                : "text-quiet hover:bg-well hover:text-ink",
            )}
          >
            <Menu aria-hidden className="size-[18px]" strokeWidth={2} />
          </button>
        </div>

        {/* Taken out of the document when folded rather than hidden by
            `overflow`. A list nobody can see should not be one a keyboard can
            still tab into or a screen reader still reads out. */}
        {shown ? (
          <nav
            id="site-rail-nav"
            aria-label="All pages"
            /* No left padding. The list's own left edge is the marker's column,
               so this puts the 2px bar hard against the panel's edge and the
               labels one gap in from it - the rail's whole width goes to the
               words rather than to an indent in front of them.

               `overflow-x-hidden` is not decoration. `overflow-y-auto` alone
               computes the other axis to `auto` as well, and with the bar hidden
               that turns any wide row into a sideways scroll nothing announces:
               the list ends up nudged off its own left edge and reads as cut
               off, with no scrollbar to explain why. */
            className="quiet-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto pt-1 pr-(--rail-gutter) pb-10"
          >
            <RailNav pathname={pathname} />
          </nav>
        ) : null}
      </div>
    </div>
  );
}
