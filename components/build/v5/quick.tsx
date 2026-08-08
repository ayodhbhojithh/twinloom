"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  ListOrdered,
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
          No questions, no order, no structure. It goes exactly as you typed it,
          with anything you want to show us attached to it.
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
                onPick={(k: string) => toggleChip("ask.part", k, true, "submit")}
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
            Nothing is thrown away and nothing is final. Once it has gone you can
            still add to it, or book a time to talk it through.
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
 * The two ways in, and nothing else.
 *
 * What opened here before was one of them with the other underneath it: a form,
 * and below the form a band offering the other way of filling the same form in.
 * Somebody arriving was given the answer to a question nobody had asked them,
 * and had to scroll a screenful of the wrong route to reach the right one.
 *
 * So the choice comes first and it is the whole screen. Two doors, the same
 * shape, and the only thing that separates them is which of the two it makes
 * sense for you to walk through: one is for somebody who already knows what they
 * want, the other for somebody who would rather be asked.
 *
 * The whole card presses. A card with a button in the corner of it is two
 * targets for one decision, and the smaller of them is the one people aim at.
 */
function Choose({
  onQuick,
  onFull,
}: {
  onQuick: () => void;
  onFull: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <div className="min-w-0">
        <H>Send us your requirements.</H>
        <Sub>
          Two ways in, and they end in the same place. Write it out yourself, or
          let us ask the questions.
        </Sub>
      </div>

      <div className="mt-9 grid gap-4 lg:grid-cols-2">
        <Door
          n="01"
          kicker="Quick submission"
          icon={FileText}
          title="Write it out yourself."
          note="Use this if you already know roughly what you want. One box, no questions and no order - it goes exactly as you typed it, with anything you want to show us attached."
          facts={["One box", "Attach anything", "About two minutes"]}
          go="Write it out"
          onClick={onQuick}
        />

        <Door
          ink
          n="02"
          kicker="Structured scoping journey"
          icon={ListOrdered}
          title="Let us ask the questions."
          note="Use this if you would rather be asked. It starts with your organisation and industry, and the panel beside it shows the site your answers describe while you answer them."
          facts={["10 steps", "Nothing compulsory", "Stop and send at any point"]}
          go="Start with your organisation and industry"
          onClick={onFull}
        />
      </div>

      <p className="mx-auto mt-6 max-w-[64ch] text-center text-[12px] leading-[1.6] text-label">
        Neither is the better answer and neither commits you to anything. Send
        the quick one and the questions are still there afterwards, under the
        same reference.
      </p>
    </div>
  );
}

/**
 * One of the two doors.
 *
 * One shape, two tones, and the tone is the design rather than decoration: the
 * quick route is a blank sheet of paper and the structured one is the tool, so
 * one is white and open and the other dark and led. Nobody has to be told which
 * is which.
 *
 * The numeral is set large and faint behind the words, clipped by the corner it
 * stands in, so it reads as a figure printed on the card rather than a label
 * stuck to it. It says nothing the pill does not, which is why it can be that
 * quiet.
 */
function Door({
  n,
  kicker,
  icon: Icon,
  title,
  note,
  facts,
  go,
  onClick,
  ink,
}: {
  n: string;
  kicker: string;
  icon: typeof FileText;
  title: string;
  note: string;
  facts: readonly string[];
  go: string;
  onClick: () => void;
  ink?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/door relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[24px] px-6 py-8 text-center transition-colors sm:px-8",
        ink ? "bg-ink" : "bg-canvas hover:bg-canvas-firm",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-8 -left-3 font-mono text-[148px] leading-none font-bold tabular-nums select-none",
          ink ? "text-white/6" : "text-ink/4",
        )}
      >
        {n}
      </span>

      <span className="relative flex flex-col items-center">
        <span
          aria-hidden
          className={cn(
            "flex size-11 items-center justify-center rounded-pill",
            ink ? "bg-white/10 text-white" : "bg-field text-ink",
          )}
        >
          <Icon className="size-5" strokeWidth={2} />
        </span>

        <span
          className={cn(
            "mt-4 inline-flex items-center gap-2.5 rounded-pill py-1.5 pr-4 pl-1.5",
            ink ? "bg-white/10" : "bg-field",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "flex size-6 items-center justify-center rounded-pill font-mono text-[10px] font-bold tabular-nums",
              ink ? "bg-white text-ink" : "bg-ink text-white",
            )}
          >
            {n}
          </span>
          <Kicker className={ink ? "text-white/70" : "text-body"}>
            {kicker}
          </Kicker>
        </span>

        <b
          className={cn(
            "mt-5 block text-[clamp(20px,2.2vw,28px)] leading-[1.12] font-extrabold tracking-[-0.03em]",
            ink ? "text-white" : "text-ink",
          )}
        >
          {title}
        </b>

        <span
          className={cn(
            "mx-auto mt-3.5 block max-w-[46ch] text-[13px] leading-[1.65]",
            ink ? "text-white/65" : "text-quiet",
          )}
        >
          {note}
        </span>

        <span className="mt-6 flex flex-wrap justify-center gap-2">
          {facts.map((fact) => (
            <span
              key={fact}
              className={cn(
                "rounded-pill px-3.5 py-1.5 text-[12px] font-semibold",
                ink ? "bg-white/8 text-white/75" : "bg-field text-body",
              )}
            >
              {fact}
            </span>
          ))}
        </span>

        {/* Drawn as a control, but it is not one: the card is the button, and a
            real button inside it would be a second target for one decision. */}
        <span
          className={cn(
            "mt-7 inline-flex items-center gap-2.5 rounded-pill px-5 py-2.5 text-[13.5px] font-semibold transition-opacity group-hover/door:opacity-90",
            ink ? "bg-white text-ink" : "bg-ink text-white",
          )}
        >
          {go}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover/door:translate-x-0.5"
            strokeWidth={2.4}
          />
        </span>
      </span>
    </button>
  );
}
