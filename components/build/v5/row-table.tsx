"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { CARD_BY } from "@/lib/build/v5-cards";
import { BANDS, ROWS } from "@/lib/build/v5-rows";
import {
  isOn,
  picked,
  togglePick,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { DetailCard } from "./card";
import { Glyph } from "./glyph";
import { Kicker } from "./parts";

/* ---------------------------------------------------------------------------
   One table for a whole question.

   Bands inside it as full width rows rather than a list per band, so the three
   columns line up the whole way down and the middle one can keep saying what
   each tick actually puts on the site.

   A band only appears if the group that asks for it was named on the step
   before. That is the rule the run-through turns on: the second question is
   written by the first, and a list of things nobody on your site would ever do
   is a list you have to read to ignore.

   Layer two opens underneath its own row rather than over the page. A question
   about bookings floating above the list is a question in the abstract; under
   the row that raised it, it is plainly about that row.
--------------------------------------------------------------------------- */

/** What a row's tick means. `fix` cannot be turned off. */
export interface TableRow {
  k: string;
  band: string;
  n: string;
  pages: readonly string[];
  pre: "" | "fix" | "tick";
  l2: string;
}

export function RowTable({
  step,
  scope,
  rows,
  answers,
  /** Bands only shown once the group that asks for them has been named. */
  needs = [],
}: {
  step: string;
  scope: string;
  rows: readonly TableRow[];
  answers: Answers;
  needs?: readonly string[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  const bands = BANDS.filter(
    (band) => band.step === step && (!band.need || needs.includes(band.need)),
  );

  return (
    <div className="mt-6 max-w-wide">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <Th>What a visitor can do</Th>
            <Th className="hidden w-[28%] lg:table-cell">
              What it puts on the site
            </Th>
            <Th className="w-[132px] pr-0 text-right">On the list</Th>
          </tr>
        </thead>

        {bands.map((band) => {
          const inBand = rows.filter((row) => row.band === band.band);
          if (!inBand.length) return null;

          return (
            <tbody key={`${band.step}-${band.band}`}>
              <tr>
                <td colSpan={3} className="pt-8 pb-3">
                  <h4 className="flex items-baseline gap-2.5 font-mono text-[10.5px] font-bold tracking-[0.14em] text-label uppercase">
                    {band.title}
                    <span className="text-[10px] font-normal tracking-normal text-idx tabular-nums">
                      {inBand.length}
                    </span>
                  </h4>
                  <span className="mt-1 block text-[13px] leading-[1.45] text-quiet normal-case">
                    {band.note}
                  </span>
                </td>
              </tr>

              {inBand.map((row) => {
                const meta = ROWS[row.k];
                const fixed = row.pre === "fix";
                const on = fixed || isOn(answers, scope, row.k);
                const card = row.l2 ? CARD_BY[`dw-${row.l2}`] : undefined;
                const showing = open === row.k;

                return (
                  <Row
                    key={row.k}
                    row={row}
                    meta={meta}
                    on={on}
                    fixed={fixed}
                    scope={scope}
                    step={step}
                    card={card}
                    showing={showing}
                    answers={answers}
                    onOpen={() => setOpen(showing ? null : row.k)}
                  />
                );
              })}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

function Row({
  row,
  meta,
  on,
  fixed,
  scope,
  step,
  card,
  showing,
  answers,
  onOpen,
}: {
  row: TableRow;
  meta?: { n: string; sub: string; icon: Parameters<typeof Glyph>[0]["parts"] };
  on: boolean;
  fixed: boolean;
  scope: string;
  step: string;
  card?: (typeof CARD_BY)[string];
  showing: boolean;
  answers: Answers;
  onOpen: () => void;
}) {
  const adds = row.pages.length ? `Adds ${row.pages.join(", ")}` : "No page of its own";

  return (
    <>
      <tr
        className={cn(
          "border-b border-hair transition-colors",
          !fixed && "cursor-pointer hover:bg-well",
        )}
        onClick={fixed ? undefined : () => togglePick(scope, row.k, step)}
      >
        <td className="py-3.5 pr-3 align-middle">
          <span className="flex items-start gap-3.5">
            <span
              className={cn(
                "mt-px flex size-9 flex-none items-center justify-center rounded-pill transition-colors",
                on ? "bg-ink text-white" : "bg-well text-quiet",
              )}
            >
              {meta ? <Glyph parts={meta.icon} className="size-[19px]" /> : null}
            </span>

            <span className="block min-w-0">
              <span
                className={cn(
                  "block text-[15px] leading-[1.3] text-ink",
                  on ? "font-bold" : "font-semibold",
                )}
              >
                {meta?.n ?? row.n}
              </span>
              {meta?.sub ? (
                <span className="mt-0.5 block max-w-[52ch] text-[13px] leading-[1.45] text-quiet">
                  {meta.sub}
                </span>
              ) : null}
              <span className="mt-1 block font-mono text-[9.5px] font-bold tracking-[0.12em] text-label uppercase lg:hidden">
                {adds}
              </span>
            </span>
          </span>
        </td>

        <td
          className={cn(
            "hidden py-3.5 pr-3 text-[13.5px] leading-[1.35] lg:table-cell",
            on ? "text-ink" : "text-quiet",
            !row.pages.length && "text-label",
          )}
        >
          {row.pages.length ? row.pages.join(", ") : "no page of its own"}
        </td>

        <td className="py-3.5 text-right align-middle">
          <span className="inline-flex items-center justify-end gap-2">
            {card ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen();
                }}
                className="cursor-pointer rounded-pill bg-well px-3 py-1.5 font-mono text-[9.5px] font-bold tracking-[0.12em] text-quiet uppercase transition-colors hover:text-ink"
              >
                {showing ? "Close" : "Detail"}
              </button>
            ) : null}

            {fixed ? (
              /* Not a control. These two are on every site we build, so a
                 button beside them would be offering a choice that is not
                 there. */
              <span aria-label="Always included" className="text-done">
                <Check aria-hidden className="size-[17px]" strokeWidth={2.3} />
              </span>
            ) : (
              <span
                className={cn(
                  "font-mono text-[10px] font-bold tracking-[0.14em] uppercase",
                  on ? "text-done" : "text-label",
                )}
              >
                {on ? "Picked" : "Pick"}
              </span>
            )}
          </span>
        </td>
      </tr>

      {card && showing ? (
        <tr>
          <td colSpan={3} className="pb-2">
            <DetailCard
              card={card}
              answers={answers}
              stepKey={step}
              onClose={onOpen}
            />
          </td>
        </tr>
      ) : null}
    </>
  );
}

function Th({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-hair pr-3 pb-2 text-left font-mono text-[10px] font-bold tracking-[0.14em] text-label uppercase",
        className,
      )}
    >
      {children}
    </th>
  );
}

/** Which bands a set of answers has earned. */
export function needsFrom(answers: Answers) {
  return picked(answers, "who");
}

export { Kicker };
