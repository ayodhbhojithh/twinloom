"use client";

import { SCOPE_SECTIONS } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";
import { SectionGroup } from "./section-group";
import type { ScopeTableDensity } from "./types";

interface ScopeTableProps {
  density?: ScopeTableDensity;
  /**
   * Extra classes for every description line, so a caller can drop them at a
   * breakpoint where the panel is too narrow to carry them.
   */
  descriptionClassName?: string;
  /** Small uppercase label in the panel head. */
  label?: string;
  /** Sits at the end of the panel head. The lanes rail puts its widen control here. */
  action?: React.ReactNode;
  /** Shown instead of the action when no action is supplied. */
  hint?: string;
  className?: string;
  scrollerClassName?: string;
}

/**
 * The scope panel. This is the pre estimator: every row is a selectable scope
 * item, and what is ticked here drives the mock-up, the running total, the
 * recommended package and the timeline.
 */
export function ScopeTable({
  density = "comfortable",
  descriptionClassName,
  label = "The scope",
  action,
  hint = "nothing ticked = not included, carets collapse",
  className,
  scrollerClassName,
}: ScopeTableProps) {
  const { registerScroller } = useScope();

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-card border border-hairline bg-surface",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-hairline-soft px-3.5 py-3 sm:px-[18px]">
        <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-5 uppercase">
          {label}
        </span>
        <span className="flex-1" />
        {action ?? (
          <span className="hidden font-mono text-[9.5px] tracking-[0.06em] text-ink-7 lg:inline">
            {hint}
          </span>
        )}
      </div>

      <div
        ref={registerScroller}
        data-scope-scroller
        className={cn(
          "scrollbar-slim min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-1 pb-4 sm:px-[18px]",
          scrollerClassName,
        )}
      >
        {SCOPE_SECTIONS.map((section) => (
          <SectionGroup
            key={section.id}
            section={section}
            density={density}
            descriptionClassName={descriptionClassName}
          />
        ))}
      </div>
    </div>
  );
}
