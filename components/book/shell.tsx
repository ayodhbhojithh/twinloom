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
    /* The run of four, standing in the notch the surface was cut for.

       Four fixed-width steps with a rule between each pair: a mark and the
       step's name, and nothing else.

       Fixed widths rather than four equal parts. Every step then sits at the
       same distance from the next whatever its name is, which is what makes
       the rules between them read as one line rather than as three different
       lines. */
    <nav
      aria-label="Booking steps"
      className="quiet-scroll flex max-w-full justify-center overflow-x-auto py-1.5"
    >
      <ol className="flex w-max items-start justify-center">
        {STEPS.map((label, n) => {
          const here = n === at;
          const done = n < reached;
          const open = n <= reached;

          return (
            <li key={label} className="flex items-start">
              <button
                type="button"
                disabled={!open}
                aria-current={here ? "step" : undefined}
                onClick={() => onGo(n)}
                className={cn(
                  "group/step flex w-[104px] flex-col items-center gap-2.5 px-1 max-sm:w-9 max-sm:gap-0 max-sm:px-0 sm:w-[132px]",
                  open ? "cursor-pointer" : "cursor-default",
                )}
              >
                {/* The mark. A ring round the one you are on rather than a
                    larger dot, so the line through them all stays straight. */}
                <span
                  aria-hidden
                  className={cn(
                    "flex size-3 items-center justify-center rounded-pill transition-all max-sm:size-2.5 max-sm:ring-[3px]",
                    here
                      ? "bg-ink ring-4 ring-ink/15"
                      : done
                        ? "bg-mark"
                        : "bg-planned group-hover/step:bg-idx",
                  )}
                />

                {/* The name, and nothing under it - and on a phone, not
                    even the name.

                    Four names side by side want four hundred points and the
                    notch has two hundred and fifty, so the run either scrolled
                    sideways or ran under the arrow standing at the left of the
                    same bar. Neither is a progress line. The marks alone still
                    carry the order, the position and how far along it is, and
                    the name of the step somebody is on is the heading directly
                    underneath - it was being said twice.

                    There were two lines here: the state of the step, and then
                    what had been chosen for it. Both went. The state is what
                    the mark and its colour already say, and the choice is
                    already on the surface below - once in the answer itself,
                    and again in the bite when it matters. A run of steps that
                    repeats the whole booking is not a run of steps. */}
                <b
                  className={cn(
                    "block max-w-full truncate text-[13px] leading-[1.2] font-bold tracking-[-0.01em] transition-colors max-sm:hidden",
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

              {n < STEPS.length - 1 ? (
                /* The line between two marks, and it is the line: it sits at
                   the height of the marks rather than under the labels, so the
                   four of them read as one run. */
                <span
                  aria-hidden
                  className={cn(
                    "mt-[5px] -mx-6 h-0.5 w-12 rounded-pill transition-colors max-sm:mx-0 max-sm:w-5 sm:w-16",
                    n < reached ? "bg-mark" : "bg-hair",
                  )}
                />
              ) : null}
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
  title,
  note,
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
  title: string;
  note?: React.ReactNode;
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
      bar="wide"
      toolbar={
        <div className="relative flex h-full w-full min-w-0 items-center">
          <span className="absolute top-1/2 left-1 z-10 -translate-y-1/2">
            <Disc label="Previous step" onClick={onBack} disabled={at === 0}>
              <ArrowLeft className="size-4" />
            </Disc>
          </span>

          <div className="flex min-w-0 flex-1 justify-center px-11 max-sm:px-9">
            {rail}
          </div>
        </div>
      }
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
      <div className="mx-auto mt-6 max-w-[1180px] text-center max-sm:mt-2">
        <h2 className="mx-auto max-w-[24ch] text-[clamp(20px,1.9vw,27px)] leading-[1.08] font-extrabold tracking-[-0.032em] text-ink max-sm:text-[18px]">
          {title}
        </h2>

        {note ? (
          <p className="mx-auto mt-2 max-w-[62ch] text-[13.5px] leading-[1.5] text-quiet max-sm:mt-1.5 max-sm:text-[12.5px] sm:text-[14px]">
            {note}
          </p>
        ) : null}
      </div>

      {/* One inset, one measure. The step's own content sits on the same
          centre line as its heading rather than running the full surface, so
          three cards and four chips read as one block instead of two rows that
          happen to start in the same place. */}
      <div className="mx-auto mt-8 w-full max-w-[1180px] max-sm:mt-5">
        {children}
      </div>
    </CutPanel>
  );
}
