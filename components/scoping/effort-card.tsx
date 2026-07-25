"use client";

import { effortRag, RAG_COLOUR, RAG_LABEL } from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { EffortKnob } from "./effort-knob";

/**
 * One area, one knob: the dial card from turn 5a.
 *
 * Name on top, the knob under it, then the level as a tinted chip and what that
 * level actually buys in plain words. The chip and the ring share a colour, so the
 * card says the same thing three ways without repeating a number.
 *
 * This replaced a labelled slider with a pill reading "0 / 10". In a narrow column
 * that pill wrapped onto two lines and the empty track read as broken rather than
 * as zero. A knob has no long side to squeeze.
 */
export function EffortCard({
  effortKey,
  value,
  explain,
  label,
  showLabel = true,
  className,
}: {
  effortKey: string;
  value: number;
  explain: string;
  label: string;
  /** Off when the panel around it has already named the thing. */
  showLabel?: boolean;
  className?: string;
}) {
  const rag = effortRag(value);
  const colour = RAG_COLOUR[rag];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-card-sm bg-white px-3 py-4 text-center",
        className,
      )}
    >
      {showLabel ? (
        <h4 className="text-[12.5px] leading-[1.2] font-extrabold">{label}</h4>
      ) : null}

      <EffortKnob effortKey={effortKey} value={value} label={label} />

      <span
        style={{
          color: colour,
          background: `color-mix(in oklab, ${colour} 8%, white)`,
          borderColor: `color-mix(in oklab, ${colour} 20%, transparent)`,
        }}
        className="rounded-pill border px-2.5 py-[3px] font-mono text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors duration-300"
      >
        {RAG_LABEL[rag]}
      </span>

      <p className="text-[11px] leading-[1.45] text-body">{explain}</p>
    </div>
  );
}
