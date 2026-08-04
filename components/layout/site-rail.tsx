"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

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
 * three hundred pixels that screen would rather have. Folded it leaves a strip
 * with the control still on it, so the list is one press away and never gone.
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
        shown ? "w-[284px] xl:w-[308px] 2xl:w-[328px]" : "w-[52px]",
      )}
      style={{
        top: "var(--nav-height)",
        height: "calc(100svh - var(--nav-height))",
      }}
    >
      <div className="flex h-full flex-col">
        <div
          className={cn(
            "flex flex-none items-center px-3 pt-4 pb-1",
            shown ? "justify-end" : "justify-center",
          )}
        >
          <button
            type="button"
            onClick={() => writeOpen(!shown)}
            aria-expanded={shown}
            aria-controls="site-rail-nav"
            aria-label={shown ? "Fold the page list away" : "Show every page"}
            title={shown ? "Fold the page list away" : "Show every page"}
            className="flex size-8 cursor-pointer items-center justify-center rounded-field text-label transition-colors hover:bg-well hover:text-ink"
          >
            {shown ? (
              <PanelLeftClose aria-hidden className="size-[18px]" />
            ) : (
              <PanelLeftOpen aria-hidden className="size-[18px]" />
            )}
          </button>
        </div>

        {/* Taken out of the document when folded rather than hidden by
            `overflow`. A list nobody can see should not be one a keyboard can
            still tab into or a screen reader still reads out. */}
        {shown ? (
          <nav
            id="site-rail-nav"
            aria-label="All pages"
            className="quiet-scroll min-h-0 flex-1 overflow-y-auto pt-1 pb-10"
          >
            <RailNav pathname={pathname} />
          </nav>
        ) : null}
      </div>
    </div>
  );
}
