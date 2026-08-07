"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { outline, type Cuts } from "@/components/home/notched-card";
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
    /* The run of four, standing in the notch.

       It used to be a surface of its own above the card, which made it a
       second object competing with the one thing on the page - and the card
       already had a cut drawn in its top edge for exactly this kind of
       control. One shape, with the navigation standing in it.

       Compact, because a notch is one line deep. The step's name is here; what
       was chosen for it stands in the bite at the other end of the surface,
       where there is room to read it. */
    <nav
      aria-label="Booking steps"
      className="quiet-scroll flex h-10 max-w-full items-center overflow-x-auto px-1"
    >
      <ol className="flex items-center">
        {STEPS.map((label, n) => {
          const here = n === at;
          const done = n < reached;
          const open = n <= reached;

          return (
            <li key={label} className="flex items-center">
              <button
                type="button"
                disabled={!open}
                aria-current={here ? "step" : undefined}
                onClick={() => onGo(n)}
                title={said[n] || (open ? "Open" : "Locked")}
                className={cn(
                  "group/step flex shrink-0 items-center gap-1.5 rounded-pill px-2 py-1 transition-colors",
                  open ? "cursor-pointer hover:bg-canvas" : "cursor-default",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-pill transition-all",
                    here
                      ? "bg-ink ring-[3px] ring-ink/15"
                      : done
                        ? "bg-mark"
                        : "bg-planned group-hover/step:bg-idx",
                  )}
                />

                <span
                  className={cn(
                    "text-[12px] leading-none font-bold tracking-[-0.01em] whitespace-nowrap transition-colors",
                    here
                      ? "text-ink"
                      : open
                        ? "text-quiet group-hover/step:text-ink"
                        : "text-planned",
                  )}
                >
                  {label}
                </span>
              </button>

              {n < STEPS.length - 1 ? (
                /* The line between two marks, at the height of the marks
                   rather than under the words, so the four read as one run. */
                <span
                  aria-hidden
                  className={cn(
                    "h-px w-4 shrink-0 rounded-pill transition-colors sm:w-6",
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
      tone="field"
      className={cn("min-h-[clamp(400px,50vh,540px)] w-full", className)}
      bar="wide"
      toolbar={
        <div className="flex h-10 w-full items-center gap-1 px-1.5">
          <Disc label="Previous step" onClick={onBack} disabled={at === 0}>
            <ArrowLeft className="size-4" />
          </Disc>

          <div className="flex min-w-0 flex-1 justify-center">{rail}</div>
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
