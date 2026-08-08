"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  CircleHelp,
  Hammer,
  Handshake,
  Route,
  House,
  Info,
  Mail,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

import { ROUTES, RAIL_PAGES, type NavLink as NavLinkData } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * A mark for every page in the rail.
 *
 * The rail folds to a strip, and a strip cannot carry words - so each page needs
 * something that survives at 20px and still says which page it is. Without one,
 * folding the rail leaves a column of identical blank rows, which is a list that
 * has been hidden rather than one that has been made narrow.
 *
 * Keyed off `ROUTES` rather than written out as strings, so a route that gets
 * renamed takes its mark with it instead of quietly falling back to the default.
 *
 * Sub pages are deliberately absent. They are versions of the page above them
 * rather than places of their own, a mark each would be six near identical
 * scribbles down the rail, and the strip does not show them at all.
 */
const MARKS: Record<string, LucideIcon> = {
  [ROUTES.home]: House,
  [ROUTES.build]: Hammer,
  [ROUTES.about]: Info,
  [ROUTES.how]: Route,
  [ROUTES.services]: Handshake,
  [ROUTES.contact]: Mail,
  [ROUTES.faq]: CircleHelp,
  [ROUTES.blog]: Newspaper,
};

/**
 * Where the marker sits, and how far a sub page steps in.
 *
 * The list holds one thing only: the gap between the 2px marker and what it
 * marks. Its own leading edge is the marker's column, so whatever holds the list
 * decides where that column falls - hard against the rail's edge, or inside the
 * phone sheet's padding with the rest of the sheet.
 *
 * `NEST` is the width of a mark plus its gap, so a sub page starts exactly where
 * its parent's words start rather than at an indent picked to look about right.
 * Everything on the leading side is logical - `border-s`, `ps` - so the whole
 * rail reverses with the writing direction instead of stranding its markers on
 * the wrong edge in Arabic or Hebrew.
 */
const HANG = 12;
const MARK = 18;
const GAP = 10;
const NEST = MARK + GAP;

/**
 * Every page on the site, shared by the docked rail and the phone menu.
 *
 * One component for all three states, because they are one navigation seen at
 * three widths: the strip, the docked rail and the phone sheet. Written
 * separately, the menu quietly lost its indents and a phone got a flat list
 * where a laptop got a structured one.
 *
 * Ink marks the page you are on, not the accent. Blue is the site's one action
 * colour, and a rail that paints the current page in it competes with every
 * button on the screen for the same meaning. This is where you are, not
 * something to do.
 */
export function RailNav({
  pathname,
  onNavigate,
  size = "rail",
}: {
  pathname: string;
  /** The menu closes itself on the way out; the docked rail has nothing to do. */
  onNavigate?: () => void;
  /** `strip` is the folded rail: marks only, and no sub pages. */
  size?: "rail" | "menu" | "strip";
}) {
  const strip = size === "strip";
  const [tip, setTip] = useState<Tip | null>(null);

  return (
    <>
      <ul className={cn(strip && "flex flex-col items-center gap-0.5")}>
        {RAIL_PAGES.map((page) => (
          <li key={page.href} className={cn(strip && "w-full")}>
            <Row
              page={page}
              pathname={pathname}
              onNavigate={onNavigate}
              size={size}
              onTip={strip ? setTip : undefined}
            />

            {/* Not in the strip. A sub page has no mark, so it would be a blank
                row - and a strip is a list of places, not a list of
                everything. */}
            {strip
              ? null
              : page.children?.map((child) => (
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

      {/* Outside the list, because a `ul` takes `li` and nothing else. It is
          `fixed`, so where it sits in the tree decides nothing about where it
          is drawn. */}
      {tip ? <StripTip tip={tip} /> : null}
    </>
  );
}

function Row({
  page,
  pathname,
  onNavigate,
  size,
  nested,
  onTip,
}: {
  page: NavLinkData;
  pathname: string;
  onNavigate?: () => void;
  size: "rail" | "menu" | "strip";
  nested?: boolean;
  /** Given only in the strip, where a mark on its own needs naming. */
  onTip?: (tip: Tip | null) => void;
}) {
  const here = pathname === page.href;
  const strip = size === "strip";
  const menu = size === "menu";
  const Mark = MARKS[page.href];

  /* In the strip the words are gone, so the link is labelled for a screen
     reader and its name is put beside it for everyone else. No `title`: the
     browser's own tooltip waits most of a second, arrives under the pointer
     rather than beside the thing it names, and lands on top of the next mark
     down. It would also mean two tooltips for one row. */
  const named = strip ? { "aria-label": page.label } : {};

  /* Measured from the row rather than guessed from its index, so a scrolled
     strip names the mark actually under the pointer. */
  const raise = (node: HTMLElement) => {
    const box = node.getBoundingClientRect();
    onTip?.({
      label: page.label,
      top: box.top + box.height / 2,
      near: box.right,
      far: box.left,
    });
  };

  const tipping = onTip
    ? {
        onPointerEnter: (event: React.PointerEvent<HTMLAnchorElement>) =>
          raise(event.currentTarget),
        onFocus: (event: React.FocusEvent<HTMLAnchorElement>) =>
          raise(event.currentTarget),
        onPointerLeave: () => onTip(null),
        onBlur: () => onTip(null),
      }
    : {};

  return (
    <Link
      href={page.href}
      /* Both here rather than one of them in the spread above, which would
         have overwritten the other. A name that stays up over the page
         somebody has just gone to is a label with nothing left to label. */
      onClick={() => {
        onTip?.(null);
        onNavigate?.();
      }}
      aria-current={here ? "page" : undefined}
      {...named}
      {...tipping}
      /* The sheet indents with padding of its own, so a sub page only has to
         step past the mark's column. The rail still hangs its marker in the
         gutter and measures from there. */
      style={
        strip
          ? undefined
          : menu
            ? { paddingInlineStart: (nested ? NEST : 0) + 14 }
            : { paddingInlineStart: HANG - 2 + (nested ? NEST : 0) }
      }
      className={cn(
        "flex items-center transition-colors",

        /* Centred in the strip, and the whole width of it, so the target is the
           strip rather than the 20px drawing in the middle of it. */
        strip && "justify-center rounded-field py-2.5",

        /* The sheet marks the page you are on by filling the row, not by a rule
           down its leading edge. A two pixel bar beside a list is the house
           style of every dashboard template there is, and it says the same thing
           a filled row says while looking like it was chosen from a menu. Filled,
           the row is also the target - the whole width of it presses, which is
           what a thumb is aiming at. */
        menu &&
          cn(
            "gap-3 rounded-[12px] pe-3 leading-[1.35]",
            nested ? "py-2 text-[14.5px]" : "py-2.5 text-[15.5px]",
            here
              ? "bg-well font-semibold text-ink"
              : "text-body hover:bg-canvas hover:text-ink",
          ),

        !strip &&
          !menu &&
          cn(
            "gap-2.5 border-s-2 py-[7px] leading-[1.4]",
            nested ? "text-[14px]" : "text-[15px]",
            here
              ? "border-ink font-semibold text-ink"
              : "border-transparent text-body hover:text-ink",
          ),

        strip &&
          (here
            ? "bg-well text-ink"
            : "text-quiet hover:bg-well hover:text-ink"),
      )}
    >
      {/* The mark holds its column whether it has a drawing in it or not, so a
          page without one still starts its words where every other page does.
          A sub page has neither: it is indented past the column entirely. */}
      {nested ? null : (
        <span
          aria-hidden
          className="flex flex-none items-center justify-center"
          style={{ width: MARK, height: MARK }}
        >
          {Mark ? (
            <Mark
              className={cn(menu ? "size-[18px]" : "size-[17px]")}
              strokeWidth={here && menu ? 2.2 : 1.9}
            />
          ) : null}
        </span>
      )}

      {strip ? null : <span className="min-w-0 truncate">{page.label}</span>}
    </Link>
  );
}

/** A row's name, and where on the screen the row is. */
interface Tip {
  label: string;
  /** The row's middle, so the name sits level with the mark rather than above it. */
  top: number;
  /** The row's edges: the one the name goes beside, and the one it goes beside in the other direction. */
  near: number;
  far: number;
}

/**
 * The name of a mark, beside the mark.
 *
 * On the body, through a portal, and both halves of that matter.
 *
 * `fixed` is why it is not a span inside the row: the strip scrolls, and
 * `overflow-y: auto` makes the other axis `auto` too, so anything drawn past the
 * strip's edge from inside it is clipped by the strip.
 *
 * The portal is why `fixed` is not enough on its own. The rail is `sticky`, and
 * a stickily positioned element always establishes a stacking context - so a
 * `z-index` set inside the rail is only ever a rank among the rail's own
 * children, however large the number. The page column comes after the rail in
 * the document and paints over the whole context, tooltip included. Moved to the
 * body it is ranked against the page rather than against the rail.
 *
 * Placed from the row's own rectangle rather than from its position in the list,
 * so it stays level with the mark under the pointer even when the strip has been
 * scrolled. It sits after the mark in the reading direction and swaps to the
 * other side when the direction does, because a name that runs off the window is
 * not a name.
 *
 * `aria-hidden`, because the link it belongs to already carries the same words
 * as its label. Read out here as well it would be the same name twice.
 */
function StripTip({ tip }: { tip: Tip }) {
  const rtl =
    getComputedStyle(document.documentElement).direction === "rtl";

  return createPortal(
    <span
      role="tooltip"
      aria-hidden
      className="pointer-events-none fixed z-50 animate-in rounded-field bg-ink px-2.5 py-1.5 text-[12.5px] leading-none font-semibold whitespace-nowrap text-white shadow-lg duration-150 fade-in-0 zoom-in-95"
      style={{
        top: tip.top,
        left: rtl ? tip.far - 10 : tip.near + 10,
        transform: rtl ? "translate(-100%, -50%)" : "translateY(-50%)",
      }}
    >
      {tip.label}
    </span>,
    document.body,
  );
}
