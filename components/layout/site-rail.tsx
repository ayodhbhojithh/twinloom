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

/* ---------------------------------------------------------------------------
   Whether there is room to open at all.

   The rail has two jobs and they want different widths. Carrying the page names
   needs about two hundred and thirty pixels; being a way to every page needs
   sixty, which a tablet can spare and a phone cannot. So the strip starts a
   breakpoint earlier than the list does, and between the two the rail is a
   column of marks rather than nothing at all with a menu button in the header.

   Below the width the list needs, the fold preference is simply not consulted.
   Somebody who opened the rail on a desktop has not asked for a two hundred
   pixel panel on a tablet, and offering the control there would be offering a
   state the screen cannot hold.
--------------------------------------------------------------------------- */
const ROOM = "(min-width: 64rem)";

const subscribeRoom = (listener: () => void) => {
  const query = window.matchMedia(ROOM);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};

const readRoom = () => window.matchMedia(ROOM).matches;
const roomOnServer = () => true;

/* ---------------------------------------------------------------------------
   Whether the page has settled.

   Both stores above read as their server value first and correct themselves on
   hydration. That correction is the right width arriving; animated, it is a
   panel that slides for no reason a moment after the page has loaded, which
   reads as the layout still making its mind up.

   So the width transition is switched on two frames after the first subscriber
   arrives - one for the hydration correction to land, one to be sure it has
   painted. A store rather than a `useState` in an effect: this is a fact about
   the document, not state React owns, and the same value serves every rail on
   the page.
--------------------------------------------------------------------------- */
let settled = false;
let settling = false;
const settleListeners = new Set<() => void>();

const subscribeSettled = (listener: () => void) => {
  settleListeners.add(listener);

  if (!settled && !settling) {
    settling = true;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        settled = true;
        for (const each of settleListeners) each();
      }),
    );
  }

  return () => {
    settleListeners.delete(listener);
  };
};

const readSettled = () => settled;
const settledOnServer = () => false;

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
 * It folds, and folded it is still a navigation. Some of these pages are working
 * screens rather than reading ones - the run-through is three columns of its own
 * - and on a laptop the open rail is a quarter of a thousand pixels that screen
 * would rather have. What is left is a strip of marks: every page still one
 * press away, still showing which one you are on, in sixty pixels instead of two
 * hundred and thirty. A fold that emptied the panel would be a navigation that
 * has to be reopened before it can be used, which is a worse trade than the
 * width it was buying.
 *
 * The strip starts a breakpoint before the list does, so a tablet gets standing
 * navigation rather than a menu button. Below that the header's sheet carries
 * the same list from the same component.
 *
 * `border-e` rather than `border-r`, and the same for everything inside it. The
 * rail is on the side the language starts from, which is not always the left.
 */
export function SiteRail() {
  const pathname = usePathname();
  const open = useSyncExternalStore(subscribe, readOpen, openOnServer);
  const room = useSyncExternalStore(subscribeRoom, readRoom, roomOnServer);
  const shown = open && room;

  /* The width animates once the reader is here, not on the way in. */
  const settled = useSyncExternalStore(
    subscribeSettled,
    readSettled,
    settledOnServer,
  );

  return (
    <div
      className={cn(
        "sticky hidden shrink-0 border-e border-border bg-field md:block",
        /* Width, and only width. Animating what is inside as well would read as
           the page rebuilding itself rather than as a panel getting out of the
           way. */
        settled &&
          "transition-[width] duration-300 ease-out motion-reduce:transition-none",
        /* As narrow as the longest label needs and no narrower. The list is
           short words - `Blogs and articles` is the longest of them - and the
           width it was set to left a column of empty panel to the right of
           every line, which the page beside it would rather have.

           Sixty folded, not fifty two. The strip is a column of targets now
           rather than one button, and forty pixels of target wants a little
           more than forty pixels of panel around it. */
        shown ? "w-[228px] xl:w-[244px] 2xl:w-[260px]" : "w-[60px]",
      )}
      style={{
        top: "var(--nav-height)",
        height: "calc(100svh - var(--nav-height))",
      }}
    >
      <div className="flex h-full flex-col">
        {/* The control sits on the same trailing gutter the list does, so the
            panel has one trailing edge rather than a button tucked closer to it
            than anything underneath. Folded there is no gutter to keep: the
            strip is one column, and everything in it is centred.

            Only where the list will fit. Below that the rail cannot open, so a
            control that offers to open it offers a state the screen does not
            have - and a button that does nothing is worse than no button. */}
        {room ? (
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
                 dismisses something, which it does not: every page is still on
                 the strip. The state is carried by the fill.

                 A bar of lines rather than a panel-with-an-arrow, which is the
                 other convention: an arrow has a direction, and the direction
                 is wrong the moment the rail is on the other side of a page
                 that reads right to left. */
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
        ) : null}

        {/* Always here, in one form or the other. Folded, it is the same list
            with the words taken off rather than the list taken away: a
            navigation that has to be reopened before it can be used is not a
            navigation that folded, it is one that closed. */}
        <nav
          id="site-rail-nav"
          aria-label="All pages"
          /* Open, no leading padding: the list's own leading edge is the
             marker's column, so the 2px bar sits hard against the panel's edge
             and the labels one gap in from it. The rail's whole width goes to
             the words rather than to an indent in front of them. Folded, an
             even inset, because a column of centred marks has no lane to hold.

             `overflow-x-hidden` is not decoration. `overflow-y-auto` alone
             computes the other axis to `auto` as well, and with the bar hidden
             that turns any wide row into a sideways scroll nothing announces:
             the list ends up nudged off its own leading edge and reads as cut
             off, with no scrollbar to explain why. */
          className={cn(
            "quiet-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-10",
            shown ? "pt-1 pe-(--rail-gutter)" : "px-2 pt-2",
          )}
        >
          <RailNav pathname={pathname} size={shown ? "rail" : "strip"} />
        </nav>
      </div>
    </div>
  );
}
