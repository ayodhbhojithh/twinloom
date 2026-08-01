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
 */
export function PickCard({
  on,
  icon,
  name,
  sub,
  short,
  onToggle,
}: {
  on: boolean;
  icon: string;
  name: string;
  sub: string;
  short: string;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-card border bg-field transition-colors",
        on ? "border-ink bg-well" : "border-border hover:border-[#d5d8de]",
      )}
    >
      <button
        type="button"
        aria-pressed={on}
        onClick={onToggle}
        className="flex min-w-0 flex-1 cursor-pointer flex-col px-[15px] pt-[15px] pb-[13px] text-left"
      >
        <span
          aria-hidden
          className={cn(
            "mb-3 flex size-[34px] items-center justify-center rounded-pill border transition-colors",
            on
              ? "border-ink bg-ink text-white"
              : "border-border text-quiet",
          )}
        >
          <Glyph path={icon} className="size-[17px]" />
        </span>

        <span className="mb-[5px] text-[15px] leading-[1.28] font-bold text-ink">
          {name}
        </span>
        <span className="flex-1 text-[13px] leading-[1.45] text-quiet">
          {sub}
        </span>
        <span className="mt-[11px] font-mono text-[10.5px] font-semibold tracking-[0.1em] text-idx uppercase">
          {short}
        </span>
      </button>

      <div className="flex items-stretch border-t border-hair">
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={onToggle}
          className={cn(
            "flex-1 cursor-pointer px-[14px] py-[10px] text-left font-mono text-[10.5px] font-bold tracking-[0.1em] uppercase transition-colors",
            on ? "text-done" : "text-quiet hover:text-ink",
          )}
        >
          {on ? "• Picked" : "Pick"}
        </button>
      </div>
    </div>
  );
}
