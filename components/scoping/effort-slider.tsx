"use client";

import {
  EFFORT_MAX,
  EFFORT_MIN,
  effortRag,
  RAG_COLOUR,
  RAG_LABEL,
} from "@/lib/scoping";

import { TickSlider } from "@/components/shared";

import { useScopingSession } from "./scoping-context";

/**
 * The 0 to 10 effort control.
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
  const colour = RAG_COLOUR[rag];

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-faint uppercase">
          Effort
        </span>
        <span
          className="rounded-nav px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-white tabular-nums"
          style={{ background: colour }}
        >
          {value} / {EFFORT_MAX}
        </span>
        <span
          className="font-mono text-[10px] font-bold tracking-[0.08em] uppercase"
          style={{ color: colour }}
        >
          {RAG_LABEL[rag]}
        </span>
      </div>

      <p className="mt-2 text-[12.5px] leading-[1.55] text-body">{explain}</p>

      <div className="mt-3">
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
