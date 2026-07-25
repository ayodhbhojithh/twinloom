"use client";

import { useMemo } from "react";

import {
  buildDial,
  DIAL_VIEWBOX,
  effortRag,
  HUB_RADIUS,
  RAG_COLOUR,
  RAG_LABEL,
} from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

/** Radius of the progress arc, just outside the outer ring. */
const ARC_RADIUS = 128;
const ARC_LENGTH = 2 * Math.PI * ARC_RADIUS;

/**
 * The effort dial: three rings, a progress arc and a hub.
 *
 * Inner ring is the eight sections, middle is each question answered inside one,
 * outer is each component chosen inside that question. Colour is effort, grey is
 * unanswered, and the section in play is the only one at full opacity.
 *
 * The arc around the outside is how far through the journey you are. It is the
 * one thing on the dial that only moves forward, which is why it is separate from
 * the rings: those change colour as answers change, the arc only fills.
 *
 * The inner ring is clickable, so the dial navigates as well as reports. Every
 * segment carries a `<title>`, which is what a tooltip and a screen reader read.
 */
export function EffortDial({ className }: { className?: string }) {
  const { answers, index, goTo, percent, overall, complete } =
    useScopingSession();

  const segments = useMemo(
    () => buildDial(answers, index, complete),
    [answers, index, complete],
  );

  const rag = overall === null ? "todo" : effortRag(overall);

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${DIAL_VIEWBOX} ${DIAL_VIEWBOX}`}
        className="block size-full overflow-visible"
        role="img"
        aria-label={`Scoping progress: ${percent} percent complete, overall effort ${RAG_LABEL[rag]}`}
      >
        {segments.map((segment) => {
          const clickable = segment.stepIndex !== undefined;

          return (
            <path
              key={segment.id}
              d={segment.d}
              fill={segment.fill}
              opacity={segment.opacity}
              stroke="var(--color-bg)"
              strokeWidth={segment.strokeWidth}
              onClick={
                clickable ? () => goTo(segment.stepIndex as number) : undefined
              }
              className={cn(
                "transition-[fill,opacity] duration-500 ease-[var(--ease-out-soft)]",
                clickable && "cursor-pointer hover:opacity-100",
              )}
            >
              <title>{segment.title}</title>
            </path>
          );
        })}

        {/* The track, then the fill. Rotated so it starts at twelve o'clock. */}
        <g
          transform={`rotate(-90 ${DIAL_VIEWBOX / 2} ${DIAL_VIEWBOX / 2})`}
          fill="none"
          strokeLinecap="round"
        >
          <circle
            cx={DIAL_VIEWBOX / 2}
            cy={DIAL_VIEWBOX / 2}
            r={ARC_RADIUS}
            stroke="var(--color-line)"
            strokeWidth={3}
          />
          <circle
            cx={DIAL_VIEWBOX / 2}
            cy={DIAL_VIEWBOX / 2}
            r={ARC_RADIUS}
            stroke="var(--color-brand)"
            strokeWidth={3}
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={ARC_LENGTH * (1 - percent / 100)}
            className="transition-[stroke-dashoffset] duration-700 ease-[var(--ease-out-soft)]"
          />
        </g>

        <circle
          cx={DIAL_VIEWBOX / 2}
          cy={DIAL_VIEWBOX / 2}
          r={HUB_RADIUS}
          fill="var(--color-bg)"
        />
      </svg>

      {/* The hub sits over the SVG as real text, so it inherits the type scale
          rather than being sized in user units. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-[8.5px] font-bold tracking-[0.16em] text-faint uppercase">
          Complete
        </span>

        <span className="text-[24px] leading-none font-extrabold tabular-nums">
          {percent}%
        </span>

        <span
          className="mt-1 font-mono text-[8.5px] font-bold tracking-[0.1em] uppercase transition-colors duration-500"
          style={{ color: RAG_COLOUR[rag] }}
        >
          {overall === null ? "Effort not set" : RAG_LABEL[rag]}
        </span>
      </div>
    </div>
  );
}
