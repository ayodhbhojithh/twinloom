"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { GROUPS, STEPS } from "@/lib/build/v5";
import { pagesFrom } from "@/lib/build/v5-derive";
import { isOn, togglePick, type Answers } from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { Disc, Plate, Stage } from "./stage";

/* ---------------------------------------------------------------------------
   A step, on the working surface.

   The same arrangement as the landing card: the way between steps stands in the
   notch at the top, what the answers add up to stands in the bite at the bottom
   left, and the way on is a disc in the corner cut. The question has the
   surface to itself.

   No standfirst, no body copy, no note under the note. A step asks one thing
   and the answers say what they mean, which is the difference between a tool
   and a page about a tool.
--------------------------------------------------------------------------- */

export function StageStep({
  at,
  answers,
  onGo,
  children,
}: {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
  children: React.ReactNode;
}) {
  const step = STEPS[at];
  const first = at === 0;
  const last = at === STEPS.length - 1;
  const pages = pagesFrom(answers).length;

  return (
    <Stage
      className="h-full min-h-[560px] w-full"
      toolbar={
        <Plate>
          <Disc label="Back" onClick={() => onGo(at - 1)}>
            <ArrowLeft className="size-4" />
          </Disc>

          <span className="flex min-w-0 flex-col px-3 text-center">
            <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase tabular-nums">
              {String(at + 1).padStart(2, "0")} / {STEPS.length}
              {step.can ? "" : " · Required"}
            </span>
            <span className="mt-0.5 truncate text-[13.5px] leading-[1.2] font-bold text-ink">
              {step.n}
            </span>
          </span>

          <Disc label="Next" onClick={() => onGo(at + 1)}>
            <ArrowRight className="size-4" />
          </Disc>
        </Plate>
      }
      aside={
        /* What the answers add up to, standing where the next project stands on
           the landing card. One number, because the panel beside it carries the
           list and this only has to say that the list is growing. */
        <div className="flex size-full flex-col justify-end rounded-[16px] bg-field p-3">
          <b className="font-mono text-[26px] leading-none font-bold text-ink tabular-nums">
            {pages}
          </b>
          <span className="mt-1 font-mono text-[9px] font-bold tracking-[0.1em] text-label uppercase">
            Pages so far
          </span>
        </div>
      }
      corner={
        !last ? (
          <Disc label="Next step" tone="ink" onClick={() => onGo(at + 1)}>
            <ArrowRight className="size-[18px]" strokeWidth={2.2} />
          </Disc>
        ) : null
      }
    >
      {!first ? null : null}
      {children}
    </Stage>
  );
}

/**
 * One answer, as a row you tick.
 *
 * The pills are gone. A wrapped row of tags makes you read every one to find
 * the two that are on; a column of ticks shows you at a glance, and leaves room
 * for each answer to say what it puts on the site without being shortened.
 */
export function TickRow({
  on,
  name,
  note,
  mark,
  single,
  onToggle,
}: {
  on: boolean;
  name: string;
  /** What ticking it means, in a few words. */
  note?: string;
  /** The quiet marker at the end of the row. */
  mark?: string;
  /** Drawn as a radio when only one of the set may be chosen. */
  single?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role={single ? "radio" : "checkbox"}
      aria-checked={on}
      onClick={onToggle}
      className="group/tick flex w-full cursor-pointer items-center gap-3.5 rounded-[10px] px-3 py-2.5 text-left transition-colors hover:bg-field"
    >
      <span
        aria-hidden
        className={cn(
          "flex size-[21px] flex-none items-center justify-center rounded-pill border-2 transition-colors",
          on
            ? "border-blocked bg-blocked text-white"
            : "border-planned text-transparent group-hover/tick:border-quiet",
        )}
      >
        <Check className="size-[12px]" strokeWidth={3.2} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[15px] leading-[1.25] font-semibold transition-colors",
            on ? "text-ink" : "text-body",
          )}
        >
          {name}
        </span>
        {note ? (
          <span className="mt-0.5 block text-[12.5px] leading-[1.35] text-label">
            {note}
          </span>
        ) : null}
      </span>

      {mark ? (
        <span
          className={cn(
            "flex-none font-mono text-[9.5px] font-bold tracking-[0.12em] uppercase transition-colors",
            on ? "text-blocked" : "text-idx",
          )}
        >
          {mark}
        </span>
      ) : null}
    </button>
  );
}

/**
 * Your visitors, on the working surface. The proof of the arrangement.
 *
 * Everything the old step had is still here: the seven groups, what each one
 * adds, and somewhere to name a group we did not list. What has gone is the
 * standfirst, the two paragraphs, the two notes underneath and the two lines
 * about what we show back, which between them were four times as much reading
 * as answering.
 */
export function StageWho({
  at,
  answers,
  onGo,
}: {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
}) {
  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <h2 className="max-w-[22ch] text-[clamp(24px,2.4vw,34px)] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink">
        Who comes to your website?
      </h2>
      <p className="mt-2.5 max-w-[46ch] text-[15px] leading-[1.5] text-quiet">
        Tick everyone who might arrive. The next step is written by what you
        tick here.
      </p>

      <div className="mt-6 grid max-w-[1100px] gap-x-6 sm:grid-cols-2">
        {GROUPS.map((group) => (
          <TickRow
            key={group.k}
            on={isOn(answers, "who", group.k)}
            name={group.n}
            mark={group.pages.length ? group.pages[0] : "No page"}
            onToggle={() => togglePick("who", group.k, "who")}
          />
        ))}
      </div>
    </StageStep>
  );
}
