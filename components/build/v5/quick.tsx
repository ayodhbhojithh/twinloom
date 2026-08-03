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

import { Chip, Kicker, SubHead, Under } from "./parts";

/* ---------------------------------------------------------------------------
   The short way round.

   Not a smaller version of the run-through. Four pages is a real website and a
   complete answer, and somebody who knows that is the answer should be able to
   say so and leave rather than walk through twelve steps to arrive at it.

   Nothing here is thrown away either way: it goes to the same place, is read by
   the same people, and comes back as the same written scope.
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
  const [draft, setDraft] = useState("");

  return (
    <div className="grid max-w-wide gap-x-12 gap-y-10 lg:grid-cols-2">
      <div className="min-w-0">
        <div className="rounded-card bg-well p-5 sm:p-6">
          <h4 className="text-[19px] leading-[1.25] font-bold tracking-[-0.015em] text-ink sm:text-[21px]">
            Four pages, and you are done
          </h4>
          <p className="mt-2 text-[15px] leading-[1.6] text-quiet">
            Some people want people to know they exist, what they offer, and how
            to get hold of them. That is a real website and a complete answer,
            and it is the fastest route through this.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setShort(true)}
              className={cn(
                "cursor-pointer rounded-field px-5 py-2.5 text-[14.5px] font-semibold transition-opacity",
                answers.short
                  ? "bg-ink text-white opacity-100"
                  : "bg-ink text-white hover:opacity-85",
              )}
            >
              {answers.short
                ? "Sent as a quick submission"
                : "Send it as a quick submission"}
            </button>
            <button
              type="button"
              onClick={onCarryOn}
              className="cursor-pointer rounded-field bg-field px-5 py-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-hair"
            >
              Carry on through the questions
            </button>
          </div>
        </div>

        <SubHead
          title="What a quick submission gives you"
          note="The eleven things every website includes, on these pages, with the enquiry form going to an inbox you own."
        />

        <ul className="overflow-hidden rounded-card bg-well">
          {ALWAYS_PAGES.map((page) => (
            <li
              key={page}
              className="flex items-center gap-3 border-t border-border px-4 py-3 first:border-t-0"
            >
              <Check aria-hidden className="size-4 flex-none text-ink" strokeWidth={2.5} />
              <b className="text-[14.5px] font-semibold text-ink">{page}</b>
            </li>
          ))}
        </ul>

        <Under>
          Sending it this way throws away nothing you have already answered, and
          nothing about it is final. It goes to the same place, is read by the
          same people, and comes back as the same written scope.
        </Under>

        <Under>
          <b>You can come back and answer the rest at any point.</b> A quick
          submission is a starting position, not a smaller version of the thing.
        </Under>
      </div>

      <div className="min-w-0">
        <Kicker className="block">In your own words</Kicker>
        <b className="mt-1.5 block text-[17px] font-bold text-ink">
          Say it however you would say it
        </b>
        <p className="mt-1.5 text-[14.5px] leading-[1.6] text-quiet">
          No questions, no order, no structure. As much or as little as you like.
          It goes with the request exactly as you typed it, and nobody tidies it
          up on the way.
        </p>

        <textarea
          rows={9}
          aria-label="Say it however you would say it"
          value={answers.text["quick.words"] ?? ""}
          placeholder="What the business does, who it is for, what the website has to do, and anything you already know you want."
          onChange={(event) => setText("quick.words", event.target.value)}
          className="mt-4 w-full resize-y rounded-card bg-well px-4 py-3.5 text-[15px] leading-[1.65] text-ink outline-none transition-colors placeholder:text-label focus:bg-hair"
        />

        <Kicker className="mt-8 block">
          And anything you would rather show us
        </Kicker>
        <p className="mt-1.5 text-[14.5px] leading-[1.6] text-quiet">
          A document, an image, a screenshot, or a link to a website. Say which
          kind it is, add it, then write against it what you like about it. That
          sentence is worth more to us than the link on its own.
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

        <form
          className="mt-3 flex items-stretch gap-2.5"
          onSubmit={(event) => {
            event.preventDefault();
            const said = draft.trim();
            if (!said) return;
            addRef({ kind: REF_KINDS[kind], text: said, where: null });
            setDraft("");
          }}
        >
          <input
            value={draft}
            aria-label="Write it, paste it, or name the file"
            placeholder="A sentence, a link, or the name of a file"
            onChange={(event) => setDraft(event.target.value)}
            className="min-w-0 flex-1 rounded-field bg-well px-4 py-2.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-label focus:bg-hair"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="flex-none cursor-pointer rounded-field bg-ink px-5 font-mono text-[10px] font-bold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-85 disabled:cursor-default disabled:bg-planned disabled:text-label"
          >
            Add
          </button>
        </form>

        {answers.refs.length ? (
          <table className="mt-5 w-full border-collapse">
            <thead>
              <tr>
                {["Kind", "What it is", "What you like about it", ""].map(
                  (head) => (
                    <th
                      key={head}
                      scope="col"
                      className="border-b border-hair pr-3 pb-2 text-left font-mono text-[10px] font-bold tracking-[0.14em] text-label uppercase"
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {answers.refs.map((ref) => (
                <tr key={ref.n} className="border-b border-hair">
                  <td className="py-2.5 pr-3 align-top font-mono text-[10px] font-bold tracking-[0.1em] text-quiet uppercase">
                    {ref.kind}
                  </td>
                  <td className="py-2.5 pr-3 align-top text-[14px] leading-[1.45] text-ink">
                    {ref.text}
                  </td>
                  <td className="py-2.5 pr-3 align-top">
                    <input
                      value={answers.like[ref.n] ?? ""}
                      placeholder="What you like about it"
                      onChange={(event) => setLike(ref.n, event.target.value)}
                      className="w-full rounded-field bg-well px-3 py-2 text-[13.5px] text-ink outline-none placeholder:text-label"
                    />
                  </td>
                  <td className="py-2.5 text-right align-top">
                    <button
                      type="button"
                      onClick={() => dropRef(ref.n)}
                      className="cursor-pointer font-mono text-[9.5px] font-bold tracking-[0.12em] text-label uppercase transition-colors hover:text-ink"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-5 text-[14px] leading-[1.55] text-quiet">
            Nothing added yet. This is a real answer on its own - the box above is
            enough to send.
          </p>
        )}

        <Under>
          This is the same list the side panel keeps, seen with room to write
          against each one. Add something here and it is there; add something
          there and it is here.
        </Under>
      </div>
    </div>
  );
}
