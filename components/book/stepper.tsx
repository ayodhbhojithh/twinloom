"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { STEPS } from "./meetings";

/**
 * Where you are, and how much is left.
 *
 * An ordered list, because that is what it is, with the current step carrying
 * `aria-current`. The connecting rule fills behind the steps already done, so
 * progress is readable from the shape of the thing before any of the labels are
 * read.
 *
 * The labels go below the small breakpoint and the numbers stay. Four words
 * across a phone would either wrap or shrink to nothing, and the count is the
 * part that carries the meaning.
 */
export function Stepper({
  at,
  onGo,
}: {
  at: number;
  onGo: (step: number) => void;
}) {
  return (
    <nav aria-label="Booking steps">
      <ol className="flex items-center">
        {STEPS.map((label, index) => {
          const done = index < at;
          const here = index === at;
          const last = index === STEPS.length - 1;

          return (
            <li
              key={label}
              className={cn("flex items-center", !last && "flex-1")}
              aria-current={here ? "step" : undefined}
            >
              <button
                type="button"
                disabled={!done}
                onClick={() => onGo(index)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-pill py-1 pr-2.5 text-left transition-colors",
                  done ? "cursor-pointer" : "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-pill border font-mono text-[11px] font-bold tabular-nums transition-colors",
                    done && "border-active accent-fill text-white",
                    here && "border-active text-active",
                    !done && !here && "border-border text-label",
                  )}
                >
                  {done ? (
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>

                <span
                  className={cn(
                    "hidden text-[13.5px] font-semibold whitespace-nowrap transition-colors sm:block",
                    here && "text-ink",
                    done && "text-quiet",
                    !done && !here && "text-label",
                  )}
                >
                  {label}
                </span>
              </button>

              {last ? null : (
                <span
                  aria-hidden
                  className={cn(
                    "mx-2 h-px min-w-4 flex-1 transition-colors",
                    done ? "accent-fill" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
