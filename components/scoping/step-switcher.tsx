"use client";

import { Check, SlashIcon } from "lucide-react";

import {
  conditionMet,
  effortRag,
  RAG_COLOUR,
  sectionSummary,
  STEPS,
} from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

/**
 * The eight sections, as eight boxes you can pick from.
 *
 * None of the eight are gated, so this is a switcher rather than a progress bar:
 * you can answer them in any order and come back. Laid out as one row of eight on
 * a wide screen, it also does the job the old sidebar list did, in a third of the
 * vertical space and without a second column to find it in.
 *
 * Each box carries its own state. An effort dot in its RAG colour if it has been
 * answered, a tick if it is complete, and a struck-through label if a condition
 * means it does not apply. That makes this the same information as the dial, in
 * the form you can actually read.
 */
export function StepSwitcher() {
  const { index, goTo, complete, answers } = useScopingSession();

  return (
    <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-8">
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
                "flex h-full w-full flex-col gap-1.5 rounded-tile px-2.5 py-2 text-left transition-colors",
                current
                  ? "bg-soft ring-1 ring-brand/30 ring-inset"
                  : "bg-panel-bg hover:bg-soft/70",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "font-mono text-[9.5px] font-bold tracking-[0.08em] tabular-nums",
                    current ? "text-brand" : "text-faint",
                  )}
                >
                  {String(at + 1).padStart(2, "0")}
                </span>

                {done ? (
                  <Check
                    aria-hidden
                    className="size-2.5 text-brand"
                    strokeWidth={3.5}
                  />
                ) : !applies ? (
                  <SlashIcon
                    aria-hidden
                    className="size-2.5 text-faint"
                    strokeWidth={2.5}
                  />
                ) : null}

                {summary.effort !== null ? (
                  <span
                    aria-hidden
                    className="ml-auto size-1.5 shrink-0 rounded-full transition-colors duration-500"
                    style={{ background: RAG_COLOUR[rag] }}
                  />
                ) : null}
              </span>

              <span
                className={cn(
                  "text-[11.5px] leading-[1.3] font-semibold",
                  current
                    ? "text-ink"
                    : applies
                      ? "text-body"
                      : "text-faint line-through decoration-faint/50",
                )}
              >
                {step.kicker}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
