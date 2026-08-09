"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  Copy,
  FileText,
  Info,
  ListOrdered,
  MessageSquare,
  Paperclip,
  PencilLine,
  Users,
} from "lucide-react";

import { ASK_PARTS, REF_KINDS } from "@/lib/build/v5";
import { carry } from "@/lib/build/handoff";
import { sendScope, whatIsMissing } from "@/lib/build/submit";
import { askDone } from "@/lib/build/v5-derive";
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
  setSent,
  setShort,
  setText,
  toggleChip,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { isPicture, type Attached } from "@/lib/build/upload";

import { DropZone } from "./drop";
import { CardFlourish, FootFlourish } from "./flourish";
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
  /* Which way in, or neither yet.

     The pane opened with both routes on it: a form, and under the form a band
     offering the other way of filling the same form in. So somebody arriving was
     shown the answer to a question they had not been asked, and had to scroll
     past a screenful of the wrong route to find the right one.

     There is no `full` here. Choosing the structured journey leaves this pane
     for the run-through, which the flow above owns - so this only has to know
     whether the choice has been made and whether it fell this way. */
  const [route, setRoute] = useState<"choose" | "quick">("choose");
  const [kind, setKind] = useState<string>("note");
  const [files, setFiles] = useState<Attached[]>([]);
  /* Opened by pressing send with something still missing, and never closed
     again - somebody who has been asked for their name once should not have
     the field taken away while they look for it. */
  const [asking, setAsking] = useState(false);
  /* Whether send has been pressed and refused. Only then does an empty
     required field turn red: marking one before anybody has tried tells
     somebody they have done something wrong when all they have done is not
     finished yet. */
  const [tried, setTried] = useState(false);

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
      setTried(true);

      /* The first field that is actually stopping it, focused. Told what is
         missing and then left to find it themselves, somebody reads five
         labels; the caret is a better answer than a sentence. */
      requestAnimationFrame(() => {
        const first = FIELDS.find(
          (field) => field.req && !askDone(answers, field.k),
        );
        document
          .getElementById(first ? `quick-ask-${first.k}` : "quick-ask-part")
          ?.scrollIntoView({ block: "center", behavior: "smooth" });
        if (first) document.getElementById(`quick-ask-${first.k}`)?.focus();
      });
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
    /* `scrollKey` moves with what the pane is showing, so pressing send takes
       the reader back to the top of the surface rather than leaving them at
       the foot of a form looking at a button that has changed its label. */
    <Stage
      scrollKey={
        answers.sent
          ? "sent"
          : route === "choose"
            ? "choose"
            : asking
              ? "asking"
              : "quick"
      }
      /* The choice is its own cards on the page, not a surface holding them -
         everything after it is a run-through of one form, which is. */
      tone={
        route === "choose" && !(answers.sent && answers.ref)
          ? "plain"
          : "canvas"
      }
      className="min-h-[380px] w-full"
    >
      {/* The same column every step of the run-through gets.

          The quick pane goes through `Stage` directly rather than through
          `StageStep`, so it never picked up the measure the frame puts on the
          ten steps - it ran edge to edge of the surface while every screen
          beside it was held to 1100 and centred. Two ways in should not be two
          different widths. */}
      {answers.sent && answers.ref ? (
        <Delivered
          answers={answers}
          /* `sent` comes off on the way through.

             It is what makes both this pane and the submit step show their
             confirmation instead of their form, so leaving it on would take
             somebody who asked to add detail to a screen telling them they had
             already finished, with no way to send the fuller version. The
             reference stays, which is what marks the next send as a follow-up
             rather than a second request. */
          onCarryOn={() => {
            setSent(false);
            onCarryOn();
          }}
        />
      ) : route === "choose" ? (
        <Choose onQuick={() => setRoute("quick")} onFull={onCarryOn} />
      ) : (
        <div className="mx-auto w-full max-w-[1320px]">
          {/* Back to the two ways in. A route somebody can only leave by sending
            is a route they were pushed down rather than chose. */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setRoute("choose")}
              className="inline-flex cursor-pointer items-center gap-2 font-mono text-[9.5px] font-bold tracking-[0.16em] text-label uppercase transition-colors hover:text-ink"
            >
              <ArrowLeft aria-hidden className="size-3.5" />
              Both ways in
            </button>
          </div>

          {/* The first of the two, marked rather than titled.

            Both routes used to be two buttons at the foot of one screen - "Send
            it as a quick submission" and "Carry on through the questions" - so
            the page was the quick one and the other was an afterthought beside
            it. They are two ways of doing the same thing, and which is right
            depends on how much prework somebody has done. That is a thing to
            say, not a button to guess at.

            A numbered pill rather than a second heading. The surface already
            carries one heading centred over it, and a route that opens with a
            heading of its own is a page inside a page. */}
          <div className="mt-9 flex justify-center">
            <span className="inline-flex items-center gap-2.5 rounded-pill bg-canvas py-1.5 pr-4 pl-1.5">
              <span
                aria-hidden
                className="flex size-6 items-center justify-center rounded-pill bg-ink font-mono text-[10px] font-bold text-white tabular-nums"
              >
                01
              </span>
              <Kicker className="text-body">Quick submission</Kicker>
            </span>
          </div>

          <p className="mx-auto mt-3.5 max-w-[54ch] text-center text-[15px] leading-[1.5] font-semibold text-ink">
            Use this if you already know roughly what you want.
          </p>

          <p className="mx-auto mt-1.5 max-w-[62ch] text-center text-[13px] leading-[1.6] text-quiet">
            No questions, no order, no structure. It goes exactly as you typed
            it, with anything you want to show us attached to it.
          </p>

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
                      addRef({
                        kind: REF_KINDS[kind],
                        text: value,
                        where: null,
                      })
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
                    bad={tried && field.req && !askDone(answers, field.k)}
                    onChange={(value) => setAsk(field.k, value)}
                  />
                ))}
              </div>

              <div id="quick-ask-part" className="mt-6 scroll-mt-24">
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <b className="text-[13.5px] font-semibold text-ink">
                    What part do you play in this decision
                  </b>
                  <Kicker
                    className={
                      tried && !askDone(answers, "part")
                        ? "text-blocked"
                        : "text-mark"
                    }
                  >
                    Required
                  </Kicker>
                </div>

                <TickSet
                  single
                  options={ASK_PARTS.map((part) => ({
                    k: part.v,
                    label: part.label,
                  }))}
                  isOn={(k: string) => chipOn(answers, "ask.part", k)}
                  onPick={(k: string) =>
                    toggleChip("ask.part", k, true, "submit")
                  }
                />

                {tried && !askDone(answers, "part") ? (
                  <p className="mt-2 text-[12px] leading-[1.4] font-semibold text-blocked">
                    Pick one before this can go.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* The send, under both columns and on their centre line.

            It sat under the left column because it is the next thing in the
            flow after it, which put it against one edge of a surface whose
            heading is centred over the whole of it. */}
          <div className="mt-8 min-w-0 text-center">
            {/* What went wrong, or what is still needed, above the control rather
              than after it has been pressed again. A button that refuses without
              saying why is a button somebody presses four times. */}
            {answers.problem ? (
              <p
                role="alert"
                className="mx-auto mb-5 max-w-[62ch] rounded-[12px] bg-blocked/[0.08] px-4 py-3 text-[13px] leading-[1.6] text-blocked"
              >
                {answers.problem}
              </p>
            ) : asking && missing.length ? (
              <p className="mx-auto mb-5 max-w-[62ch] text-[13px] leading-[1.6] text-quiet">
                Before this can go we need {missing.join(", ").toLowerCase()}.
              </p>
            ) : null}

            {/* "Send", and nothing else on the line.

              It read "Send it as a quick submission", which is the name of the
              section it now stands in - so the button was repeating its own
              heading, and the other route was sitting beside it as though it
              were an equal way of pressing the same thing. */}
            <div className="flex justify-center">
              <Pill
                tone="ink"
                arrow
                className="justify-center"
                disabled={answers.sending}
                onClick={send}
              >
                {answers.sending ? "Sending it" : "Send"}
              </Pill>
            </div>

            <p className="mx-auto mt-4 max-w-[62ch] text-[12.5px] leading-[1.55] text-quiet">
              Nothing is thrown away and nothing is final. Once it has gone you
              can still add to it, or book a time to talk it through.
            </p>

            {/* At the point of collection, not seven links down the footer. This
              pane takes free text, files and contact details, and a privacy
              notice somebody has to go looking for is not one that was
              given. */}
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
      )}
    </Stage>
  );
}

/**
 * It has gone.
 *
 * The whole surface, not a line under a button. What was there was the form with
 * its send turned into the word "Sent" and a sentence added below it - which
 * leaves somebody looking at twelve rows of a thing they have finished, hunting
 * for confirmation in the small print. Sending is the end of a piece of work and
 * it should look like one: the surface clears, and what is left is what they now
 * need.
 *
 * Three things, in the order they matter. That it arrived and what happens next.
 * The reference, which is the one string from this screen that has to survive
 * being closed, and which can be copied because the only reason to show somebody
 * a reference is so they can quote it back. Then the two ways on, side by side
 * and equal, because which one is right depends on how much of a hurry they are
 * in and that is not ours to decide.
 */
function Delivered({
  answers,
  onCarryOn,
}: {
  answers: Answers;
  onCarryOn: () => void;
}) {
  const reference = answers.ref ?? "";
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* No clipboard permission, or an insecure origin. The reference is on the
         screen in full and selectable, which is what it is there for. */
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center py-6 text-center">
      {/* The mark, and the only green thing on the screen. Inside this tool the
          accent means "an answer has been given", and this is the last and
          largest of those. */}
      <span
        aria-hidden
        className="flex size-14 items-center justify-center rounded-pill bg-mark text-white"
      >
        <Check className="size-7" strokeWidth={2.6} />
      </span>

      <Kicker className="mt-5 block">Submitted</Kicker>

      <h2 className="mt-2.5 max-w-[24ch] text-[clamp(25px,3vw,40px)] leading-[1.06] font-extrabold tracking-[-0.035em] text-ink">
        That is with us.
      </h2>

      <p className="mt-4 max-w-[60ch] text-[15.5px] leading-[1.6] text-quiet">
        We will review this and come back to you within two working days.
      </p>

      <p className="mt-2 max-w-[60ch] text-[13px] leading-[1.6] text-label">
        A copy has been sent to your email.
      </p>

      {/* The reference, given the room it is worth. Everything attached is filed
          under it and every reply will carry it. */}
      <div className="mt-7 flex w-full max-w-[34rem] flex-col items-center rounded-[18px] bg-canvas px-6 py-6">
        <Kicker className="block">Your reference</Kicker>

        <div className="mt-2.5 flex items-center gap-3">
          <b className="font-mono text-[clamp(17px,2vw,22px)] leading-none font-bold tracking-[0.02em] text-ink tabular-nums select-all">
            {reference}
          </b>

          <button
            type="button"
            onClick={copy}
            aria-label={`Copy the reference ${reference}`}
            className="flex size-8 flex-none cursor-pointer items-center justify-center rounded-pill bg-field text-quiet transition-colors hover:text-ink"
          >
            {copied ? (
              <Check className="size-4" strokeWidth={3} />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>

        <p
          /* Reserved either way, so the line appearing does not move what is
             under it. */
          aria-live="polite"
          className="mt-2 h-4 text-[11.5px] leading-none text-label"
        >
          {copied ? "Copied." : "Quote it in any reply."}
        </p>
      </div>

      {/* The two ways on.

          Side by side and the same weight. One is for somebody who does not want
          to wait two days and one is for somebody who would rather we knew more
          before we came back, and neither of those is the better answer - so
          neither gets the louder button. */}
      <div className="mt-8 grid w-full gap-4 text-left sm:grid-cols-2">
        <div className="flex min-w-0 flex-col rounded-[18px] bg-canvas p-6">
          <b className="block text-[14.5px] leading-[1.3] font-bold text-ink">
            Cannot wait?
          </b>
          <p className="mt-2 flex-1 text-[12.5px] leading-[1.6] text-quiet">
            Book a meeting with us. It opens on the calendar, already set to go
            through this submission.
          </p>

          <Link
            href={`${ROUTES.book}?mins=30`}
            /* The same handover the submit step makes, so the booking screen
               knows which submission this is about and does not open by asking
               a question it has just been told the answer to. */
            onClick={() =>
              carry({
                ref: reference,
                about: "requirements",
                minutes: 30,
                name: answers.ask.name?.trim() || undefined,
                email: answers.ask.email?.trim() || undefined,
                company: answers.ask.company?.trim() || undefined,
              })
            }
            className="group/book mt-4 inline-flex items-center gap-2 self-start rounded-pill bg-ink px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Book a meeting
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover/book:translate-x-0.5 group-hover/book:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="flex min-w-0 flex-col rounded-[18px] bg-canvas p-6">
          <b className="block text-[14.5px] leading-[1.3] font-bold text-ink">
            Want to add more to your submission?
          </b>
          <p className="mt-2 flex-1 text-[12.5px] leading-[1.6] text-quiet">
            The structured scoping journey asks the ten questions and adds the
            answers to this same submission rather than starting a second one.
            Nothing you have said is lost.
          </p>

          <div className="mt-4 self-start">
            <Pill tone="ink" arrow onClick={onCarryOn}>
              Add more detail
            </Pill>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The chooser.
 *
 * Two doors and a way round the back of both. It was two cards, one white and
 * one nearly black, with the whole card as the button - which was a strong idea
 * and two weak consequences: the dark one read as the recommended one when
 * neither is, and a card that is itself a control has nowhere to put a second
 * one.
 *
 * Both are light now and they are told apart by colour rather than by weight -
 * blue for the one you write yourself, green for the one we ask. Neither is
 * heavier than the other, which is the honest arrangement for a choice with no
 * right answer.
 *
 * And the meeting is out of the pair entirely. It used to be a third thing
 * competing with them; below the two, on its own surface, it is what it actually
 * is - the way in for somebody who does not want to write anything yet.
 *
 * No width cap of its own. The pane around this already holds it to 1320, and a
 * second smaller cap inside that one reads as a narrower panel inserted into a
 * wider one - which puts the decoration in the middle of the surface rather than
 * at its edges, and the edges are the only place it belongs.
 */
function Choose({
  onQuick,
  onFull,
}: {
  onQuick: () => void;
  onFull: () => void;
}) {
  return (
    <div className="relative w-full">
      {/* Held to the same measure the pane around it is, and centred. */}
      <div className="relative mx-auto w-full max-w-[1320px] px-2 sm:px-8">
        {/* The lockup, and the one place on this panel the name is set.

            The header carries it and so does the foot of the page, so a third
            setting has to earn itself. It does here: this panel is the front door
            of the whole tool and somebody may well have arrived straight at it. */}
        <div className="relative flex items-center justify-center gap-3.5">
          <Image
            src="/assets/logo.png"
            alt=""
            width={96}
            height={96}
            aria-hidden
            draggable={false}
            sizes="96px"
            className="size-9 flex-none object-contain sm:size-11"
          />
          <span className="text-[clamp(20px,2.2vw,29px)] leading-none font-extrabold tracking-[0.16em] text-ink uppercase">
            TwinLoom
          </span>
        </div>

        <div className="relative mt-7 min-w-0 text-center">
          <H>Choose how you want to start.</H>
          <Sub>
            Two ways to brief, plus a fast way to talk. No commitment, just the
            right starting point for you.
          </Sub>
        </div>

        <div className="relative mt-9 grid gap-4 lg:grid-cols-2">
          <Door
            n="01"
            kicker="Open brief"
            tone="blue"
            title="Write it in your own words."
            notes={[
              "Send us whatever you have, however you have it: a finished brief, bullet points, rough notes, ideas, links or files. There is no format to follow.",
              "Can be done in less than five minutes, or you can take your time. If you want to move to the guided brief at any point you will be given the option to switch, and anything you have already written is saved as a note.",
            ]}
            facts={[
              { icon: MessageSquare, say: "Any format" },
              { icon: Paperclip, say: "Attach anything" },
              { icon: Clock, say: "Less than 5 minutes" },
            ]}
            go="Write your brief"
            onClick={onQuick}
          />

          <Door
            n="02"
            kicker="Guided brief"
            tone="green"
            title="Let us guide the brief."
            notes={[
              "Answer a few guided questions and we will shape the brief with context, clarity and depth.",
              "You have the option to add as many notes as you want, and you can also send us any files, links or attachments you want us to take a look at.",
            ]}
            facts={[
              { icon: ListOrdered, say: "Guided questions" },
              { icon: PencilLine, say: "Add notes" },
              { icon: FileText, say: "Send files" },
            ]}
            go="Start the guided journey"
            onClick={onFull}
          />
        </div>

        {/* What happens after either of them, said once rather than twice.

            It belongs to both doors, so it sits under both rather than being
            repeated inside each - and a line that appears in two cards is a line
            people read as two different promises. */}
        <p className="mt-4 flex items-start justify-center gap-3 rounded-card bg-field px-5 py-4 text-center text-[13px] leading-[1.6] text-quiet">
          <Info
            aria-hidden
            className="mt-0.5 size-4 flex-none text-idx"
            strokeWidth={2}
          />
          <span className="max-w-[92ch]">
            As part of your submission you can either book a meeting or simply
            share a few time slots that suit you. We will review your brief and
            reach out to arrange the next conversation.
          </span>
        </p>

        {/* The third way, on a surface of its own.

            Not a door, because it is not a brief: it is the way in for somebody
            who would rather talk first, and standing it beside the other two as
            an equal turns a choice of two into a choice of three. Under them, on
            its own surface, it is what it actually is.

            Four columns on a wide card and one on a narrow one, with the rule
            between the paragraph and the list - the two are a claim and the
            three things that make it good, which is a caption's relationship and
            a caption is set off by a line. */}
        <div className="mt-4 rounded-card bg-field px-6 py-7 sm:px-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.8fr)_auto] lg:items-center lg:gap-9">
            <div className="flex min-w-0 items-start gap-5">
              <span
                aria-hidden
                className="relative hidden size-[72px] flex-none items-center justify-center rounded-pill border border-hair sm:flex"
              >
                <CalendarDays className="size-7 text-ink" strokeWidth={1.7} />
                <span className="absolute top-1 right-1 size-3 rounded-pill bg-[#1a4bff]" />
              </span>

              <div className="min-w-0">
                <b className="block text-[clamp(17px,1.5vw,21px)] leading-[1.15] font-extrabold tracking-[-0.03em] text-ink">
                  Prefer to talk first?
                </b>
                <p className="mt-2 max-w-[52ch] text-[13px] leading-[1.6] text-quiet">
                  You can book a meeting without completing a brief first. As
                  part of the booking you will have space to add a few lines
                  about what you have in mind and what you would like to
                  discuss, so we can prepare before the call.
                </p>
              </div>
            </div>

            <span
              aria-hidden
              className="hidden w-px self-stretch bg-hair lg:block"
            />

            <ul className="flex flex-col gap-3">
              {[
                {
                  icon: MessageSquare,
                  say: "Tell us briefly what you have in mind",
                },
                {
                  icon: CalendarDays,
                  say: "Choose a 15, 30 or 60 minute meeting",
                },
                { icon: Users, say: "We will prepare before the call" },
              ].map((line) => (
                <li
                  key={line.say}
                  className="flex items-center gap-3 text-[13px] leading-[1.5] text-body"
                >
                  <line.icon
                    aria-hidden
                    className="size-4 flex-none text-idx"
                    strokeWidth={1.9}
                  />
                  {line.say}
                </li>
              ))}
            </ul>

            <Link
              href={ROUTES.book}
              className="group/book inline-flex items-center justify-center gap-2 rounded-pill border border-hair bg-field px-6 py-3.5 text-[14.5px] font-semibold whitespace-nowrap text-ink transition-colors hover:border-ink lg:justify-self-end"
            >
              Book a meeting
              <CalendarDays aria-hidden className="size-4" strokeWidth={1.9} />
            </Link>
          </div>
        </div>

        {/* The closing line, with the rule running out either side of it. */}
        <div className="relative mt-7 flex items-center justify-center gap-4">
          <FootFlourish side="left" />

          <span className="flex flex-none items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt=""
              width={64}
              height={64}
              aria-hidden
              draggable={false}
              sizes="64px"
              className="size-6 flex-none object-contain"
            />
            <span className="max-w-[62ch] text-center text-[12.5px] leading-[1.6] text-label">
              Start whichever way suits you. Everything you share stays together
              as your brief develops.
            </span>
          </span>

          <FootFlourish side="right" />
        </div>
      </div>
    </div>
  );
}

/**
 * One of the two doors.
 *
 * One shape and two colours, and the colour is the only thing that separates
 * them. It was one white card and one nearly black, which said the dark one was
 * the one to take - and neither of these is. Blue for the brief you write and
 * green for the brief we ask; same weight, same size, same everything else.
 *
 * The whole card was the button and it is not any more. A card that is a control
 * cannot hold a control, and this one now has three facts and a button inside
 * it, so pressing the card and pressing the button would be one action with two
 * targets. The button is the target and the card is a card.
 */
function Door({
  n,
  kicker,
  tone,
  title,
  notes,
  facts,
  go,
  onClick,
}: {
  n: string;
  kicker: string;
  tone: "blue" | "green";
  title: string;
  notes: readonly string[];
  facts: readonly { icon: typeof FileText; say: string }[];
  go: string;
  onClick: () => void;
}) {
  const blue = tone === "blue";

  return (
    <div className="relative flex min-w-0 flex-col overflow-hidden rounded-card bg-field px-6 py-7 sm:px-8">
      <CardFlourish />

      <div className="relative flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "flex size-8 items-center justify-center rounded-pill font-mono text-[11px] font-bold text-white tabular-nums",
            blue ? "bg-[#1a4bff]" : "bg-[#0f9d58]",
          )}
        >
          {n}
        </span>

        <Kicker
          className={cn(
            "rounded-pill px-3 py-1.5",
            blue
              ? "bg-[#1a4bff]/10 text-[#1a4bff]"
              : "bg-[#0f9d58]/10 text-[#0b7c45]",
          )}
        >
          {kicker}
        </Kicker>
      </div>

      <b className="relative mt-5 block text-[clamp(20px,2.1vw,27px)] leading-[1.12] font-extrabold tracking-[-0.03em] text-ink">
        {title}
      </b>

      {notes.map((note) => (
        <p
          key={note}
          className="relative mt-3.5 max-w-[52ch] text-[13.5px] leading-[1.62] text-quiet"
        >
          {note}
        </p>
      ))}

      {/* Pushed to the foot, so two cards with different amounts to say still
          line their buttons up. */}
      <div className="relative mt-auto pt-7">
        <div className="flex flex-wrap gap-2">
          {facts.map((fact) => (
            <span
              key={fact.say}
              className={cn(
                "inline-flex items-center gap-2 rounded-pill px-3.5 py-2 text-[12.5px] font-semibold",
                blue
                  ? "bg-[#1a4bff]/8 text-[#1a4bff]"
                  : "bg-[#0f9d58]/8 text-[#0b7c45]",
              )}
            >
              <fact.icon aria-hidden className="size-4" strokeWidth={1.9} />
              {fact.say}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onClick}
          className={cn(
            "group/go mt-5 flex w-full cursor-pointer items-center justify-between gap-3 rounded-pill px-6 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90",
            blue
              ? "bg-[linear-gradient(90deg,#1a4bff_0%,#1fa7ff_100%)]"
              : "bg-[linear-gradient(90deg,#0b7c45_0%,#12a862_100%)]",
          )}
        >
          <span className="flex-1 text-center">{go}</span>
          <ArrowRight
            aria-hidden
            className="size-[18px] flex-none transition-transform group-hover/go:translate-x-0.5"
            strokeWidth={2.2}
          />
        </button>
      </div>
    </div>
  );
}
