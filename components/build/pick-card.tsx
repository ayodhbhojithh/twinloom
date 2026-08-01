"use client";

import { cn } from "@/lib/utils";

import { Glyph } from "./glyph";

/**
 * One visitor group, as the prototype draws it: a card with an icon in a ring, a
 * name, a line about who they are, the label the group will carry on the site,
 * and a footer that says whether it is picked.
 *
 * Two controls, one answer. The card body is the real control and the footer is
 * a second surface for the same click, which is what the prototype does and what
 * makes a grid of these feel like a grid of buttons rather than a grid of text.
 * The footer is hidden from assistive technology and taken out of the tab order
 * so that a keyboard user gets seven controls here rather than fourteen.
 *
 * `wide` is for the card that takes the rest of its row. Seven cards across
 * three columns leaves one on its own with a hole beside it, so the last one
 * spans instead and lays its content out in a line. A stretched tile would read
 * as a mistake; a card of a different shape reads as the end of the list.
 */
export function PickCard({
  on,
  icon,
  name,
  sub,
  short,
  wide,
  onToggle,
}: {
  on: boolean;
  icon: string;
  name: string;
  sub: string;
  short: string;
  wide?: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-card border bg-field transition-colors",
        on ? "border-ink bg-well" : "border-border hover:border-[#d5d8de]",
        wide && "sm:flex-row",
      )}
    >
      <button
        type="button"
        aria-pressed={on}
        onClick={onToggle}
        className={cn(
          "flex min-w-0 flex-1 cursor-pointer flex-col px-[15px] pt-[15px] pb-[13px] text-left",
          wide && "sm:flex-row sm:items-center sm:gap-4 sm:py-[15px]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "mb-3 flex size-[34px] flex-none items-center justify-center rounded-pill border transition-colors",
            on ? "border-ink bg-ink text-white" : "border-border text-quiet",
            wide && "sm:mb-0",
          )}
        >
          <Glyph path={icon} className="size-[17px]" />
        </span>

        <span
          className={cn(
            "mb-[5px] text-[15px] leading-[1.28] font-bold text-ink",
            wide && "sm:mb-0 sm:flex-none",
          )}
        >
          {name}
        </span>
        <span className="flex-1 text-[13px] leading-[1.45] text-quiet">
          {sub}
        </span>
        <span
          className={cn(
            "mt-[11px] font-mono text-[10.5px] font-semibold tracking-[0.1em] text-idx uppercase",
            wide && "sm:mt-0 sm:flex-none",
          )}
        >
          {short}
        </span>
      </button>

      <div
        className={cn(
          "flex items-stretch border-t border-hair",
          wide && "sm:flex-none sm:border-t-0 sm:border-l",
        )}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={onToggle}
          className={cn(
            "flex-1 cursor-pointer px-[14px] py-[10px] text-left font-mono text-[10.5px] font-bold tracking-[0.1em] uppercase transition-colors",
            on ? "text-done" : "text-quiet hover:text-ink",
            wide && "sm:flex sm:w-[112px] sm:items-center",
          )}
        >
          {on ? "• Picked" : "Pick"}
        </button>
      </div>
    </div>
  );
}
