"use client";

import { EFFORT_MIN, effortRag, RAG_COLOUR, RAG_LABEL } from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { EffortKnob } from "./effort-knob";

/**
 * One area, one knob: the dial card from turn 5a.
 *
 * Name on top, the knob under it, then the level as a tinted chip and what that
 * level actually buys in plain words. The chip and the ring share a colour, so the
 * card says the same thing three ways without repeating a number.
 *
 * The knob earns its place by count, not by preference. Five labelled sliders in a
 * 400px column left the "0 / 10" pill wrapping onto two lines and the empty track
 * reading as broken rather than as off. A knob is square and has no long side to
 * squeeze, so five of them fit where five sliders could not. A single focused
 * option still gets the slider, in [effort-slider.tsx]: given room, a line shows
 * its whole range at once and a knob cannot.
 */
export function EffortCard({
  effortKey,
  value,
  explain,
  label,
  className,
}: {
  effortKey: string;
  value: number;
  explain: string;
  label: string;
  className?: string;
}) {
  const rag = effortRag(value);
  const off = value === EFFORT_MIN;
  const colour = off ? "#b4bbc6" : RAG_COLOUR[rag];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-card-sm bg-white px-3 py-4 text-center",
        className,
      )}
    >
      <h4 className="text-[12.5px] leading-[1.2] font-extrabold">{label}</h4>

      <EffortKnob effortKey={effortKey} value={value} label={label} />

      <span
        style={{
          color: colour,
          background: `color-mix(in oklab, ${colour} 8%, white)`,
          borderColor: `color-mix(in oklab, ${colour} 20%, transparent)`,
        }}
        className="rounded-pill border px-2.5 py-[3px] font-mono text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors duration-300"
      >
        {off ? "Not required" : RAG_LABEL[rag]}
      </span>

      <p className="text-[11px] leading-[1.45] text-body">{explain}</p>
    </div>
  );
}
