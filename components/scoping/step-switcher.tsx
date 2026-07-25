"use client";

import { Check, Slash } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
 * The bar above each section: brand for the one in play, its RAG colour once it
 * has an answer in it, a light brand for visited, a hairline for untouched.
 *
 * Effort rides on the same element as position rather than getting a dot of its
 * own. One bar, one glance, and the eight of them read as a single track.
 */
function railTone({
  current,
  rag,
  done,
}: {
  current: boolean;
  rag: string | null;
  done: boolean;
}) {
  /* The halo is a shadow rather than extra height, so the one in play stands off
     the track without knocking the other seven out of line. */
  if (current) return "bg-brand shadow-[0_0_0_3px_var(--color-soft)]";
  if (rag) return undefined;
  if (done) return "bg-brand/35";
  return "bg-line group-hover:bg-faint/45";
}

/**
 * The eight sections, as one segmented track.
 *
 * Boxes were the wrong answer and so were circles. Boxes said nothing about order
 * and added eight outlines to a page that had just had them taken away; a row of
 * numbered circles said "generic stepper" and needed a halo and a tick fighting
 * for the same 26 pixels.
 *
 * A segment per section says all of it at once. The eight bars are one track, so
 * order and progress are structural rather than decorated. The number and label
 * hang below in the site's own mono and weight, which is the same treatment the
 * process ledger and the nav counts use.
 *
 * Nothing is gated, so every segment is a button. The full section name is in a
 * tooltip rather than the browser's native one, which is where the rest of the
 * site puts it.
 */
export function StepSwitcher() {
  const { index, goTo, complete, answers } = useScopingSession();

  return (
    <div>
      <p className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-faint uppercase tabular-nums">
        The eight sections
        <span className="ml-1.5 font-medium normal-case">
          &middot; jump anywhere, nothing is locked
        </span>
      </p>

      {/* Scrolls on a phone rather than wrapping. A track that wraps to two rows
          has to break itself in half, and a broken track stops reading as one. */}
      <div className="panel-scroll -mx-5 mt-2.5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ol className="grid min-w-[620px] grid-cols-8 gap-2 sm:min-w-0 sm:gap-2.5">
          {STEPS.map((step, at) => {
            const current = at === index;
            const done = complete(at);
            const applies = conditionMet(step, answers);
            const summary = sectionSummary(at, answers);
            const rag =
              summary.effort === null ? null : effortRag(summary.effort);
            const tone = railTone({ current, rag, done });

            return (
              <li key={step.key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => goTo(at)}
                      aria-label={`Section ${at + 1}, ${step.kicker}`}
                      aria-current={current ? "step" : undefined}
                      className="group flex w-full flex-col text-left"
                    >
                      <span
                        aria-hidden
                        style={
                          rag && !current
                            ? { background: RAG_COLOUR[rag] }
                            : undefined
                        }
                        className={cn(
                          "h-[3px] w-full rounded-pill transition-colors duration-500",
                          tone,
                        )}
                      />

                      <span
                        className={cn(
                          "mt-2.5 flex items-center gap-1 font-mono text-[9.5px] font-bold tracking-[0.1em] tabular-nums transition-colors",
                          current ? "text-brand" : "text-faint",
                        )}
                      >
                        {String(at + 1).padStart(2, "0")}

                        {done ? (
                          <Check
                            aria-hidden
                            className="size-2.5 text-brand"
                            strokeWidth={3.5}
                          />
                        ) : !applies ? (
                          <Slash
                            aria-hidden
                            className="size-2.5"
                            strokeWidth={2.5}
                          />
                        ) : null}
                      </span>

                      {/* Two lines of room reserved for every label, so a long
                          one cannot shunt the row out of alignment. */}
                      <span
                        className={cn(
                          "mt-1 min-h-[28px] text-[11.5px] leading-[1.25] font-semibold transition-colors",
                          current
                            ? "text-ink"
                            : applies
                              ? "text-body/85 group-hover:text-ink"
                              : "text-faint line-through decoration-faint/40",
                        )}
                      >
                        {step.short}
                      </span>
                    </button>
                  </TooltipTrigger>

                  <TooltipContent side="bottom" sideOffset={6}>
                    {at + 1} of {STEP_COUNT} · {step.kicker}
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
