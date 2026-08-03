"use client";

import { Check } from "lucide-react";

import { PHASES, STEPS, ASSUMPTIONS } from "@/lib/build/v5";
import type { Answers } from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { Kicker } from "./parts";

/* ---------------------------------------------------------------------------
   The twelve steps, down the side.

   Four states, and the difference between two of them is the whole reason this
   exists. A tick is a claim that a step was answered, so it is only ever given
   to one that was. A step walked past keeps its own state and says, in a word,
   what happened to it: it becomes an assumption. A step with nothing to answer
   has no assumption to make, so arriving at it is the whole of doing it.
--------------------------------------------------------------------------- */

export type SpineState = "here" | "ahead" | "done" | "past";

export function stateOf(at: number, step: number, answers: Answers): SpineState {
  if (at === step) return "here";
  if (at > step) return "ahead";

  const key = STEPS[at].k;
  return answers.touched[key] || !ASSUMPTIONS[key] ? "done" : "past";
}

export function Spine({
  step,
  answers,
  onGo,
}: {
  step: number;
  answers: Answers;
  onGo: (at: number) => void;
}) {
  return (
    <nav aria-label="Steps" className="min-w-0">
      {PHASES.map(([phase, name, note]) => (
        <div key={phase} className="mb-6 last:mb-0">
          <div className="mb-2.5">
            <Kicker className="block">{name}</Kicker>
            <p className="mt-1 text-[13px] leading-[1.45] text-quiet">{note}</p>
          </div>

          <ul className="flex flex-col">
            {STEPS.map((entry, at) =>
              entry.ph !== phase ? null : (
                <li key={entry.k}>
                  <SpineStep
                    at={at}
                    state={stateOf(at, step, answers)}
                    name={entry.n}
                    can={entry.can}
                    onGo={onGo}
                  />
                </li>
              ),
            )}
          </ul>
        </div>
      ))}

      <p className="mt-7 max-w-[34ch] border-t border-hair pt-5 text-[13px] leading-[1.55] text-quiet">
        Nothing here is a percentage. A step you skip is written down as an
        assumption in your own words, not left as a hole.
      </p>
    </nav>
  );
}

function SpineStep({
  at,
  state,
  name,
  can,
  onGo,
}: {
  at: number;
  state: SpineState;
  name: string;
  can: boolean;
  onGo: (at: number) => void;
}) {
  const here = state === "here";

  return (
    <button
      type="button"
      aria-current={here ? "step" : undefined}
      onClick={() => onGo(at)}
      className={cn(
        "flex w-full cursor-pointer items-start gap-3 rounded-card px-3 py-2.5 text-left transition-colors",
        here ? "bg-well" : "hover:bg-well",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-px flex size-[19px] flex-none items-center justify-center rounded-pill transition-colors",
          state === "done"
            ? "bg-ink text-white"
            : here
              ? "bg-ink/15 text-ink"
              : "bg-hair text-planned",
        )}
      >
        <Check className="size-[11px]" strokeWidth={3.2} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[14.5px] leading-[1.3]",
            here || state === "done"
              ? "font-semibold text-ink"
              : "text-quiet",
          )}
        >
          {name}
        </span>

        <span className="mt-0.5 block font-mono text-[9.5px] font-bold tracking-[0.14em] text-label uppercase">
          {state === "past" ? "Assumed" : can ? "Can be skipped" : "Required"}
        </span>
      </span>
    </button>
  );
}

/** Where the run-through has reached, as three phases across the top. */
export function PhaseBar({ step }: { step: number }) {
  const here = STEPS[step].ph;
  const order = PHASES.map(([key]) => key);
  const at = order.indexOf(here);

  return (
    <ol className="mb-8 grid gap-2 sm:grid-cols-3">
      {PHASES.map(([key, name, note], n) => {
        const state = n === at ? "here" : n < at ? "done" : "ahead";

        return (
          <li
            key={key}
            aria-current={state === "here" ? "step" : undefined}
            className={cn(
              "rounded-card px-4 py-3 transition-colors",
              state === "here" ? "bg-ink" : "bg-well",
            )}
          >
            <b
              className={cn(
                "block text-[14.5px] font-bold",
                state === "here" ? "text-white" : "text-ink",
              )}
            >
              {name}
            </b>
            <span
              className={cn(
                "mt-0.5 block text-[12.5px] leading-[1.4]",
                state === "here" ? "text-white/60" : "text-quiet",
              )}
            >
              {note}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
