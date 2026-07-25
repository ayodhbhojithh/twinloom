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

/**
 * The effort dial: three rings and a hub.
 *
 * Inner ring is the eight sections, middle is each question answered inside one,
 * outer is each component chosen inside that question. Colour is effort, grey is
 * unanswered, and the section in play is the only one at full opacity.
 *
 * Progress lives in the hub and along the top of the action bar, not as a ring
 * around the outside: the dial is already carrying effort in three colours, and a
 * fourth accent on top of it competes with the thing it is meant to frame.
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
        className="block size-full"
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
        <span className="font-mono text-[8px] font-bold tracking-[0.16em] text-faint uppercase sm:text-[9.5px]">
          Complete
        </span>

        <span className="text-[22px] leading-none font-extrabold tabular-nums sm:text-[30px] xl:text-[34px]">
          {percent}%
        </span>

        <span
          className="mt-1 font-mono text-[8px] font-bold tracking-[0.1em] uppercase transition-colors duration-500 sm:text-[9.5px]"
          style={{ color: RAG_COLOUR[rag] }}
        >
          {overall === null ? "Effort not set" : RAG_LABEL[rag]}
        </span>
      </div>
    </div>
  );
}
