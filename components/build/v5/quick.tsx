"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { ALWAYS_PAGES, REF_KINDS } from "@/lib/build/v5";
import {
  addRef,
  dropRef,
  setLike,
  setShort,
  setText,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { AddRow, Chip, H, Kicker, Pill, Sub, SubTitle } from "./kit";
import { Stage } from "./stage";

/* ---------------------------------------------------------------------------
   The quick way round, on its own surface.

   Not a smaller version of the run-through. Four pages is a real website and a
   complete answer, and somebody who knows that should be able to say so and
   leave. It goes to the same place, is read by the same people, and comes back
   as the same written scope - and the run-through's answers ride along with it
   whenever they exist.
--------------------------------------------------------------------------- */

const KIND_WHY: Record<string, string> = {
  note: "A sentence you want kept in your words.",
  file: "A brochure, a spreadsheet, a price list, a brief.",
  image: "A photograph, a logo, a drawing, anything you would show.",
  shot: "The fastest way to show something you cannot name.",
  site: "Yours, a competitor, or something you simply like.",
};

export function QuickPane({
  answers,
  onCarryOn,
}: {
  answers: Answers;
  onCarryOn: () => void;
}) {
  const [kind, setKind] = useState("note");

  return (
    <Stage className="min-h-[540px] w-full">
      <div className="grid gap-x-12 gap-y-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0">
          <H>Four pages, and you are done.</H>
          <Sub>
            Who you are, what you offer, and how to get hold of you. A real
            website and a complete answer - and the fastest route through this.
          </Sub>

          <ul className="mt-6 max-w-[420px] overflow-hidden rounded-[16px] bg-canvas">
            {ALWAYS_PAGES.map((page, n) => (
              <li
                key={page}
                className="flex items-center gap-3 border-t border-hair px-4 py-2.5 first:border-t-0"
              >
                <Check
                  aria-hidden
                  className="size-4 flex-none text-mark"
                  strokeWidth={2.6}
                />
                <b className="flex-1 text-[14px] leading-none font-semibold text-ink">
                  {page}
                </b>
                <span className="font-mono text-[9px] font-bold text-idx tabular-nums">
                  {String(n + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Pill tone="ink" arrow onClick={() => setShort(true)}>
              {answers.short
                ? "Sent as a quick submission"
                : "Send it as a quick submission"}
            </Pill>
            <Pill onClick={onCarryOn}>Carry on through the questions</Pill>
          </div>

          <p className="mt-4 max-w-[46ch] text-[12.5px] leading-[1.55] text-quiet">
            Nothing is thrown away and nothing is final. It comes back as the
            same written scope, and you can come back and answer the rest at any
            point.
          </p>
        </div>

        <div className="min-w-0">
          <SubTitle className="mt-0">Say it however you would say it</SubTitle>
          <p className="mt-1 max-w-[56ch] text-[12.5px] leading-[1.5] text-label">
            No questions, no order, no structure. It goes exactly as you typed
            it - nobody tidies it up on the way.
          </p>

          <textarea
            rows={7}
            aria-label="Say it however you would say it"
            value={answers.text["quick.words"] ?? ""}
            placeholder="What the business does, who it is for, what the website has to do, and anything you already know you want."
            onChange={(event) => setText("quick.words", event.target.value)}
            className="mt-3 w-full resize-y rounded-[14px] border border-border bg-field px-4 py-3 text-[14px] leading-[1.6] text-ink outline-none transition-colors placeholder:text-label focus:border-ink"
          />

          <SubTitle>Anything you would rather show us</SubTitle>
          <p className="mt-1 max-w-[56ch] text-[12.5px] leading-[1.5] text-label">
            Say which kind it is, add it, then write what you like about it -
            that sentence is worth more than the link on its own.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(REF_KINDS).map(([key, label]) => (
              <Chip
                key={key}
                on={kind === key}
                title={KIND_WHY[key]}
                onClick={() => setKind(key)}
              >
                {label}
              </Chip>
            ))}
          </div>

          <div className="mt-3">
            <AddRow
              placeholder="A sentence, a link, or the name of a file"
              onAdd={(value) =>
                addRef({ kind: REF_KINDS[kind], text: value, where: null })
              }
            />
          </div>

          {answers.refs.length ? (
            <ul className="mt-4 flex flex-col gap-2">
              {answers.refs.map((ref) => (
                <li
                  key={ref.n}
                  className="flex flex-wrap items-center gap-x-3.5 gap-y-2 rounded-[12px] bg-canvas px-3.5 py-2.5"
                >
                  <Kicker className="w-[72px] flex-none">{ref.kind}</Kicker>
                  <span className="min-w-[14ch] flex-1 text-[13.5px] leading-[1.4] text-ink">
                    {ref.text}
                  </span>
                  <input
                    value={answers.like[ref.n] ?? ""}
                    placeholder="What you like about it"
                    onChange={(event) => setLike(ref.n, event.target.value)}
                    className={cn(
                      "h-8 w-full rounded-field border border-border bg-field px-3 text-[12.5px] text-ink outline-none transition-colors",
                      "placeholder:text-label focus:border-ink sm:w-[200px]",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => dropRef(ref.n)}
                    className="flex-none cursor-pointer font-mono text-[9px] font-bold tracking-[0.12em] text-label uppercase transition-colors hover:text-ink"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[12.5px] leading-[1.5] text-quiet">
              Nothing added yet - the box above is enough to send. This is the
              same list the notes panel keeps.
            </p>
          )}
        </div>
      </div>
    </Stage>
  );
}
