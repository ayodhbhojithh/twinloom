"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { PHASES, STEPS } from "@/lib/build/v5";
import { type Answers } from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { stateOf, stepStatus } from "./kit";
import { Disc } from "./stage";

/* ---------------------------------------------------------------------------
   The twelve steps, as cards on a rail.

   The switcher: what you press here decides what the surface below shows, so
   nothing is reached by scrolling past something else.

   Cards rather than chips, because a chip can only carry a name and the useful
   thing about a step is its state - what it asks, whether you have answered
   any of it, and that you are allowed to leave it alone. Each card says all
   three, which turns the rail from a set of tabs into a map of the work.

   It scrolls, snaps and takes the arrow keys. Twelve cards will not fit any
   window and squeezing them into one would cost every card the words that
   make it worth being a card.
--------------------------------------------------------------------------- */

export function StepStrip({
  step,
  answers,
  onGo,
}: {
  step: number;
  answers: Answers;
  onGo: (at: number) => void;
}) {
  const rail = useRef<HTMLDivElement>(null);

  const nudge = (by: number) =>
    rail.current?.scrollBy({ left: by, behavior: "smooth" });

  const zoneOf = (phase: string) =>
    PHASES.find(([key]) => key === phase)?.[1] ?? "";

  return (
    <section aria-label="Steps" className="mb-6">
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <p className="font-mono text-[9.5px] font-bold tracking-[0.16em] text-label uppercase">
          {STEPS.length} steps · leave any of them alone · scroll, drag or use
          the arrows
        </p>

        <div className="flex flex-none items-center gap-0.5">
          <Disc label="Scroll left" onClick={() => nudge(-340)}>
            <ArrowLeft className="size-4" />
          </Disc>
          <Disc label="Scroll right" onClick={() => nudge(340)}>
            <ArrowRight className="size-4" />
          </Disc>
        </div>
      </div>

      <div
        ref={rail}
        role="tablist"
        aria-label="Steps"
        className="quiet-scroll -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pt-2 pb-3"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") onGo(step + 1);
          if (event.key === "ArrowLeft") onGo(step - 1);
        }}
      >
        {STEPS.map((entry, n) => {
          const state = stateOf(n, step, answers);
          const on = state === "here";
          const status = stepStatus(entry.k, answers);

          return (
            <button
              key={entry.k}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onGo(n)}
              className={cn(
                "group/step flex w-[236px] flex-none snap-start cursor-pointer flex-col rounded-[20px] p-4 text-left transition-all",
                on
                  ? "-translate-y-0.5 bg-ink text-white"
                  : "bg-canvas hover:-translate-y-0.5 hover:bg-canvas-firm",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold tabular-nums",
                    on ? "text-white/50" : "text-idx",
                  )}
                >
                  {String(n + 1).padStart(2, "0")}
                </span>

                <span
                  className={cn(
                    "font-mono text-[8.5px] font-bold tracking-[0.14em] uppercase",
                    on ? "text-white/45" : "text-idx",
                  )}
                >
                  {entry.can ? zoneOf(entry.ph) : "Required"}
                </span>
              </span>

              <b
                className={cn(
                  "mt-3 block text-[15px] leading-[1.2] font-bold tracking-[-0.02em]",
                  on ? "text-white" : "text-ink",
                )}
              >
                {entry.n}
              </b>

              <span
                className={cn(
                  "mt-auto flex items-center gap-2 pt-4 text-[12px] font-semibold",
                  on
                    ? "text-white/70"
                    : state === "done"
                      ? "text-mark"
                      : "text-quiet",
                )}
              >
                {state === "done" ? (
                  <Check aria-hidden className="size-3.5 flex-none" strokeWidth={3} />
                ) : null}
                {state === "past" ? "Assumed - written down for you" : status.line}
              </span>

              {/* How much of this step has had an answer, drawn as the share of
                  it rather than as a number. Nothing here is a score: an empty
                  bar is a finished step if that is what you meant. */}
              {status.total > 0 ? (
                <span
                  aria-hidden
                  className={cn(
                    "mt-2 block h-[3px] w-full overflow-hidden rounded-pill",
                    on ? "bg-white/15" : "bg-planned",
                  )}
                >
                  <span
                    className={cn(
                      "block h-full rounded-pill transition-[width] duration-300",
                      on ? "bg-white/70" : "bg-mark",
                    )}
                    style={{
                      width: `${Math.min(100, Math.round((status.done / status.total) * 100))}%`,
                    }}
                  />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
