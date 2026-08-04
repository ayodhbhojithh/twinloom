"use client";

import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { CutPanel } from "@/components/layout/cut-panel";
import { cutCardPath } from "@/lib/shape";
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

const CARD = {
  w: 168,
  h: 96,
  onW: 200,
  onH: 114,
  cut: 42,
  mark: 32,
  radius: 15,
  flare: 15,
};

const PATH = cutCardPath(CARD.w, CARD.h, CARD.cut, CARD.radius, CARD.flare);
const PATH_ON = cutCardPath(
  CARD.onW,
  CARD.onH,
  CARD.cut,
  CARD.radius,
  CARD.flare,
);

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
 * The four steps, as cards.
 *
 * `said` is what has been chosen at each one, so the rail is a record of the
 * booking rather than a progress bar. A step ahead of the furthest one reached
 * is not pressable: it would be asking a question whose answer depends on one
 * that has not been given yet.
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
  const clip = useMemo(() => `path("${PATH}")`, []);
  const clipOn = useMemo(() => `path("${PATH_ON}")`, []);

  return (
    <nav aria-label="Booking steps" className="mb-6">
      <div className="quiet-scroll -mx-1 flex items-end gap-2.5 overflow-x-auto px-1 pt-1 pb-2">
        {STEPS.map((label, n) => {
          const here = n === at;
          const done = n < reached && !here;
          const open = n <= reached;

          return (
            <div
              key={label}
              className="group/step relative flex-none transition-[width,height] duration-300 ease-out"
              style={{
                width: here ? CARD.onW : CARD.w,
                height: here ? CARD.onH : CARD.h,
              }}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 transition-[clip-path,background-color] duration-300 ease-out",
                  here
                    ? "bg-ink"
                    : open
                      ? "bg-canvas group-hover/step:bg-canvas-firm"
                      : "bg-well",
                )}
                style={{ clipPath: here ? clipOn : clip }}
              />

              <button
                type="button"
                disabled={!open}
                aria-current={here ? "step" : undefined}
                onClick={() => onGo(n)}
                className={cn(
                  "relative flex size-full flex-col px-3.5 pt-2.5 pb-3 text-left",
                  open ? "cursor-pointer" : "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[8.5px] font-bold tracking-[0.14em] uppercase",
                    here ? "text-white/45" : "text-idx",
                  )}
                >
                  Step {String(n + 1).padStart(2, "0")}
                </span>

                <b
                  className={cn(
                    "mt-1 block leading-[1.15] font-bold tracking-[-0.02em] transition-[font-size] duration-300",
                    here
                      ? "text-[15px] text-white"
                      : open
                        ? "text-[13.5px] text-ink"
                        : "text-[13.5px] text-label",
                  )}
                >
                  {label}
                </b>

                <span
                  className={cn(
                    "mt-auto block max-w-[15ch] truncate text-[11px] font-semibold",
                    here
                      ? "text-white/65"
                      : done
                        ? "text-mark"
                        : open
                          ? "text-quiet"
                          : "text-planned",
                  )}
                >
                  {said[n] || (open ? "Nothing yet" : "Not yet")}
                </span>
              </button>

              <span
                aria-hidden
                className="pointer-events-none absolute right-0 bottom-0 flex items-center justify-center"
                style={{ width: CARD.cut, height: CARD.cut }}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-pill font-mono text-[10.5px] font-bold tabular-nums transition-colors",
                    done
                      ? "bg-mark text-white"
                      : here
                        ? "bg-ink text-white"
                        : open
                          ? "bg-field text-quiet"
                          : "bg-hair text-label",
                  )}
                  style={{ width: CARD.mark, height: CARD.mark }}
                >
                  {done ? (
                    <Check className="size-[15px]" strokeWidth={3} />
                  ) : (
                    String(n + 1).padStart(2, "0")
                  )}
                </span>
              </span>
            </div>
          );
        })}
      </div>
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
      <h2 className="max-w-[24ch] text-[clamp(24px,2.6vw,34px)] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink">
        {title}
      </h2>

      {note ? (
        <p className="mt-2 max-w-[62ch] text-[14px] leading-[1.5] text-quiet">
          {note}
        </p>
      ) : null}

      <div className="mt-6">{children}</div>
    </CutPanel>
  );
}
