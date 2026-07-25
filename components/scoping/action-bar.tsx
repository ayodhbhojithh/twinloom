"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { STEPS } from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

/**
 * Back, next, and where you are, as one floating island.
 *
 * A full width bar reads as browser chrome and leaves a corridor of dead space
 * between the two buttons on a wide screen. An island keeps them a thumb's width
 * apart at any size, and stays clearly part of the page rather than pinned to it.
 *
 * Sticky rather than fixed, so it travels with the journey and stops at the end of
 * it instead of floating over the footer.
 */
export function ActionBar() {
  const { index, isFirst, isLast, next, back, goTo, applies, complete } =
    useScopingSession();

  /* Lifted clear of the Thoughts launcher, which takes the bottom of the screen
     below the panel breakpoint. Above it the launcher is a tab on the right edge
     and there is nothing to avoid. */
  return (
    <div className="pointer-events-none sticky bottom-[76px] z-30 mt-8 flex justify-center panel:bottom-6">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-card/95 p-1.5 shadow-[0_14px_36px_-12px_rgba(35,39,51,0.28)] backdrop-blur">
        <button
          type="button"
          onClick={back}
          disabled={isFirst}
          aria-label="Previous section"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-body transition-colors hover:bg-soft hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowLeft aria-hidden className="size-4" />
        </button>

        {/* One dot per section, jumpable. The rail says the same thing in words;
            this is the version that fits in a pill. */}
        <ol className="hidden items-center gap-1.5 px-1 sm:flex">
          {STEPS.map((step, at) => {
            const current = at === index;
            const done = complete(at);

            return (
              <li key={step.key}>
                <button
                  type="button"
                  onClick={() => goTo(at)}
                  title={`${at + 1}. ${step.kicker}`}
                  aria-label={`Go to section ${at + 1}, ${step.kicker}`}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all duration-300",
                    current
                      ? "h-2.5 w-6 bg-brand"
                      : done
                        ? "size-2.5 bg-brand/45 hover:bg-brand/70"
                        : "size-2.5 bg-line hover:bg-faint",
                  )}
                />
              </li>
            );
          })}
        </ol>

        <span className="px-2 font-mono text-[11px] font-bold tracking-[0.06em] text-faint uppercase tabular-nums sm:hidden">
          {index + 1} / {STEPS.length}
        </span>

        {!applies ? (
          <button
            type="button"
            onClick={next}
            className="rounded-full px-3 text-[12.5px] font-semibold text-brand transition-colors hover:bg-soft"
          >
            Skip
          </button>
        ) : null}

        <button
          type="button"
          onClick={next}
          disabled={isLast}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 text-[13px] font-bold whitespace-nowrap text-white shadow-cta transition-all hover:-translate-y-px hover:shadow-cta-hover disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-35 disabled:shadow-none"
        >
          {isLast ? (
            <>
              <Check aria-hidden className="size-4" strokeWidth={3} />
              Build my blueprint
            </>
          ) : (
            <>
              Next
              <ArrowRight aria-hidden className="size-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
