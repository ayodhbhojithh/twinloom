"use client";

import { accentVars, getSectionForComponent, money } from "@/lib/scope";
import type { MockupBlock as MockupBlockData } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";

/**
 * One band of the wireframe. Included blocks take their section's accent, left
 * out blocks fall back to a dashed outline. Clicking one is the mock-up half of
 * the two way link: it jumps the scope panel to that component's row.
 */
export function MockupBlock({ block }: { block: MockupBlockData }) {
  const { totals, focusedComponentId, jumpToComponent } = useScope();

  const section = getSectionForComponent(block.componentId);
  const subtotal = totals.componentTotals[block.componentId] ?? 0;
  const included = subtotal > 0;
  const focused = focusedComponentId === block.componentId;

  return (
    <button
      type="button"
      onClick={() => jumpToComponent(block.componentId)}
      style={{
        ...accentVars(section?.accent ?? "#7c3aed"),
        minHeight: `max(2.5rem, calc(var(--mock-unit) * ${block.weight}))`,
      }}
      aria-label={`${block.label}, ${
        included ? money(subtotal) : "not included"
      }. Show this in the scope`}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-[9px] border-[1.5px] px-3 transition-all duration-[250ms]",
        included
          ? "border-[var(--scope-edge)] bg-[var(--scope-wash)] text-[var(--scope-accent)]"
          : "border-dashed border-hairline-dashed bg-sunken text-ink-5",
        focused && "shadow-[0_0_0_3px_var(--scope-ring)]",
      )}
    >
      <span className="text-[11px] font-extrabold tracking-[0.02em] xl:text-[12.5px]">
        {block.label}
      </span>
      <span className="font-mono text-[9px] tracking-[0.06em] tabular-nums opacity-80 sm:text-[9.5px]">
        {included ? money(subtotal) : "+ add"}
      </span>
    </button>
  );
}
