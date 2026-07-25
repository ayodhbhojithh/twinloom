"use client";

import { ChevronDown } from "lucide-react";

import { accentVars, money, type ScopeSection } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";
import { ComponentRow } from "./component-row";
import type { ScopeTableDensity } from "./types";

interface SectionGroupProps {
  section: ScopeSection;
  density: ScopeTableDensity;
  descriptionClassName?: string;
}

/**
 * A scope section and its running subtotal. The accent is published here as CSS
 * variables, so every row underneath tints itself without prop drilling colour.
 */
export function SectionGroup({
  section,
  density,
  descriptionClassName,
}: SectionGroupProps) {
  const { isSectionOpen, toggleSection, totals } = useScope();

  const open = isSectionOpen(section.id);
  const subtotal = totals.sectionTotals[section.id] ?? 0;

  return (
    <div className="mt-3" style={accentVars(section.accent)}>
      <button
        type="button"
        onClick={() => toggleSection(section.id)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-row px-0.5 py-1.5 transition-colors hover:bg-sunken"
      >
        <ChevronDown
          aria-hidden
          className={cn(
            "size-2.5 shrink-0 text-ink-5 transition-transform duration-200",
            !open && "-rotate-90",
          )}
          strokeWidth={3}
        />

        <span
          aria-hidden
          className="size-[9px] shrink-0 rounded-full bg-[var(--scope-accent)]"
        />

        <span className="font-mono text-[10.5px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
          {section.name}
        </span>

        <span
          className={cn(
            "hidden truncate font-script text-[17px] leading-none text-ink-5 md:block",
            descriptionClassName,
          )}
        >
          {section.tag}
        </span>

        <span className="flex-1" />

        <span className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-ink-3">
          {money(subtotal)}
        </span>
      </button>

      <div className={cn(!open && "hidden")}>
        {section.components.map((component) => (
          <ComponentRow
            key={component.id}
            component={component}
            density={density}
            descriptionClassName={descriptionClassName}
          />
        ))}
      </div>
    </div>
  );
}
