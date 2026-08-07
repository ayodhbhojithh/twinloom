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
  /* Four equal columns, so a mark sits at 12.5, 37.5, 62.5 and 87.5 per cent.
     The track runs between the first and the last of those rather than edge to
     edge - a line that overshoots its end marks reads as a rule with dots on
     it, not as a run with a beginning and an end. */
  const from = 12.5;
  const span = 75;
  const done = STEPS.length - 1 === 0 ? 0 : reached / (STEPS.length - 1);

  return (
    /* The run of four, standing in the notch.

       One continuous track with the marks sitting on it, rather than four
       buttons with short rules wedged between them. That is the difference
       between a timeline and a row of tabs: the line is one thing, it is
       always there, and the part of it behind you is filled in.

       A notch is one line deep, so the names go above the track and nothing
       goes below it. What was chosen for a step is not repeated here - it
       stands in the bite at the other end of the surface, where there is room
       to read it. */
    <nav
      aria-label="Booking steps"
      className="quiet-scroll flex h-10 w-full min-w-0 items-center overflow-x-auto"
    >
      <ol className="relative grid w-full min-w-[360px] grid-cols-4 pb-1">
        {/* The track, behind the marks. */}
        <span
          aria-hidden
          className="absolute bottom-[6px] block h-[3px] rounded-pill bg-hair"
          style={{ left: `${from}%`, width: `${span}%` }}
        />
        <span
          aria-hidden
          className="absolute bottom-[6px] block h-[3px] rounded-pill bg-ink transition-[width] duration-500 ease-out"
          style={{ left: `${from}%`, width: `${span * done}%` }}
        />

        {STEPS.map((label, n) => {
          const here = n === at;
          const passed = n < reached;
          const open = n <= reached;

          return (
            <li key={label} className="relative flex min-w-0 justify-center">
              <button
                type="button"
                disabled={!open}
                aria-current={here ? "step" : undefined}
                onClick={() => onGo(n)}
                className={cn(
                  "group/step flex min-w-0 flex-col items-center gap-1.5",
                  open ? "cursor-pointer" : "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "max-w-full truncate px-1 text-[12px] leading-none font-bold tracking-[-0.012em] transition-colors",
                    here
                      ? "text-ink"
                      : open
                        ? "text-quiet group-hover/step:text-ink"
                        : "text-planned",
                  )}
                >
                  {label}
                </span>

                {/* The mark. Hollow where you are, filled where you have been,
                    and the same size throughout - a mark that grows when it is
                    current bends the line it is standing on. */}
                <span
                  aria-hidden
                  className={cn(
                    "size-3 rounded-pill transition-all duration-300",
                    here
                      ? "bg-field ring-[3px] ring-ink"
                      : passed
                        ? "bg-ink"
                        : "bg-hair group-hover/step:bg-idx",
                  )}
                />
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
        <div className="flex h-10 w-full min-w-0 items-center gap-1 pr-2 pl-1">
          <Disc label="Previous step" onClick={onBack} disabled={at === 0}>
            <ArrowLeft className="size-4" />
          </Disc>

          <div className="flex min-w-0 flex-1">{rail}</div>
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
            "flex size-11 items-center justify-center rounded-pill transition-opacity",
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
      <div className="mx-auto mt-6 max-w-[1180px] text-center">
        <h2 className="mx-auto max-w-[24ch] text-[clamp(20px,1.9vw,27px)] leading-[1.08] font-extrabold tracking-[-0.032em] text-ink">
          {title}
        </h2>

        {note ? (
          <p className="mx-auto mt-2 max-w-[62ch] text-[13.5px] leading-[1.5] text-quiet sm:text-[14px]">
            {note}
          </p>
        ) : null}
      </div>

      {/* One inset, one measure. The step's own content sits on the same
          centre line as its heading rather than running the full surface, so
          three cards and four chips read as one block instead of two rows that
          happen to start in the same place. */}
      <div className="mx-auto mt-8 w-full max-w-[1180px]">{children}</div>
    </CutPanel>
  );
}
