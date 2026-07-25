"use client";

import { Check } from "lucide-react";

import { STEPS } from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

/**
 * Every section, jumpable, with its state on it.
 *
 * The journey is eight sections and none of them are gated, so hiding the map
 * would only make it feel longer than it is. A complete section shows a tick, the
 * one in play is filled, the rest are outlines.
 */
export function StepRail() {
  const { index, goTo, complete } = useScopingSession();

  return (
    <ol className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {STEPS.map((step, at) => {
        const current = at === index;
        const done = complete(at);

        return (
          <li key={step.key} className="shrink-0">
            <button
              type="button"
              onClick={() => goTo(at)}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap transition-all",
                current
                  ? "border-brand bg-brand text-white"
                  : done
                    ? "border-brand/30 bg-soft text-brand"
                    : "border-line bg-card text-body hover:border-brand/30 hover:text-ink",
              )}
            >
              {done && !current ? (
                <Check aria-hidden className="size-3" strokeWidth={3} />
              ) : (
                <span className="font-mono text-[10.5px] tabular-nums opacity-70">
                  {at + 1}
                </span>
              )}
              {step.kicker}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
