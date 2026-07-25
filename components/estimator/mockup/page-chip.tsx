"use client";

import { accentVars, getSectionForComponent, money } from "@/lib/scope";
import type { MockupChip } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";

/** A page other than home. Same mechanics as a wireframe block. */
export function PageChip({ chip }: { chip: MockupChip }) {
  const { totals, focusedComponentId, jumpToComponent } = useScope();

  const section = getSectionForComponent(chip.componentId);
  const subtotal = totals.componentTotals[chip.componentId] ?? 0;
  const included = subtotal > 0;
  const focused = focusedComponentId === chip.componentId;

  return (
    <button
      type="button"
      onClick={() => jumpToComponent(chip.componentId)}
      style={{
        ...accentVars(section?.accent ?? "#7c3aed"),
        minHeight: "var(--page-h)",
      }}
      aria-label={`${chip.label}, ${
        included ? money(subtotal) : "not included"
      }. Show this in the scope`}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-[3px] rounded-[10px] border-[1.5px] px-2 transition-all duration-[250ms]",
        included
          ? "border-[var(--scope-edge)] bg-[var(--scope-wash)] text-[var(--scope-accent)]"
          : "border-dashed border-hairline-dashed bg-sunken text-ink-5",
        focused && "shadow-[0_0_0_3px_var(--scope-ring)]",
      )}
    >
      <span className="text-center text-[10.5px] font-extrabold">
        {chip.label}
      </span>
      <span className="font-mono text-[8.5px] tracking-[0.06em] tabular-nums opacity-80">
        {included ? money(subtotal) : "+ add"}
      </span>
    </button>
  );
}
