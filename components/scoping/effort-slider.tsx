"use client";

import { TickSlider } from "@/components/shared";
import {
  EFFORT_MAX,
  EFFORT_MIN,
  effortRag,
  RAG_COLOUR,
  RAG_LABEL,
} from "@/lib/scoping";

import { useScopingSession } from "./scoping-context";

/**
 * The 0 to 10 effort control as a line: 6a's stop slider, with the number and the
 * band spelled out above it.
 *
 * This is the one-thing-at-a-time version. When a single option is focused there is
 * a full column to spend, so the control can be wide enough to show its whole range
 * at once, name the band in words, and label both ends. Five of these stacked in a
 * narrow column is what the knob cards are for; one of them, given room, reads
 * better than any knob.
 *
 * The track fills in the effort's own RAG colour, so the number, the label, the
 * fill and the matching segment on the dial all say the same thing at once.
 */
export function EffortSlider({
  effortKey,
  value,
  explain,
  label,
}: {
  effortKey: string;
  value: number;
  explain: string;
  label: string;
}) {
  const { setEffort } = useScopingSession();

  const rag = effortRag(value);
  const off = value === EFFORT_MIN;
  const colour = off ? "#b4bbc6" : RAG_COLOUR[rag];

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-faint uppercase">
          Effort
        </span>

        <span
          className="rounded-nav px-1.5 py-0.5 font-mono text-[10px] font-extrabold whitespace-nowrap text-white tabular-nums transition-colors duration-300"
          style={{ background: colour }}
        >
          {value} / {EFFORT_MAX}
        </span>

        <span
          className="font-mono text-[10px] font-bold tracking-[0.08em] uppercase transition-colors duration-300"
          style={{ color: colour }}
        >
          {off ? "Not required" : RAG_LABEL[rag]}
        </span>
      </div>

      <p className="mt-2 text-[12.5px] leading-[1.55] text-body">{explain}</p>

      <div className="mt-3.5">
        <TickSlider
          min={EFFORT_MIN}
          max={EFFORT_MAX}
          value={value}
          colour={colour}
          label={`Effort for ${label}`}
          onChange={(next) => setEffort(effortKey, next)}
        />
      </div>

      <div className="mt-1.5 flex justify-between font-mono text-[10px] tracking-[0.06em] text-faint uppercase">
        <span>Light</span>
        <span>Heavy</span>
      </div>
    </div>
  );
}
