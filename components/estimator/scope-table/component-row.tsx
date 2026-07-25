"use client";

import { ChevronDown } from "lucide-react";

import { money, type ScopeComponent } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";
import { OptionRow } from "./option-row";
import type { ScopeTableDensity } from "./types";

interface ComponentRowProps {
  component: ScopeComponent;
  density: ScopeTableDensity;
  descriptionClassName?: string;
}

/**
 * A component and its options. The row is the jump target: the mock-up looks it
 * up by `data-scope-row` and snaps the panel to it.
 */
export function ComponentRow({
  component,
  density,
  descriptionClassName,
}: ComponentRowProps) {
  const {
    isComponentOpen,
    toggleComponent,
    focusedComponentId,
    totals,
    registerRow,
  } = useScope();

  const open = isComponentOpen(component.id);
  const subtotal = totals.componentTotals[component.id] ?? 0;
  const included = subtotal > 0;
  const focused = focusedComponentId === component.id;
  const compact = density === "compact";

  return (
    <div
      ref={(node) => {
        registerRow(component.id, node);
      }}
      data-scope-row={component.id}
      className={cn(
        "transition-all duration-200",
        compact
          ? [
              "mt-[7px] rounded-[12px] border bg-surface",
              focused
                ? "border-[var(--scope-accent)] shadow-[0_0_0_3px_var(--scope-ring)]"
                : "border-hairline shadow-[0_1px_2px_rgba(31,36,48,0.04)]",
            ]
          : [
              "rounded-row",
              focused
                ? "bg-[var(--scope-wash)] shadow-[inset_0_0_0_1.5px_var(--scope-edge)]"
                : "bg-transparent",
            ],
      )}
    >
      <button
        type="button"
        onClick={() => toggleComponent(component.id)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2.5",
          compact ? "px-2.5 py-2" : "py-2.5 pr-2 pl-3 sm:pl-6",
        )}
      >
        <ChevronDown
          aria-hidden
          className={cn(
            "size-[9px] shrink-0 text-ink-5 transition-transform duration-200",
            !open && "-rotate-90",
          )}
          strokeWidth={3}
        />

        <span
          className={cn(
            "shrink-0 font-extrabold",
            compact ? "text-[12.5px]" : "text-[13.5px]",
          )}
        >
          {component.name}
        </span>

        <span
          className={cn(
            "hidden min-w-0 flex-1 truncate text-left text-[11.5px] text-ink-4 lg:block",
            descriptionClassName,
          )}
        >
          {component.what}
        </span>

        <span className="flex-1" />

        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-[3px] font-mono text-[10px] font-semibold tracking-[0.02em] tabular-nums transition-all duration-200",
            included
              ? "bg-[var(--scope-tint)] text-[var(--scope-accent)]"
              : "bg-chip text-ink-5",
          )}
        >
          {included ? money(subtotal) : "Not included"}
        </span>
      </button>

      <div
        className={cn(
          "flex flex-col gap-px",
          compact ? "pt-0 pr-2 pb-2 pl-3.5" : "pt-0 pr-2 pb-2.5 pl-4 sm:pl-12",
          !open && "hidden",
        )}
      >
        {component.options.map((option) => (
          <OptionRow
            key={option.id}
            option={option}
            descriptionClassName={descriptionClassName}
          />
        ))}
      </div>
    </div>
  );
}
