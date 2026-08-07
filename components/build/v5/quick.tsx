"use client";

import { useState } from "react";
import Link from "next/link";

import { ASK_PARTS, REF_KINDS } from "@/lib/build/v5";
import { sendScope, whatIsMissing } from "@/lib/build/submit";
import { ROUTES } from "@/lib/site";
import {
  addRef,
  chipOn,
  dropRef,
  setAsk,
  setDelivered,
  setLike,
  setProblem,
  setSending,
  setShort,
  setText,
  toggleChip,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { isPicture, type Attached } from "@/lib/build/upload";

import { DropZone } from "./drop";
import {
  AddRow,
  Chip,
  Field,
  H,
  Kicker,
  Pill,
  RefText,
  Sub,
  TickSet,
} from "./kit";
import { FIELDS } from "./stages-c";
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
  /* Opened by pressing send with something still missing, and never closed
     again - somebody who has been asked for their name once should not have
     the field taken away while they look for it. */
  const [asking, setAsking] = useState(false);

  const missing = whatIsMissing(answers);

  /**
   * Send it.
   *
   * The button used to call `setShort(true)` and nothing else, which set a
   * flag on the desk saying the short way had been taken and never posted
   * anything anywhere. It sends now - and where the four things a submission
   * cannot go without are not there yet, it asks for them rather than
   * refusing.
   */
  async function send() {
    if (answers.sending) return;

    if (missing.length) {
      setAsking(true);
      return;
    }

    setShort(true);
    setSending(true);

    const result = await sendScope(answers);
    if (result.ok) setDelivered(result.ref);
    else setProblem(result.problem);
  }

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
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="min-w-0">
          <H>Say it in your own words.</H>
          <Sub>
            No questions, no order, no structure. Who you are, what you offer,
            and how to get hold of you - it goes exactly as you typed it.
          </Sub>
        </div>

        {/* `items-stretch`, not `items-start`.

            The writing box was already told to grow into its column, but
            `items-start` sized both columns to their own content, so the
            column never grew and there was nothing to grow into. Every file
            and note added to the right made the two halves finish further
            apart. Stretched, the row is as tall as its tallest column and the
            box takes the rest. */}
        <div className="mt-7 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* The writing. `flex-1` on the box rather than a row count, so it
              grows to whatever the column beside it needs and the two halves
              end level. */}
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
              {/* Centred over the field they switch. The drop zone above and
                  the row below both take the whole column, so a pair of chips
                  against the left edge was the one thing in it starting
                  somewhere else. */}
              <div className="flex flex-wrap items-center justify-center gap-2">
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
              <ul className="mt-3 flex flex-col gap-1.5">
                {answers.refs.map((ref) => (
                  <li
                    key={ref.n}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-[10px] bg-canvas px-3 py-1.5"
                  >
                    <Kicker className="w-[64px] flex-none">{ref.kind}</Kicker>
                    <span className="min-w-[12ch] flex-1 text-[13px] leading-[1.35] text-ink">
                      <RefText text={ref.text} />
                    </span>
                    <input
                      value={answers.like[ref.n] ?? ""}
                      placeholder="What you like about it"
                      onChange={(event) => setLike(ref.n, event.target.value)}
                      className={cn(
                        "h-7 w-full rounded-field border border-border bg-field px-2.5 text-[12px] text-ink outline-none transition-colors",
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
        {/* Who is asking, once pressing send has shown that we do not know.

            Not a field on the screen from the start: the whole offer of this
            pane is that you write a paragraph and go. Asked at the moment it
            actually blocks something, it is four fields filled in by somebody
            who has already decided to send. */}
        {asking && !answers.sent ? (
          <div className="mx-auto mt-9 w-full max-w-[720px] rounded-[18px] bg-canvas p-5 text-left sm:p-6">
            <b className="block text-[15px] leading-[1.25] font-extrabold tracking-[-0.02em] text-ink">
              Who is asking
            </b>
            <p className="mt-1.5 text-[12.5px] leading-[1.5] text-label">
              The only part about you, and the only part we cannot do without.
            </p>

            <div className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <Field
                  key={field.k}
                  id={`quick-ask-${field.k}`}
                  label={field.label}
                  required={field.req}
                  why={field.why}
                  type={field.k === "email" ? "email" : "text"}
                  value={answers.ask[field.k] ?? ""}
                  onChange={(value) => setAsk(field.k, value)}
                />
              ))}
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <b className="text-[13.5px] font-semibold text-ink">
                  What part do you play in this decision
                </b>
                <Kicker className="text-mark">Required</Kicker>
              </div>

              <TickSet
                single
                options={ASK_PARTS.map((part) => ({
                  k: part.v,
                  label: part.label,
                }))}
                isOn={(k: string) => chipOn(answers, "ask.part", k)}
                onPick={(k: string) => toggleChip("ask.part", k, true, "submit")}
              />
            </div>
          </div>
        ) : null}

        {/* The way out, under both columns and on their centre line.

            It sat under the left column because it is the next thing in the
            flow after it, which put a pair of buttons and two lines of small
            print against one edge of a surface whose heading is centred over
            the whole of it. */}
        <div className="mt-8 min-w-0 text-center">
          {/* What went wrong, or what is still needed, above the control
              rather than after it has been pressed again. A button that
              refuses without saying why is a button somebody presses four
              times. */}
          {answers.problem ? (
            <p
              role="alert"
              className="mx-auto mb-5 max-w-[62ch] rounded-[12px] bg-blocked/[0.08] px-4 py-3 text-[13px] leading-[1.6] text-blocked"
            >
              {answers.problem}
            </p>
          ) : asking && missing.length ? (
            <p className="mx-auto mb-5 max-w-[62ch] text-[13px] leading-[1.6] text-quiet">
              Before this can go we need{" "}
              {missing.join(", ").toLowerCase()}.
            </p>
          ) : null}

          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Pill
              tone="ink"
              arrow
              className="justify-center sm:justify-start"
              disabled={answers.sending}
              onClick={send}
            >
              {answers.sent
                ? "Sent"
                : answers.sending
                  ? "Sending it"
                  : "Send it as a quick submission"}
            </Pill>
            <Pill
              className="justify-center sm:justify-start"
              onClick={onCarryOn}
            >
              Carry on through the questions
            </Pill>
          </div>

          {answers.sent && answers.ref ? (
            <p className="mx-auto mt-4 max-w-[62ch] text-[13px] leading-[1.6] text-body">
              It is with us. Your reference is{" "}
              <b className="font-mono font-bold text-ink">{answers.ref}</b> -
              quote it in any reply and everything you attached is filed under
              it.
            </p>
          ) : (
            <>
              <p className="mx-auto mt-4 max-w-[62ch] text-[12.5px] leading-[1.55] text-quiet">
                Nothing is thrown away and nothing is final. It comes back as
                the same written scope, and you can answer the rest at any
                point.
              </p>

              {/* At the point of collection, not seven links down the footer.
                  This pane takes free text, files and contact details, and a
                  privacy notice somebody has to go looking for is not one that
                  was given. */}
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
            </>
          )}
        </div>
      </div>
    </Stage>
  );
}
