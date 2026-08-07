"use client";

import { useState } from "react";

import { REF_KINDS } from "@/lib/build/v5";
import {
  addRef,
  dropRef,
  setLike,
  setShort,
  setText,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { isPicture, type Attached } from "@/lib/build/upload";

import { DropZone } from "./drop";
import { AddRow, Chip, H, Kicker, Pill, Sub } from "./kit";
import { Stage } from "./stage";

/* ---------------------------------------------------------------------------
   The quick way round, on its own surface.

   Not a smaller version of the run-through. Four pages is a real website and a
   complete answer, and somebody who knows that should be able to say so and
   leave. It goes to the same place, is read by the same people, and comes back
   as the same written scope - and the run-through's answers ride along with it
   whenever they exist.
--------------------------------------------------------------------------- */

/**
 * The kinds you say rather than attach.
 *
 * A document, an image and a screenshot are files, and they now go in the drop
 * zone where they can actually be handed over. What is left is the note and the
 * link - the two that were only ever a line of text, and always were.
 */
const SAYABLE = ["note", "site"] as const;

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
  const [kind, setKind] = useState<string>("note");
  const [files, setFiles] = useState<Attached[]>([]);

  return (
    /* One column, capped at the reading measure.

       It was two, and the two were saying the same thing: a heading on the left
       telling somebody to say it in their own words, and a heading on the right
       telling them to say it however they would say it, with the box under the
       second one. Split like that the left ran out a third of the way down and
       left a column of empty surface beside a form.

       One column is one instruction, one box, and the things you can attach to
       it - in the order somebody does them. The floor is what the cuts need to
       be cuts, and nothing more. */
    <Stage className="min-h-[380px] w-full">
      {/* One column, down the left.

          It was two - the writing on one side and what you attach to it on the
          other - and the right ran out long before the left did, so the pane
          spent most of its height as an empty half. Stacked, everything is on
          one axis, in the order it is done: write it, attach to it, send it. */}
      <div className="mx-auto max-w-[720px]">
        <div className="min-w-0 text-center [&>h2]:mx-auto [&>p]:mx-auto">
          <H>Say it in your own words.</H>
          <Sub>
            No questions, no order, no structure. Who you are, what you offer,
            and how to get hold of you - it goes exactly as you typed it.
          </Sub>

          <textarea
            rows={12}
            aria-label="Say it in your own words"
            value={answers.text["quick.words"] ?? ""}
            placeholder="What the business does, who it is for, what the website has to do, and anything you already know you want."
            onChange={(event) => setText("quick.words", event.target.value)}
            className="mt-5 w-full resize-y rounded-[14px] border border-border bg-field px-4 py-3 text-[14px] leading-[1.6] text-ink outline-none transition-colors placeholder:text-label focus:border-ink"
          />
        </div>

        <div className="mt-8 min-w-0">
        {/* Files, then the line for the two things that are not files. No
            heading over either: the drop zone says what it is on its face, and
            a title above a control that already carries a label is the same
            words twice. */}
        <DropZone
          className="mt-0"
          label="Drop files here, or choose them"
          note="Pictures, brochures, price lists, screenshots. Up to 10 MB each."
          files={files}
          onAdd={(taken) => {
            setFiles((was) => [...was, ...taken]);
            for (const file of taken) {
              addRef({
                kind: isPicture(file.type) ? REF_KINDS.image : REF_KINDS.file,
                text: file.name,
                where: null,
              });
            }
          }}
          onDrop={(at) =>
            setFiles((was) => was.filter((_, index) => index !== at))
          }
        />

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {SAYABLE.map((key) => (
            <Chip
              key={key}
              on={kind === key}
              title={KIND_WHY[key]}
              onClick={() => setKind(key)}
            >
              {REF_KINDS[key]}
            </Chip>
          ))}
        </div>

        <div className="mt-2.5">
          <AddRow
            placeholder="A sentence, or a link"
            onAdd={(value) =>
              addRef({ kind: REF_KINDS[kind], text: value, where: null })
            }
          />
        </div>

        {answers.refs.length ? (
          <ul className="mt-3 flex flex-col gap-2">
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
        ) : null}

        </div>

        {/* The way out, at the end - where somebody has finished rather than at
            the top where they have not started.

            No rule over it. Space is already saying the same thing, and the
            `lg:col-span-2` it carried was left from when this pane was two
            columns and there was a second one to span. */}
        <div className="mt-8 min-w-0">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Pill
              tone="ink"
              arrow
              className="justify-center sm:justify-start"
              onClick={() => setShort(true)}
            >
              {answers.short
                ? "Sent as a quick submission"
                : "Send it as a quick submission"}
            </Pill>
            <Pill
              className="justify-center sm:justify-start"
              onClick={onCarryOn}
            >
              Carry on through the questions
            </Pill>
          </div>

          <p className="mx-auto mt-3 max-w-[62ch] text-center text-[12.5px] leading-[1.55] text-quiet">
            Nothing is thrown away and nothing is final. It comes back as the
            same written scope, and you can answer the rest at any point.
          </p>
        </div>
      </div>
    </Stage>
  );
}
