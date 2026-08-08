"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

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
      /* The bar lifts out of the notch and holds under the header once this
         surface scrolls past it. A step can be three screens long and the bar is
         the only thing on the card that says which of the ten it is, and the
         only way to leave for another. */
      stickyBar
      /* A floor the cuts need, sized to the screen. 540 is most of a phone
         before anything has been asked, which put the first question below the
         fold on the page the whole site points at. */
      className="min-h-[420px] w-full sm:min-h-[540px]"
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
           this only has to say the list is growing.

           No box round it. The cut is already the outline - a second one drawn
           a few pixels inside reads as a sticker on the card rather than as
           the thing the card was cut back for, which is the rule the landing
           card's own thumbnail follows.

           Centred in the cut, both ways. Set to the corner, the number and its
           label were two left edges inside a square with nothing else in it,
           which reads as a thing that slipped rather than a thing that was
           placed. */
        <div className="flex size-full flex-col items-center justify-center">
          <b className="font-mono text-[24px] leading-none font-bold text-ink tabular-nums">
            {pages}
          </b>
          <span className="mt-1.5 font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase">
            Pages
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
      foot={
        last ? undefined : (
          /* The way out, on the floor of every step.

             The tool's whole promise is "answer what you like", and the only
             send button in the run used to be on the last card - so the
             promise was kept on the screen people leave and broken on the nine
             they walk through. Somebody who has said enough at step three
             should not have to walk past six more questions to say so.

             Centred on the bottom edge rather than in the corner cut. The
             corner holds the way on, and a second disc beside it was two round
             arrows with no words between them: neither could be told from the
             other without stopping to read a tooltip, which is the opposite of
             what a way out is for. Here it is written down, and it is where
             somebody who has finished with a step is already looking.

             No rule above it. The surface already ends a few pixels below, and
             a line drawn to say so is a second edge inside the first one. */
          <div className="flex flex-col items-center gap-3.5">
            {/* Off on a phone. The foot is held to the span between the two
                bottom cuts, and on a narrow surface that span is barely wider
                than the button - a sentence set in it wraps to five lines and
                the floor eats the question above it. The button says what it
                does on its own. */}
            <p className="text-center text-[12.5px] leading-[1.55] text-label max-sm:hidden">
              Every question after this one can be left alone. What is missing
              is written down as an assumption, not as a gap.
            </p>

            <button
              type="button"
              onClick={() => onGo(STEPS.length - 1)}
              className="group flex cursor-pointer items-center gap-2 rounded-pill bg-ink px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
            >
              Send what you have so far
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                strokeWidth={2.4}
              />
            </button>
          </div>
        )
      }
    >
      {/* One measure, centred, for every step.

          The surface is as wide as the window and a question is not. Left
          against the edge, a heading and a drop zone sat in the first third of
          a very wide card with two thirds of nothing beside them - and each
          step chose its own width, so no two of the ten lined up.

          The words inside stay left. Centring the block is what stops a step
          drifting; centring the sentences would make every line start
          somewhere different, which is the opposite. */}
      <div className="mx-auto w-full max-w-[1320px]">{children}</div>
    </Stage>
  );
}
