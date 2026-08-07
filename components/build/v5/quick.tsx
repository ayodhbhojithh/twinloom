"use client";

import { useState } from "react";
import Link from "next/link";

import { REF_KINDS } from "@/lib/build/v5";
import { ROUTES } from "@/lib/site";
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
import { AddRow, Chip, H, Kicker, Pill, RefText, Sub } from "./kit";
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
    /* One instruction over two columns.

       Writing on the left, everything you hand over on the right. Stacked, the
       page was a tall box with a drop zone somewhere below the fold, and the
       two halves of one answer read as two separate jobs.

       The heading stays over both rather than over either: it is the question
       the whole pane is asking, and putting it above one column would make the
       other look like an afterthought. That is what went wrong the last time
       this was two columns - each half had a heading of its own, and the two
       were saying the same thing. */
    <Stage className="min-h-[380px] w-full">
      {/* The same column every step of the run-through gets.

          The quick pane goes through `Stage` directly rather than through
          `StageStep`, so it never picked up the measure the frame puts on the
          ten steps - it ran edge to edge of the surface while every screen
          beside it was held to 1100 and centred. Two ways in should not be two
          different widths. */}
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="min-w-0">
          <H>Say it in your own words.</H>
          <Sub>
            No questions, no order, no structure. Who you are, what you offer,
            and how to get hold of you - it goes exactly as you typed it.
          </Sub>
        </div>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          {/* The writing. `flex-1` on the box rather than a row count, so on a
              wide screen it grows to whatever the column beside it needs and
              the two halves end level. */}
          <div className="flex min-w-0 flex-col">
            <textarea
              rows={12}
              aria-label="Say it in your own words"
              value={answers.text["quick.words"] ?? ""}
              placeholder="What the business does, who it is for, what the website has to do, and anything you already know you want."
              onChange={(event) => setText("quick.words", event.target.value)}
              className="min-h-[280px] w-full flex-1 resize-y rounded-[14px] border border-border bg-field px-4 py-3 text-[14px] leading-[1.6] text-ink outline-none transition-colors placeholder:text-label focus:border-ink"
            />
          </div>

          <div className="min-w-0">
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
                    kind: isPicture(file.type)
                      ? REF_KINDS.image
                      : REF_KINDS.file,
                    text: file.name,
                    where: null,
                    url: file.url,
                    publicId: file.publicId,
                  });
                }
              }}
              onDrop={(at) =>
                setFiles((was) => was.filter((_, index) => index !== at))
              }
            />

            {/* The chips over the row they change.

                On one line the two shared a column with the drop zone and the
                field was left about a third of it - wide enough for a link and
                not for a sentence. Given a line each, the field is the width
                of the column and the chips still sit directly above what they
                switch. */}
            <div className="mt-3">
              <div className="flex flex-wrap items-center gap-2">
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

              {/* The field follows the chip. One placeholder for both said
                  "a sentence, or a link" and then took either as text, so a
                  website was filed under a label saying Website and never
                  became one. */}
              <div className="mt-2.5">
                <AddRow
                  key={kind}
                  kind={kind === "site" ? "url" : "text"}
                  label={kind === "site" ? "A website address" : "A sentence"}
                  placeholder={
                    kind === "site"
                      ? "twinloom.com"
                      : "A sentence you want kept in your words"
                  }
                  onAdd={(value) =>
                    addRef({ kind: REF_KINDS[kind], text: value, where: null })
                  }
                />
              </div>
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
                      <RefText text={ref.text} />
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
        </div>

        {/* The way out, under both columns - where somebody has finished
            rather than at the top where they have not started.

            No rule over it. Space is already saying the same thing. */}
        {/* The way out, under both columns and on their centre line.

            It sat under the left column because it is the next thing in the
            flow after it, which put a pair of buttons and two lines of small
            print against one edge of a surface whose heading is centred over
            the whole of it. */}
        <div className="mt-8 min-w-0 text-center">
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

          <p className="mx-auto mt-4 max-w-[62ch] text-[12.5px] leading-[1.55] text-quiet">
            Nothing is thrown away and nothing is final. It comes back as the
            same written scope, and you can answer the rest at any point.
          </p>

          {/* At the point of collection, not seven links down the footer. This
              pane takes free text, files and contact details, and a privacy
              notice somebody has to go looking for is not one that was given. */}
          <p className="mx-auto mt-2 max-w-[62ch] text-[12px] leading-[1.55] text-label">
            What happens to your details is set out in our{" "}
            <Link
              href={ROUTES.privacy}
              className="font-semibold text-body underline decoration-hair underline-offset-2 transition-colors hover:text-mark hover:decoration-mark"
            >
              Privacy notice
            </Link>
            .
          </p>
        </div>
      </div>
    </Stage>
  );
}
