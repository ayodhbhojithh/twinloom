"use client";

import { Check, Slash } from "lucide-react";

import {
  conditionMet,
  effortRag,
  RAG_COLOUR,
  sectionSummary,
  STEP_COUNT,
  STEPS,
} from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

/**
 * The eight sections, beside the dial.
 *
 * Vertical, because the labels are sentences. Eight of them across a row had to be
 * abbreviated to fit and still wrapped; down a column they read in full, on one
 * line each, in the order they are asked.
 *
 * Every row says three things without a legend. The ring fills once the section is
 * answered, the number takes that section's RAG colour, and the row in play is the
 * only one with a fill behind it. That makes this the dial's information in the
 * form you can actually read, which is why the two sit side by side.
 *
 * A white panel inside the stage's soft slab, so it separates from the dial by
 * fill rather than by yet another outline.
 */
export function StepSwitcher() {
  const { index, goTo, complete, answers } = useScopingSession();

  const done = STEPS.filter((_, at) => complete(at)).length;

  return (
    <div className="rounded-card bg-bg p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-faint uppercase">
          The eight sections
        </p>

        <span className="shrink-0 rounded-pill bg-soft px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.08em] text-brand uppercase tabular-nums">
          {done} / {STEP_COUNT} done
        </span>
      </div>

      <ol className="mt-2.5 flex flex-col">
        {STEPS.map((step, at) => {
          const current = at === index;
          const finished = complete(at);
          const applies = conditionMet(step, answers);
          const summary = sectionSummary(at, answers);
          const rag =
            summary.effort === null ? null : effortRag(summary.effort);

          return (
            <li key={step.key}>
              <button
                type="button"
                onClick={() => goTo(at)}
                aria-current={current ? "step" : undefined}
                className="group/row flex w-full items-center gap-2.5 py-[7px] text-left transition-colors"
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-[18px] shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    finished
                      ? "bg-brand text-white"
                      : current
                        ? "ring-[1.5px] ring-brand ring-inset"
                        : "ring-1 ring-line ring-inset group-hover/row:ring-brand/50",
                  )}
                >
                  {finished ? (
                    <Check className="size-2.5" strokeWidth={3.5} />
                  ) : !applies ? (
                    <Slash className="size-2.5 text-faint" strokeWidth={2.5} />
                  ) : null}
                </span>

                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-[12.5px] transition-colors",
                    current
                      ? "font-bold text-ink"
                      : applies
                        ? "font-medium text-body group-hover/row:text-ink"
                        : "font-medium text-faint line-through decoration-faint/45",
                  )}
                >
                  {step.kicker}
                </span>

                {/* The number carries effort, so a finished section says how heavy
                    it turned out in the same glance that says it is finished. */}
                <span
                  style={rag ? { color: RAG_COLOUR[rag] } : undefined}
                  className={cn(
                    "shrink-0 font-mono text-[9.5px] font-bold tracking-[0.08em] tabular-nums transition-colors duration-500",
                    !rag && "text-faint/70",
                  )}
                >
                  {String(at + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
