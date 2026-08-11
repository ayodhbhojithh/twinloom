"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { CutPanel } from "@/components/layout/cut-panel";
import { cn } from "@/lib/utils";

import { STEPS } from "./meetings";

/* ---------------------------------------------------------------------------
   The shell a booking is made in.

   The same surface the rest of the site is built on: one cut card, with the way
   between steps standing in the notch at the top, what has been settled so far
   standing in the bite at the bottom left, and the way on standing in the
   corner cut. A booking is four decisions, and this gives each of them the
   whole surface instead of a quarter of a form.

   Above it, the four steps as cut cards rather than a row of numbered circles
   joined by a rule. A circle can carry a number; a card can carry what you
   chose, which is the thing somebody actually wants to check before moving on.
--------------------------------------------------------------------------- */

/** A round control, as the landing card draws its arrows. */
export function Disc({
  label,
  onClick,
  tone = "quiet",
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: "quiet" | "ink";
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-9 flex-none cursor-pointer items-center justify-center rounded-pill transition-colors",
        tone === "ink"
          ? "bg-ink text-white hover:opacity-85"
          : "text-quiet hover:bg-well hover:text-ink",
        disabled &&
          "cursor-default text-planned hover:bg-transparent hover:text-planned",
      )}
    >
      {children}
    </button>
  );
}

/**
 * The four steps, as a line.
 *
 * Not cards. The surface below is the shape on this page, and a row of cut
 * cards above it was a second one competing with it - two strong shapes, one of
 * them only saying where you are. So this is a line with four marks on it: the
 * plainest thing that can carry an order, a position and what was chosen at
 * each stop.
 *
 * The line fills behind you as you go, so progress is readable from the shape
 * of it before any of the labels are.
 *
 * `said` is what has been chosen at each step, which is what turns a progress
 * bar into a record. A step ahead of the furthest one reached is not pressable:
 * it would be asking a question whose answer depends on one not given yet.
 */
export function StepRail({
  at,
  reached,
  onGo,
}: {
  at: number;
  reached: number;
  onGo: (step: number) => void;
}) {
  return (
    /* Four marks on one rail, and the rail is the width it is given.

       It was four fixed-width steps with a fixed rule between each pair, which
       is a run of a known length dropped into a container of an unknown one: on
       a wide card it sat in the middle with air either side, and on a phone it
       was wider than the notch it stood in and scrolled. The connectors are
       `flex-1` now, so the run is exactly as wide as the row and the marks
       divide it evenly at any width.

       Numbered rather than dotted. Four identical dots say only how many there
       are and where you are; a number says which one this is, and the tick that
       replaces it says that one is behind you. The count was the thing four
       dots could not carry.

       Three states, and they read without the labels: behind you is the mark's
       colour with a tick in it, here is ink with a ring, ahead is an outline.
       That is what makes the labels optional rather than load-bearing. */
    <nav aria-label="Booking steps" className="w-full">
      <ol className="flex w-full items-start">
        {STEPS.map((label, n) => {
          const here = n === at;
          const done = n < reached;
          const open = n <= reached;

          return (
            <li key={label} className="contents">
              {n > 0 ? (
                /* The line between two marks, at the height of the marks rather
                   than under the labels, so the four read as one run. It is
                   filled as far as you have been. */
                <span
                  aria-hidden
                  className={cn(
                    "mt-3.5 h-0.5 min-w-3 flex-1 rounded-pill transition-colors max-sm:mt-3",
                    n <= reached ? "bg-mark" : "bg-hair",
                  )}
                />
              ) : null}

              <button
                type="button"
                disabled={!open}
                aria-current={here ? "step" : undefined}
                onClick={() => onGo(n)}
                className={cn(
                  "group/step flex w-[72px] flex-none flex-col items-center gap-2 px-1 max-sm:w-[58px] max-sm:gap-1.5",
                  open ? "cursor-pointer" : "cursor-default",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-7 items-center justify-center rounded-pill font-mono text-[10px] font-bold tabular-nums transition-all max-sm:size-6 max-sm:text-[9px]",
                    here
                      ? "bg-ink text-white ring-4 ring-ink/12"
                      : done
                        ? "bg-mark text-white"
                        : "border border-hair bg-field text-idx group-hover/step:border-quiet",
                  )}
                >
                  {done ? (
                    <Check className="size-3.5 max-sm:size-3" strokeWidth={3} />
                  ) : (
                    String(n + 1).padStart(2, "0")
                  )}
                </span>

                {/* The name, and it fits again.

                    It was hidden below `sm` because four names at fixed widths
                    ran past the notch they stood in. The run is fluid now and
                    the rail is above the card rather than inside a cut, so
                    there is room for them at every width - and a step called
                    "Details" is worth more than a dot. */}
                <b
                  className={cn(
                    "block max-w-full truncate font-mono text-[9.5px] font-bold tracking-[0.12em] uppercase transition-colors max-sm:text-[8px] max-sm:tracking-[0.08em]",
                    here
                      ? "text-ink"
                      : open
                        ? "text-quiet group-hover/step:text-ink"
                        : "text-planned",
                  )}
                >
                  {label}
                </b>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * One step, on the working surface.
 *
 * The question has the surface to itself: no rules, no boxes and no bar of
 * buttons underneath it. The way back and the way on stand in the cuts, which
 * is where every other control on this site stands.
 */
export function BookStage({
  at,
  rail,
  held,
  foot,
  canGoOn,
  last,
  onBack,
  onNext,
  className,
  children,
}: {
  at: number;
  /** The four steps, which stand in the notch. */
  rail?: React.ReactNode;
  /** What is settled so far, standing in the bite. */
  held?: React.ReactNode;
  /** The band along the very bottom, between the two cuts. */
  foot?: React.ReactNode;
  canGoOn: boolean;
  last: boolean;
  onBack: () => void;
  onNext: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* The run of steps, above the surface rather than standing in it.

          It stood in a notch cut into the top edge, which is what this site does
          with a control that belongs to a surface - the landing card's arrows,
          the working stage's bar. This one does not belong to the surface. It is
          about the whole booking: four steps, of which the panel below is
          showing one, and it stays the same while everything under it changes.

          A notch is also a hole, and a hole has to be big enough for what stands
          in it. Four names plus the way back needed most of the top edge on a
          desk and more than all of it on a phone, so the edge was being cut to
          fit a row that was never part of the card.

          Above it, the run is a line across the page and the card is a card:
          the shape gets its edge back and the steps get whatever width they
          want. */}
      {/* Held to a measure, and centred on the card under it.

          The connectors are `flex-1`, which is what makes the run fit any width
          - and given the whole page it fitted the whole page: four marks a foot
          apart joined by three hairlines a foot long, which reads as a rule
          somebody drew across the top rather than as four steps. A run of four
          wants to be read in one look, and 520 is about the width that takes.

          The row is the same measure plus the disc either side of it, so the
          marks are centred on the card rather than on what the back arrow
          leaves. */}
      <div className="mx-auto mb-5 flex w-full max-w-[600px] items-center gap-1 max-sm:mb-4">
        <Disc label="Previous step" onClick={onBack} disabled={at === 0}>
          <ArrowLeft className="size-4" />
        </Disc>

        <div className="min-w-0 flex-1">{rail}</div>

        {/* The width of the disc, so the run is centred between the two ends of
            the row rather than pushed off by the one control on it. */}
        <span aria-hidden className="size-9 flex-none" />
      </div>

      <CutPanel
        /* White, like the landing card and like every other panel on the site.
         It was the canvas grey, which is also the page - so the shape was
         being drawn in one colour on the same colour, and the whole surface
         was invisible. The notch, the bite and the flared corners were all
         there and none of them could be seen.

         And a real floor. The two cuts along the bottom need room to be cuts,
         and a surface that shrinks to a short answer loses the shape it is
         drawn from. */
        /* A floor, not a fill. Told to take the whole window it left a third of
         itself empty under a short answer, which is worse than a smaller card:
         the corner disc ended up floating alone in a void. The floor is what
         the two cuts along the bottom need to be cuts, and the surface grows
         from there with whatever is asked. */
        tone="field"
        className={cn("min-h-[clamp(380px,46vh,520px)] w-full", className)}
        aside={
          held ? (
            <div className="flex size-full flex-col items-center justify-center px-1 text-center">
              {held}
            </div>
          ) : undefined
        }
        foot={foot}
        corner={
          <button
            type="button"
            aria-label={last ? "Confirm the booking" : "Next step"}
            title={last ? "Confirm the booking" : "Next step"}
            onClick={onNext}
            disabled={!canGoOn}
            className={cn(
              "flex size-11 items-center justify-center rounded-pill transition-opacity max-sm:size-10",
              canGoOn
                ? "cursor-pointer bg-ink text-white hover:opacity-85"
                : "cursor-default bg-planned text-white/70",
            )}
          >
            {last ? (
              <Check className="size-[19px]" strokeWidth={2.6} />
            ) : (
              <ArrowRight className="size-[18px]" strokeWidth={2.2} />
            )}
          </button>
        }
      >
        {/* No heading over the step.

          Each one carried its own - "What kind of meeting?" over "Three to
          choose from. None of them commits you to anything." - and the run of
          four directly above says which step this is in one word. What the
          heading added was the same fact asked as a question, and what the line
          under it added was a reassurance about three cards that are visibly
          three cards, none of which is a form.

          The step is its contents now, which is what the rail is for. */}

        {/* One inset, one measure. The step's own content sits on the same
          centre line as its heading rather than running the full surface, so
          three cards and four chips read as one block instead of two rows that
          happen to start in the same place. */}
        <div className="mx-auto mt-8 w-full max-w-[1180px] max-sm:mt-5">
          {children}
        </div>
      </CutPanel>
    </>
  );
}
