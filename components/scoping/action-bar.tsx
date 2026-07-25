"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { STEP_COUNT } from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

/**
 * Back and next, pinned to the bottom of the viewport.
 *
 * A wizard's primary action should never need scrolling to. Sections five and six
 * are long enough that inline buttons sit well below the fold, and a visitor who
 * cannot see "next" assumes they are stuck.
 */
export function ActionBar() {
  const { index, isFirst, isLast, next, back, applies, percent } =
    useScopingSession();

  return (
    <div className="sticky bottom-0 z-30 border-t border-line bg-bg/95 backdrop-blur">
      {/* A hairline of progress along the very top edge of the bar. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-brand transition-[width] duration-700 ease-[var(--ease-out-soft)]"
        style={{ width: `${percent}%` }}
      />

      <div className="mx-auto flex w-full max-w-wide items-center gap-3 px-5 py-3 sm:px-[22px]">
        <button
          type="button"
          onClick={back}
          disabled={isFirst}
          className="inline-flex items-center gap-1.5 rounded-btn-sm border border-line bg-card px-3.5 py-2.5 text-[13px] font-semibold transition-colors hover:border-brand/40 hover:bg-soft disabled:pointer-events-none disabled:opacity-35"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Back
        </button>

        <p className="hidden font-mono text-[10.5px] tracking-[0.08em] text-faint uppercase tabular-nums sm:block">
          {index + 1} of {STEP_COUNT}
        </p>

        {!applies ? (
          <button
            type="button"
            onClick={next}
            className="ml-auto text-[13px] font-semibold text-brand underline-offset-4 hover:underline"
          >
            Skip this
          </button>
        ) : null}

        <button
          type="button"
          onClick={next}
          disabled={isLast}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-btn-sm bg-brand px-4 py-2.5 text-[13px] font-bold text-white shadow-cta transition-all hover:-translate-y-px hover:shadow-cta-hover disabled:pointer-events-none disabled:opacity-35",
            applies && "ml-auto",
          )}
        >
          {isLast ? "Build my blueprint" : "Next"}
          <ArrowRight aria-hidden className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
