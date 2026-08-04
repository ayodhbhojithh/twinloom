"use client";

import { useState } from "react";

import { STATES } from "@/lib/build/v5";
import {
  assumed,
  pagesFrom,
  readiness,
  told,
  zonesFrom,
} from "@/lib/build/v5-derive";
import {
  addRef,
  dropRef,
  setLike,
  type Answers,
  type Where,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { Kicker } from "./parts";

/* ---------------------------------------------------------------------------
   The panel: the answer being written while the questions are answered.

   Two halves of one idea, on two tabs. The site, which is what the answers add
   up to, and the desk, which is everywhere somebody wrote something down. It is
   open the whole way through, because a journey made of steps can only take
   what the step in front of you happens to ask for, and the thing you think of
   on the way to step nine has nowhere else to go.

   Nothing here decides anything and nothing here is counted against anything.
   An empty desk is a finished answer.
--------------------------------------------------------------------------- */

export function Panel({
  answers,
  where,
  onGoStep,
}: {
  answers: Answers;
  /** Where the reader is standing, so a note files under the right answer. */
  where: Where | null;
  onGoStep: (key: string) => void;
}) {
  const [tab, setTab] = useState<"site" | "notes">("site");

  const pages = pagesFrom(answers);
  const zones = zonesFrom(pages);
  const { state } = readiness(answers);
  const [stateName, stateNote] = STATES[state];
  const lines = told(answers);
  const takenAsRead = assumed(answers);

  return (
    <aside className="min-w-0">
      <Kicker className="mb-3 block">The site your answers describe</Kicker>

      <div className="mb-5 flex border-b border-hair">
        {(["site", "notes"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-selected={tab === key}
            role="tab"
            className={cn(
              "-mb-px cursor-pointer border-b-2 px-3 py-2.5 text-[14px] font-semibold transition-colors first:pl-0",
              tab === key
                ? "border-ink text-ink"
                : "border-transparent text-quiet hover:text-ink",
            )}
          >
            {key === "site" ? "Your site" : "Your notes"}
            {key === "notes" ? (
              <span className="ml-2 rounded-pill bg-well px-2 py-0.5 font-mono text-[10px] text-quiet tabular-nums">
                {answers.refs.length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "site" ? (
        <>
          <Kicker className="mb-2 block">Where this has got to</Kicker>

          {/* Three named states and no bar. A percentage would be a score, and
              nothing anybody says here is being marked. */}
          <p
            className={cn(
              "inline-flex items-center gap-2 rounded-pill border py-1.5 pr-4 pl-3",
              state === "ready"
                ? "border-done/30 bg-done/[0.06]"
                : "border-border bg-well",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-2 rounded-pill",
                state === "ready"
                  ? "bg-done"
                  : state === "near"
                    ? "bg-quiet"
                    : "bg-planned",
              )}
            />
            <span className="font-mono text-[10.5px] font-bold tracking-[0.14em] text-ink uppercase">
              {stateName}
            </span>
          </p>

          <p className="mt-2.5 text-[13.5px] leading-[1.55] text-quiet">
            {stateNote}
          </p>

          <Kicker className="mt-7 mb-2.5 block">Your pages</Kicker>

          <div className="flex flex-col gap-2.5">
            {zones.map((zone) => (
              <div key={zone.key} className="rounded-card border border-border bg-field p-4">
                <div className="mb-1 flex items-baseline gap-2.5">
                  <h4 className="font-mono text-[10.5px] font-bold tracking-[0.12em] text-ink uppercase">
                    {zone.title}
                  </h4>
                  <span className="font-mono text-[10px] text-idx tabular-nums">
                    {zone.pages.length}{" "}
                    {zone.pages.length === 1 ? "page" : "pages"}
                  </span>
                </div>

                <p className="mb-2.5 text-[12.5px] leading-[1.45] text-quiet">
                  {zone.note}
                </p>

                {zone.pages.map((page) => (
                  <div
                    key={page.name}
                    className="flex items-baseline gap-2.5 py-[3px]"
                  >
                    <span className="min-w-[18px] flex-none font-mono text-[10px] text-idx tabular-nums">
                      {page.index}
                    </span>
                    <span className="text-[13.5px] leading-[1.35] font-medium text-ink">
                      {page.name}
                    </span>
                    {page.forWhom ? (
                      <span className="font-mono text-[9.5px] font-semibold tracking-[0.07em] text-quiet uppercase">
                        for {page.forWhom}
                      </span>
                    ) : null}
                    {page.always ? (
                      <span className="font-mono text-[9.5px] font-semibold tracking-[0.07em] text-label uppercase">
                        always
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {lines.length ? (
            <>
              <Kicker className="mt-7 mb-2.5 block">What you told us</Kicker>
              <ul className="flex flex-col gap-2">
                {lines.map((line, n) => (
                  <li
                    key={n}
                    className="text-[13.5px] leading-[1.5] text-quiet"
                  >
                    {line.line}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {takenAsRead.length ? (
            <>
              <Kicker className="mt-7 mb-2.5 block">
                What we will take as read
              </Kicker>
              <ul className="flex flex-col gap-2">
                {takenAsRead.map((sentence) => (
                  <li
                    key={sentence}
                    className="text-[13.5px] leading-[1.5] text-quiet"
                  >
                    {sentence}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12.5px] leading-[1.5] text-label">
                Each one is a sentence in your document rather than a gap. Answer
                the step and it stops being an assumption.
              </p>
            </>
          ) : null}
        </>
      ) : (
        <Desk answers={answers} where={where} onGoStep={onGoStep} />
      )}
    </aside>
  );
}

/** What something on the desk is filed under. */
function whereName(where: Where | null) {
  if (!where) return "General";
  const parts = [where.step, where.card, where.q].filter(Boolean);
  return parts.length ? parts.join(" / ") : "General";
}

function Desk({
  answers,
  where,
  onGoStep,
}: {
  answers: Answers;
  where: Where | null;
  onGoStep: (key: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [general, setGeneral] = useState(false);

  const filed = general ? null : where;

  return (
    <div className="min-w-0">
      <Kicker className="mb-2 block">Filed under</Kicker>
      <p className="text-[14.5px] font-semibold text-ink">
        {whereName(filed)}
      </p>
      <p className="mt-1.5 text-[13px] leading-[1.5] text-quiet">
        {general
          ? "You asked for this one to sit on its own, so it goes under General rather than under the question behind it."
          : filed
            ? "Whatever you put down next is filed here, and turns up in the document under this answer rather than in a pile at the end."
            : "Nothing you are standing on has a question of its own, so this goes under General."}
      </p>

      <form
        className="mt-4 flex items-stretch gap-2.5"
        onSubmit={(event) => {
          event.preventDefault();
          const said = draft.trim();
          if (!said) return;
          addRef({ kind: "Note", text: said, where: filed });
          setDraft("");
        }}
      >
        <input
          value={draft}
          placeholder="Anything at all, in your own words"
          onChange={(event) => setDraft(event.target.value)}
          className="min-w-0 flex-1 rounded-field bg-well px-4 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-label focus:bg-hair"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="flex-none cursor-pointer rounded-field bg-ink px-4 font-mono text-[10px] font-bold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-85 disabled:cursor-default disabled:bg-planned disabled:text-label"
        >
          Add
        </button>
      </form>

      <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[13px] text-quiet">
        <input
          type="checkbox"
          checked={general}
          onChange={(event) => setGeneral(event.target.checked)}
          className="size-4 accent-ink"
        />
        Keep this one on its own, under General
      </label>

      {answers.refs.length ? (
        <ul className="mt-6 flex flex-col gap-2.5">
          {answers.refs.map((ref) => (
            <li key={ref.n} className="rounded-card border border-border bg-field p-4">
              <div className="flex items-baseline justify-between gap-3">
                <Kicker>{ref.kind}</Kicker>
                <button
                  type="button"
                  onClick={() => dropRef(ref.n)}
                  className="cursor-pointer font-mono text-[9.5px] font-bold tracking-[0.14em] text-label uppercase transition-colors hover:text-ink"
                >
                  Remove
                </button>
              </div>

              <p className="mt-1.5 text-[14px] leading-[1.45] text-ink">
                {ref.text}
              </p>

              <button
                type="button"
                onClick={() => ref.where?.stepKey && onGoStep(ref.where.stepKey)}
                className="mt-2 cursor-pointer text-left font-mono text-[9.5px] font-bold tracking-[0.1em] text-quiet uppercase transition-colors hover:text-ink"
              >
                {whereName(ref.where)}
              </button>

              <input
                value={answers.like[ref.n] ?? ""}
                placeholder="What you like about it"
                onChange={(event) => setLike(ref.n, event.target.value)}
                className="mt-2.5 w-full rounded-field bg-field px-3 py-2 text-[13px] text-ink outline-none placeholder:text-label"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-card bg-well p-4 text-[13.5px] leading-[1.55] text-quiet">
          Nothing on the desk yet. This is a real answer on its own: everything
          here is optional, and none of it is checked against anything.
        </p>
      )}
    </div>
  );
}
