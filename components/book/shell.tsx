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
  said,
  onGo,
}: {
  at: number;
  reached: number;
  said: readonly string[];
  onGo: (step: number) => void;
}) {
  return (
    <nav aria-label="Booking steps" className="mb-9 flex justify-center">
      <ol className="flex items-start">
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
                  "group/step flex w-[104px] flex-col items-center gap-2.5 px-1 sm:w-[132px]",
                  open ? "cursor-pointer" : "cursor-default",
                )}
              >
                {/* The mark. A ring round the one you are on rather than a
                    larger dot, so the line through them all stays straight. */}
                <span
                  aria-hidden
                  className={cn(
                    "flex size-3 items-center justify-center rounded-pill transition-all",
                    here
                      ? "bg-ink ring-4 ring-ink/15"
                      : done
                        ? "bg-mark"
                        : "bg-planned group-hover/step:bg-idx",
                  )}
                />

                <span className="flex min-w-0 flex-col items-center">
                  <b
                    className={cn(
                      "block text-[13px] leading-[1.2] font-bold tracking-[-0.01em] transition-colors",
                      here
                        ? "text-ink"
                        : open
                          ? "text-quiet group-hover/step:text-ink"
                          : "text-planned",
                    )}
                  >
                    {label}
                  </b>

                  <span
                    className={cn(
                      "mt-1 block max-w-full truncate font-mono text-[9px] font-bold tracking-[0.1em] uppercase",
                      done ? "text-mark" : "text-idx",
                    )}
                  >
                    {said[n] || (open ? "Open" : "Locked")}
                  </span>
                </span>
              </button>

              {n < STEPS.length - 1 ? (
                /* The line between two marks, and it is the line: it sits at
                   the height of the marks rather than under the labels, so the
                   four of them read as one run. */
                <span
                  aria-hidden
                  className={cn(
                    "mt-[5px] -mx-6 h-0.5 w-12 rounded-pill transition-colors sm:w-16",
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
  held,
  foot,
  canGoOn,
  last,
  onBack,
  onNext,
  children,
}: {
  at: number;
  title: string;
  note?: string;
  /** What is settled so far, standing in the bite. */
  held?: React.ReactNode;
  /** The band along the very bottom, between the two cuts. */
  foot?: React.ReactNode;
  canGoOn: boolean;
  last: boolean;
  onBack: () => void;
  onNext: () => void;
  children: React.ReactNode;
}) {
  return (
    <CutPanel
      /* A floor, not a fixed height. The two cuts along the bottom need room
         to be cuts, and a surface that shrinks to a short answer loses the
         shape it is drawn from - but anything past this was empty. */
      className="min-h-[340px] w-full"
      toolbar={
        <div className="flex h-10 w-full items-center gap-0.5 rounded-pill bg-field px-1.5">
          <Disc label="Previous step" onClick={onBack} disabled={at === 0}>
            <ArrowLeft className="size-4" />
          </Disc>

          <span className="flex min-w-0 flex-1 items-baseline justify-center gap-2.5 px-1">
            <span className="flex-none font-mono text-[9.5px] font-bold tracking-[0.12em] text-label tabular-nums">
              {String(at + 1).padStart(2, "0")}/{STEPS.length}
            </span>
            <span className="truncate text-[13.5px] leading-none font-bold text-ink">
              {STEPS[at]}
            </span>
          </span>

          <Disc label="Next step" onClick={onNext} disabled={last || !canGoOn}>
            <ArrowRight className="size-4" />
          </Disc>
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
      <h2 className="max-w-[min(24ch,var(--notch-free,62ch))] text-[clamp(20px,1.9vw,27px)] leading-[1.08] font-extrabold tracking-[-0.032em] text-ink">
        {title}
      </h2>

      {note ? (
        <p className="mt-1.5 max-w-[62ch] text-[13.5px] leading-[1.5] text-quiet sm:text-[14px]">
          {note}
        </p>
      ) : null}

      <div className="mt-5">{children}</div>
    </CutPanel>
  );
}
