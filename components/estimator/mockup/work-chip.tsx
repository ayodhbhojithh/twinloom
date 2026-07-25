"use client";

import { accentVars, getSectionForComponent, money } from "@/lib/scope";
import type { MockupChip } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";

/**
 * Work with no place on a wireframe: SEO, copy, analytics, hosting, the legal
 * bits. Shown as pills so the invisible half of the build is still visible.
 */
export function WorkChip({ chip }: { chip: MockupChip }) {
  const { totals, focusedComponentId, jumpToComponent } = useScope();

  const section = getSectionForComponent(chip.componentId);
  const subtotal = totals.componentTotals[chip.componentId] ?? 0;
  const included = subtotal > 0;
  const focused = focusedComponentId === chip.componentId;

  return (
    <button
      type="button"
      onClick={() => jumpToComponent(chip.componentId)}
      style={accentVars(section?.accent ?? "#7c3aed")}
      aria-label={`${chip.label}, ${
        included ? money(subtotal) : "not included"
      }. Show this in the scope`}
      className={cn(
        "flex items-center gap-[7px] rounded-full border-[1.5px] px-3 py-1.5 text-[11px] font-bold transition-all duration-[250ms]",
        included
          ? "border-[var(--scope-edge)] bg-[var(--scope-wash)] text-[var(--scope-accent)]"
          : "border-dashed border-hairline-dashed bg-sunken text-ink-5",
        focused && "shadow-[0_0_0_3px_var(--scope-ring)]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-[7px] shrink-0 rounded-full",
          included ? "bg-[var(--scope-accent)]" : "bg-tick-border",
        )}
      />
      {chip.label}
    </button>
  );
}
