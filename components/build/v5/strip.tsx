"use client";

import { useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { PHASES, STEPS } from "@/lib/build/v5";
import { type Answers } from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { stateOf, stepStatus } from "./kit";
import { Disc } from "./stage";

/* ---------------------------------------------------------------------------
   The twelve steps, as cut cards on a rail.

   The switcher: what you press here decides what the surface below shows, so
   nothing is reached by scrolling past something else.

   Each card is cut the way everything else on this site is cut - a corner
   taken out for the mark that stands in it, drawn with the landing card's own
   outline rather than a rounded rectangle with a badge dropped on top. The
   mark is the only thing that changes: the step's number while it waits, a
   tick once it has been answered.

   The size is fixed rather than measured. Twelve cards of one size need one
   path worked out once, instead of twelve elements each watching themselves
   for a resize that is never coming.
--------------------------------------------------------------------------- */

const CARD = { w: 232, h: 138, cut: 56, mark: 42, radius: 18, flare: 18 };

/**
 * The card's outline: a rounded rectangle with its bottom right corner given
 * up for the mark that stands in it.
 *
 * Written out rather than mirrored. The landing card's `outline` carries a
 * notch and a bite this card has no use for, and flipping its path to move the
 * cut carried a squared off corner along with it - which is what put a hard
 * angle at the top right.
 *
 * The rule is the same one, and that is what matters: one flare and one
 * radius. A flare is where the cut meets an edge and curves outward, so its
 * centre sits in the card and it takes sweep 1. The cut's own inner corner
 * curves the other way and takes sweep 0. Getting those backwards does not
 * produce a subtle error - it bites a quarter disc out beside the cut.
 */
function cardPath(w: number, h: number, c: number, r: number, f: number) {
  return [
    `M ${r} 0`,
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - c - f}`,
    `A ${f} ${f} 0 0 1 ${w - f} ${h - c}`,
    `L ${w - c + r} ${h - c}`,
    `A ${r} ${r} 0 0 0 ${w - c} ${h - c + r}`,
    `L ${w - c} ${h - f}`,
    `A ${f} ${f} 0 0 1 ${w - c - f} ${h}`,
    `L ${r} ${h}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    "Z",
  ].join(" ");
}

const CARD_PATH = cardPath(
  CARD.w,
  CARD.h,
  CARD.cut,
  CARD.radius,
  CARD.flare,
);

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
  const clip = useMemo(() => `path("${CARD_PATH}")`, []);

  const nudge = (by: number) =>
    rail.current?.scrollBy({ left: by, behavior: "smooth" });

  const zoneOf = (phase: string) =>
    PHASES.find(([key]) => key === phase)?.[1] ?? "";

  return (
    <section aria-label="Steps" className="mb-7">
      <div className="mb-3 flex items-center justify-between gap-4">
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
          const done = state === "done";
          const status = stepStatus(entry.k, answers);

          return (
            <div
              key={entry.k}
              className="group/step relative flex-none snap-start transition-transform hover:-translate-y-0.5"
              style={{ width: CARD.w, height: CARD.h }}
            >
              {/* The ground, cut. It carries nothing, so clipping it costs
                  nothing and the words above it stay whole. */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 transition-colors",
                  on ? "bg-ink" : "bg-canvas group-hover/step:bg-canvas-firm",
                )}
                style={{ clipPath: clip }}
              />

              <button
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onGo(n)}
                className="relative flex size-full cursor-pointer flex-col px-4 pt-3.5 pb-4 text-left"
              >
                <span
                  className={cn(
                    "font-mono text-[8.5px] font-bold tracking-[0.14em] uppercase",
                    on ? "text-white/45" : "text-idx",
                  )}
                >
                  {entry.can ? zoneOf(entry.ph) : "Required"}
                </span>

                <b
                  className={cn(
                    "mt-2 block text-[15px] leading-[1.18] font-bold tracking-[-0.02em]",
                    on ? "text-white" : "text-ink",
                  )}
                >
                  {entry.n}
                </b>

                <span
                  className={cn(
                    "mt-auto block max-w-[16ch] truncate text-[11.5px] font-semibold",
                    on ? "text-white/65" : done ? "text-mark" : "text-quiet",
                  )}
                >
                  {state === "past" ? "Assumed for you" : status.line}
                </span>

                {/* How much of the step has had an answer, as its share rather
                    than a number. An empty bar is a finished step if that is
                    what you meant by it. */}
                {status.total > 0 ? (
                  <span
                    aria-hidden
                    className={cn(
                      "mt-2 block h-[3px] w-[58%] overflow-hidden rounded-pill",
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
                ) : (
                  <span aria-hidden className="mt-2 block h-[3px]" />
                )}
              </button>

              {/* The mark, standing in the corner the card gives up for it. */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-0 bottom-0 flex items-center justify-center"
                style={{ width: CARD.cut, height: CARD.cut }}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-pill font-mono text-[11.5px] font-bold tabular-nums transition-colors",
                    done
                      ? "bg-mark text-white"
                      : on
                        ? "bg-ink text-white"
                        : "bg-field text-quiet",
                  )}
                  style={{ width: CARD.mark, height: CARD.mark }}
                >
                  {done ? (
                    <Check className="size-[17px]" strokeWidth={3} />
                  ) : (
                    String(n + 1).padStart(2, "0")
                  )}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
