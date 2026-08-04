"use client";

import type { OptionList as List } from "@/lib/build/v5-options";
import {
  isOn,
  setPick,
  togglePick,
  touchStep,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

/**
 * A list of answers that need explaining rather than counting.
 *
 * The other control the prototype uses. A table row is a thing you tick; one of
 * these is a thing you have to read first, which is why "Bold and confident"
 * carries a sentence and "Call you" does not.
 *
 * A one-answer list clears the rest when something is chosen, rather than
 * leaving two contradictory answers ticked and deciding later which of them was
 * meant.
 */
export function OptionRows({
  list,
  answers,
  step,
}: {
  list: List;
  answers: Answers;
  step: string;
}) {
  return (
    <div className="mt-4 max-w-wide overflow-hidden rounded-card border border-border bg-field">
      {list.rows.map((row) => {
        const on = isOn(answers, row.scope, row.k);

        return (
          <button
            key={row.k}
            type="button"
            aria-pressed={on}
            onClick={() => {
              if (row.one) {
                setPick(row.scope, row.k, true, true);
                touchStep(step);
                return;
              }
              togglePick(row.scope, row.k, step);
            }}
            className={cn(
              "flex w-full cursor-pointer items-start gap-4 border-t border-border px-4 py-3.5 text-left transition-colors first:border-t-0 sm:px-5",
              on ? "bg-done/[0.05]" : "hover:bg-hair",
            )}
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] leading-[1.3] font-bold text-ink">
                {row.n}
              </span>
              {row.sub ? (
                <span
                  className={cn(
                    "mt-1 block max-w-[62ch] text-[13.5px] leading-[1.5]",
                    on ? "text-done" : "text-quiet",
                  )}
                >
                  {row.sub}
                </span>
              ) : null}
            </span>

            <span
              className={cn(
                "mt-0.5 flex-none font-mono text-[10px] font-bold tracking-[0.14em] uppercase",
                on ? "text-done" : "text-label",
              )}
            >
              {on ? "Picked" : "Pick"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Every list a step carries, each under its own heading. */
export function OptionLists({
  lists,
  answers,
  step,
}: {
  lists: readonly List[];
  answers: Answers;
  step: string;
}) {
  return (
    <>
      {lists.map((list) => (
        <div key={list.scope} className="mt-8">
          <h4 className="text-[19px] leading-[1.25] font-bold tracking-[-0.015em] text-ink sm:text-[21px]">
            {list.title}
          </h4>
          {list.note ? (
            <p className="mt-1.5 max-w-measure text-[15px] leading-[1.55] text-quiet">
              {list.note}
            </p>
          ) : null}

          <OptionRows list={list} answers={answers} step={step} />
        </div>
      ))}
    </>
  );
}
