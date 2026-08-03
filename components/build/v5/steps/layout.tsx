"use client";

import { WIRES, type Wire } from "@/lib/build/v5-wires";
import { isOn, setPick, touchStep, type Answers } from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { LayerMark, Under } from "../parts";
import { Lead, Say, StepFrame } from "../step-frame";

/**
 * Step two: six shapes, pick one.
 *
 * One answer, not a set, so choosing clears the others rather than adding to
 * them. A shape is a starting point for the first drawing and picking a second
 * one would be describing two sites.
 */
export function StepLayout({
  at,
  answers,
  onGo,
}: {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
}) {
  return (
    <StepFrame
      at={at}
      onGo={onGo}
      needs="Nothing."
      showBack="The shape you picked, drawn as the first page we send you."
    >
      <Lead>Click through six wireframes and pick one, or skip it.</Lead>

      <LayerMark>Layer one</LayerMark>

      <Say>
        Six shapes. Click the one that looks closest to the site in your head. It
        is a starting point for the first drawing, not a decision, and it can be
        changed at any point without anything else moving.
      </Say>

      <div className="mt-6 grid max-w-wide gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {WIRES.map((wire) => (
          <WireCard
            key={wire.k}
            wire={wire}
            on={isOn(answers, "layout", wire.k)}
            onPick={() => {
              setPick("layout", wire.k, true, true);
              touchStep("layout");
            }}
          />
        ))}
      </div>

      <Under>
        Nothing else moves when you change this. The shape decides what the first
        drawing looks like, and every other answer you give is about what goes in
        it.
      </Under>
    </StepFrame>
  );
}

function WireCard({
  wire,
  on,
  onPick,
}: {
  wire: Wire;
  on: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onPick}
      className={cn(
        "group/wire flex cursor-pointer flex-col rounded-card p-4 text-left transition-colors",
        on ? "bg-ink" : "bg-well hover:bg-hair",
      )}
    >
      {/* The drawing, from numbers. The header band and the hero are firmer
          than the blocks under them, which is the whole of what makes six
          rectangles read as a page rather than as a bar chart. */}
      <span
        className={cn(
          "mb-3.5 block overflow-hidden rounded-[10px] p-2 transition-colors",
          on ? "bg-white/10" : "bg-field",
        )}
      >
        <svg viewBox="0 0 160 108" aria-hidden className="block w-full">
          {wire.bars.map((bar, n) => (
            <rect
              key={n}
              x={bar.x}
              y={bar.y}
              width={bar.w}
              height={bar.h}
              rx={2}
              fill="currentColor"
              className={cn(
                on ? "text-white" : "text-ink",
                bar.kind === "h"
                  ? "opacity-70"
                  : bar.kind === "b"
                    ? "opacity-40"
                    : "opacity-15",
              )}
            />
          ))}
        </svg>
      </span>

      <b
        className={cn(
          "text-[15.5px] leading-[1.25] font-bold",
          on ? "text-white" : "text-ink",
        )}
      >
        {wire.n}
      </b>

      <span
        className={cn(
          "mt-1.5 block text-[13.5px] leading-[1.45]",
          on ? "text-white/70" : "text-quiet",
        )}
      >
        {wire.d}
      </span>

      <span
        className={cn(
          "mt-2.5 block font-mono text-[10px] font-semibold tracking-[0.1em] uppercase",
          on ? "text-white/55" : "text-idx",
        )}
      >
        {wire.w}
      </span>
    </button>
  );
}
