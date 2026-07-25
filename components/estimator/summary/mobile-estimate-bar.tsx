"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/content/site";
import { describeScope } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";

/**
 * On a phone the estimate card sits well below the fold, which would break the
 * one thing the panel is for: seeing the number move as you tick. This keeps the
 * running total pinned while the estimator is on screen.
 */
export function MobileEstimateBar({
  className,
  hideFrom = "lg",
}: {
  className?: string;
  /** Breakpoint at which the full estimate column takes over. */
  hideFrom?: "lg" | "xl";
}) {
  const { totals } = useScope();
  const summary = describeScope(totals);

  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 -mx-4 mt-4 border-t border-hairline bg-surface/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6",
        hideFrom === "lg" ? "lg:hidden" : "xl:hidden",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold tracking-[-0.02em] tabular-nums">
              {summary.total}
            </span>
            <span className="truncate font-mono text-[9.5px] tracking-[0.06em] text-ink-5 uppercase">
              {summary.tierName}
            </span>
          </div>
          <p className="truncate text-[11px] text-ink-4">
            <span className="tabular-nums">{summary.range}</span> indicative,{" "}
            {summary.timeline}
          </p>
        </div>

        <Button asChild size="sm" className="h-9 shrink-0">
          <a href={SITE.bookingHref}>
            Book a call
            <ArrowRight data-icon="inline-end" />
          </a>
        </Button>
      </div>
    </div>
  );
}
