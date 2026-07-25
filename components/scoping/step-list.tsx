"use client";

import { Check, SlashIcon } from "lucide-react";

import { conditionMet, effortRag, RAG_COLOUR, sectionSummary, STEPS } from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

/**
 * Every section, jumpable, with its state on it.
 *
 * None of the eight are gated, so hiding the map would only make the journey feel
 * longer than it is. Each row carries an effort dot in its own colour, which makes
 * this the same information as the dial in a form you can actually read.
 *
 * A conditional section that does not apply is struck through rather than hidden:
 * knowing selling questions exist, and that they were skipped for a reason, beats
 * a step number that silently jumps.
 */
export function StepList() {
  const { index, goTo, complete, answers } = useScopingSession();

  return (
    <ol className="flex flex-col gap-0.5">
      {STEPS.map((step, at) => {
        const current = at === index;
        const done = complete(at);
        const applies = conditionMet(step, answers);
        const summary = sectionSummary(at, answers);
        const rag = summary.effort === null ? "todo" : effortRag(summary.effort);

        return (
          <li key={step.key}>
            <button
              type="button"
              onClick={() => goTo(at)}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-nav px-2 py-1.5 text-left transition-colors",
                current ? "bg-soft" : "hover:bg-soft/60",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-[19px] shrink-0 items-center justify-center rounded-full border font-mono text-[9.5px] font-bold tabular-nums transition-colors",
                  current
                    ? "border-brand bg-brand text-white"
                    : done
                      ? "border-brand/40 bg-card text-brand"
                      : "border-line bg-card text-faint",
                )}
              >
                {done && !current ? (
                  <Check className="size-2.5" strokeWidth={3.5} />
                ) : !applies ? (
                  <SlashIcon className="size-2.5" strokeWidth={2.5} />
                ) : (
                  at + 1
                )}
              </span>

              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[12.5px]",
                  current
                    ? "font-bold text-ink"
                    : applies
                      ? "font-medium text-body"
                      : "font-medium text-faint line-through decoration-faint/50",
                )}
              >
                {step.kicker}
              </span>

              {summary.effort !== null ? (
                <span
                  aria-hidden
                  className="size-1.5 shrink-0 rounded-full transition-colors duration-500"
                  style={{ background: RAG_COLOUR[rag] }}
                />
              ) : null}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
