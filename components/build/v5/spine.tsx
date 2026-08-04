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
      {/* A ring that fills, not a disc that changes colour. Empty means the
          step has not been answered, and an empty ring says that on its own;
          a grey disc with a grey tick in it reads as a tick either way, which
          is the one thing this mark must never do. */}
      <span
        aria-hidden
        className={cn(
          "mt-px flex size-[19px] flex-none items-center justify-center rounded-pill border transition-colors",
          state === "done"
            ? "border-done bg-done text-white"
            : here
              ? "border-ink text-transparent"
              : "border-border text-transparent",
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

        <span
          className={cn(
            "mt-0.5 block font-mono text-[9.5px] font-bold tracking-[0.14em] uppercase",
            state === "done" ? "text-done" : "text-label",
          )}
        >
          {state === "past" ? "Assumed" : can ? "Can be skipped" : "Required"}
        </span>
      </span>
    </button>
  );
}

/**
 * Where the run-through has reached: one thread, three knots.
 *
 * The company is named for a loom, so the measure across the top of its own
 * run-through is a thread rather than a progress bar. One line runs the width
 * of the screen and each phase is a knot on it: the thread behind you is drawn,
 * the thread in front is not yet woven, and the knot you are standing on is the
 * only filled one.
 *
 * Three separate boxes made this a second set of controls above the real ones,
 * and three separate rules made three unrelated things. A continuous line says
 * the plain fact those missed, which is that this is one run and you are part
 * of the way along it.
 *
 * Each knot carries how many steps are in its phase, because "as much or as
 * little as you like" means very different things over two steps and over
 * seven, and that is worth knowing before you start rather than after.
 */
export function PhaseBar({ step }: { step: number }) {
  const here = STEPS[step].ph;
  const order = PHASES.map(([key]) => key);
  const at = order.indexOf(here);

  return (
    <ol className="mb-9 grid grid-cols-3 gap-x-3">
      {PHASES.map(([key, name, note], n) => {
        const state = n === at ? "here" : n < at ? "done" : "ahead";
        const steps = STEPS.filter((entry) => entry.ph === key).length;
        const last = n === PHASES.length - 1;

        return (
          <li key={key} aria-current={state === "here" ? "step" : undefined}>
            <span aria-hidden className="flex items-center">
              {/* The knot. Filled where you are, drawn where you have been,
                  open where you have not. */}
              <span
                className={cn(
                  "size-[11px] flex-none rounded-pill border-2 transition-colors",
                  state === "here"
                    ? "border-ink bg-ink"
                    : state === "done"
                      ? "border-done bg-done"
                      : "border-planned bg-field",
                )}
              />

              {/* The thread on to the next knot. It stops at the last one:
                  there is nothing after Sending it, and a line running off the
                  end would promise there was. */}
              {!last ? (
                <span
                  className={cn(
                    "ml-1.5 h-[2px] flex-1 rounded-pill transition-colors",
                    state === "done" ? "bg-done" : "bg-hair",
                  )}
                />
              ) : null}
            </span>

            <span className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <b
                className={cn(
                  "text-[14.5px] leading-[1.2] font-bold",
                  state === "ahead" ? "text-quiet" : "text-ink",
                )}
              >
                {name}
              </b>
              <span className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-idx uppercase tabular-nums">
                {steps} steps
              </span>
            </span>

            <span className="mt-1 block text-[12.5px] leading-[1.45] text-quiet">
              {note}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
