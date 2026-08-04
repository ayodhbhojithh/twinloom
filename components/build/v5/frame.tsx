"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { STEPS } from "@/lib/build/v5";
import { pagesFrom } from "@/lib/build/v5-derive";
import { type Answers } from "@/lib/build/v5-store";

import { Disc, Plate, Stage } from "./stage";

/* ---------------------------------------------------------------------------
   A step, on the working surface.

   The same arrangement as the landing card: the way between steps stands in
   the notch, what the answers add up to stands in the bite, and the way on is
   a disc in the corner cut. The question has the surface to itself.

   No standfirst, no body copy, no note under the note. A step asks one thing
   and its answers say what they mean, which is the difference between a tool
   and a page about a tool.
--------------------------------------------------------------------------- */

export function StageStep({
  at,
  answers,
  onGo,
  corner,
  scrollKey,
  children,
}: {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
  /** Replaces the default way-on disc, for the step that ends the run. */
  corner?: React.ReactNode;
  /** What the surface is showing, when a step can show more than its own
   *  question: the card that is open, so opening one scrolls to its top. */
  scrollKey?: string;
  children: React.ReactNode;
}) {
  const step = STEPS[at];
  const first = at === 0;
  const last = at === STEPS.length - 1;
  const pages = pagesFrom(answers).length;

  return (
    <Stage
      scrollKey={`${step.k}:${scrollKey ?? ""}`}
      className="min-h-[540px] w-full"
      toolbar={
        <Plate>
          <Disc label="Previous step" onClick={() => onGo(at - 1)} disabled={first}>
            <ArrowLeft className="size-4" />
          </Disc>

          {/* One line, not two. The count and the name are one label - stacked
              they made the plate a block of text with arrows either side, and
              a bar this small has the width to say it in a row. */}
          <span className="flex min-w-0 flex-1 items-baseline justify-center gap-2.5 px-2">
            <span className="flex-none font-mono text-[9.5px] font-bold tracking-[0.12em] text-label tabular-nums">
              {String(at + 1).padStart(2, "0")}/{STEPS.length}
            </span>
            <span className="truncate text-[13.5px] leading-none font-bold text-ink">
              {step.n}
            </span>
            {step.can ? null : (
              <span className="flex-none font-mono text-[8.5px] font-bold tracking-[0.14em] text-mark uppercase">
                Required
              </span>
            )}
          </span>

          <Disc label="Next step" onClick={() => onGo(at + 1)} disabled={last}>
            <ArrowRight className="size-4" />
          </Disc>
        </Plate>
      }
      aside={
        /* What the answers add up to, standing where the next project stands
           on the landing card. One number: the panel carries the list, and
           this only has to say the list is growing. */
        <div className="flex size-full flex-col justify-center rounded-[18px] border border-border bg-field px-3.5">
          <b className="font-mono text-[24px] leading-none font-bold text-ink tabular-nums">
            {pages}
          </b>
          <span className="mt-1.5 font-mono text-[8.5px] font-bold tracking-[0.1em] text-label uppercase">
            Pages so far
          </span>
        </div>
      }
      corner={
        corner !== undefined ? (
          corner
        ) : !last ? (
          <Disc label="Next step" tone="ink" onClick={() => onGo(at + 1)}>
            <ArrowRight className="size-[18px]" strokeWidth={2.2} />
          </Disc>
        ) : null
      }
    >
      {children}
    </Stage>
  );
}
