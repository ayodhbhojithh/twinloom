"use client";

import { STATES } from "@/lib/build/v5";
import {
  assumed,
  pagesFrom,
  readiness,
  told,
  zonesFrom,
} from "@/lib/build/v5-derive";
import { type Answers } from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { Kicker } from "./kit";

/* ---------------------------------------------------------------------------
   The panel: the answer being written while the questions are answered.

   What the answers add up to, beside the questions that made them: how far
   this has got, how many pages it describes, which zone each one belongs to,
   and what we will take as read.

   The notes went to a panel of their own. They are reachable from every step
   and belong to none, and giving them half of this column meant the site the
   answers describe was only ever half visible.
--------------------------------------------------------------------------- */

export function Panel({ answers }: { answers: Answers }) {
  const pages = pagesFrom(answers);
  const zones = zonesFrom(pages);
  const { state } = readiness(answers);
  const [stateName, stateNote] = STATES[state];
  const lines = told(answers);
  const takenAsRead = assumed(answers);

  return (
    <aside className="glass-pane min-w-0 rounded-[18px] p-5">
      <Kicker className="block">Your site, so far</Kicker>

      {/* Where it stands: a dot and a name, never a percentage. */}
      <div className="mt-3.5 flex items-center gap-2.5">
        <span
          aria-hidden
          className={cn(
            "size-2 flex-none rounded-pill",
            state === "ready"
              ? "bg-mark"
              : state === "near"
                ? "bg-quiet"
                : "bg-planned",
          )}
        />
        <b className="text-[13.5px] font-bold text-ink">{stateName}</b>
      </div>
      <p className="mt-1 text-[12px] leading-[1.5] text-quiet">{stateNote}</p>

      <div className="mt-4 flex items-baseline gap-2.5 border-t border-hair pt-4">
        <b className="font-mono text-[30px] leading-none font-bold text-ink tabular-nums">
          {pages.length}
        </b>
        <Kicker>pages, as it stands</Kicker>
      </div>

      <div className="mt-3.5 flex flex-col gap-3">
        {zones.map((zone) => (
          <div key={zone.key} className="min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <Kicker className="text-ink">{zone.title}</Kicker>
              <span className="font-mono text-[9.5px] text-idx tabular-nums">
                {zone.pages.length}
              </span>
            </div>

            <ul className="mt-1.5 flex flex-col">
              {zone.pages.map((page) => (
                <li
                  key={page.name}
                  className="flex items-baseline gap-2.5 py-[3px]"
                >
                  <span className="w-[18px] flex-none font-mono text-[9.5px] text-idx tabular-nums">
                    {page.index}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] leading-[1.35] font-medium text-ink">
                    {page.name}
                  </span>
                  {page.forWhom ? (
                    <span className="max-w-[40%] flex-none truncate font-mono text-[8.5px] font-semibold tracking-[0.06em] text-label uppercase">
                      {page.forWhom}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {lines.length ? (
        <div className="mt-4 border-t border-hair pt-4">
          <Kicker>What you told us</Kicker>
          <ul className="mt-2 flex flex-col gap-1.5">
            {lines.map((line, n) => (
              <li
                key={n}
                className="flex items-start gap-2 text-[12px] leading-[1.5] text-quiet"
              >
                <span
                  aria-hidden
                  className="mt-[6px] size-1 flex-none rounded-pill bg-mark"
                />
                {line.line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {takenAsRead.length ? (
        <div className="mt-4 border-t border-hair pt-4">
          <Kicker>Taken as read</Kicker>
          <ul className="mt-2 flex flex-col gap-1.5">
            {takenAsRead.map((sentence) => (
              <li key={sentence} className="text-[12px] leading-[1.5] text-label">
                {sentence}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
