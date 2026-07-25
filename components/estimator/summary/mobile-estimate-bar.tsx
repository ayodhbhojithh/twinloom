"use client";

import { describeScope } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";

/**
 * On a phone the estimate card sits well below the fold, which would break the
 * one thing the estimator is for: watching the number move as you tick. This
 * keeps the range pinned while the estimator is on screen.
 */
export function MobileEstimateBar({ className }: { className?: string }) {
  const { totals } = useScope();
  const summary = describeScope(totals);

  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 -mx-4 mt-4 border-t border-hairline bg-surface/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[19px] font-extrabold tracking-[-0.02em] tabular-nums">
              {summary.range}
            </span>
            <span className="font-mono text-[9.5px] tracking-[0.1em] text-live">
              ● live
            </span>
          </div>
          <p className="truncate font-mono text-[10.5px] tracking-[0.04em] text-mono">
            {summary.tierName} · {summary.timeline} · {totals.optionsTicked} items
          </p>
        </div>

        <a
          href="#estimate-card"
          className="shrink-0 rounded-row bg-brand px-3.5 py-2.5 text-[13px] font-bold text-white shadow-cta"
        >
          See the breakdown
        </a>
      </div>
    </div>
  );
}
