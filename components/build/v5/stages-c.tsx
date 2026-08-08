"use client";

import { ArrowUpRight, Check, Send } from "lucide-react";
import Link from "next/link";

import { ASK_PARTS, MIN_MAP, STATES } from "@/lib/build/v5";
import { readiness } from "@/lib/build/v5-derive";
import { OPTION_LISTS } from "@/lib/build/v5-options";
import { HOW_WE_WORK } from "@/lib/build/v5-work";
import { sendScope, whatIsMissing } from "@/lib/build/submit";
import {
  addRef,
  chipOn,
  isOn,
  setAsk,
  setPick,
  setDelivered,
  setProblem,
  setSending,
  setSent,
  toggleChip,
  touchStep,
  type Answers,
} from "@/lib/build/v5-store";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

import { StageStep } from "./frame";
import {
  AddRow,
  Field,
  H,
  Kicker,
  Pill,
  Sub,
  SubTitle,
  TickRow,
  TickSet,
} from "./kit";
import { Disc } from "./stage";

/* ---------------------------------------------------------------------------
   The end of the run: four fields and a button.

   There was a read-back before it - the whole scope as a document, with a
   front, a numbered contents and three statistics. It is gone. A report handed
   over at the finish tells somebody what they have already done, at the one
   moment they have stopped wanting to know; the running panel says the same
   thing on every screen, while there is still something to be done about it.

   So this is the only compulsory part of the whole run, and it is four fields
   and a button. Every step before it can send straight here.
--------------------------------------------------------------------------- */

type StepProps = {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
  onGoKey: (key: string) => void;
};

/* --------------------------------------------------------------- 10 asking */

export const FIELDS = [
  {
    k: "name",
    label: "Your name",
    req: true,
    why: "So the reply has somebody to go to.",
  },
  {
    k: "company",
    label: "Company",
    req: true,
    why: "So we can look at what exists before we call.",
  },
  {
    k: "email",
    label: "Email",
    req: true,
    why: "Where your scoping request is sent.",
  },
  {
    k: "phone",
    label: "Phone",
    req: false,
    why: "Only if a reply bounces or a meeting moves.",
  },
  {
    k: "when",
    label: "When do you need it live",
    req: false,
    why: "It changes the order of the work, not the price.",
  },
] as const;

/* ----------------------------------------------------------------- 11 keep */

/* --------------------------------------------------------------- 12 submit */

/** The length chosen for the meeting, or the half hour we would suggest. */
const heldFor = (answers: Answers) =>
  [15, 30, 45, 60].find((length) =>
    chipOn(answers, "talk.len", String(length)),
  ) ?? 30;

const MINIMUMS = [
  {
    k: "who",
    title: "Who the site is for",
    why: "At least one group named, or the quick way round taken.",
  },
  {
    k: "do",
    title: "What people do there",
    why: "One thing beyond the standard inclusions, told to us on purpose.",
  },
  {
    k: "sell",
    title: "The shop's front door, if there is one",
    why: "If you picked buying: what you sell, roughly how much of it.",
  },
  {
    k: "you",
    title: "A way to reach you",
    why: "Name, company, your part in it, and an email address.",
  },
] as const;

export function StageSubmit({ at, answers, onGo, onGoKey }: StepProps) {
  const { met, state } = readiness(answers);
  const missing = whatIsMissing(answers);

  /* One send, shared by the disc in the corner cut and the pill at the foot.
     They are the same action in two places, and two copies of it would be two
     chances to guard it differently. */
  const send = async () => {
    if (answers.sending) return;
    setSending(true);
    const result = await sendScope(answers);
    if (result.ok) setDelivered(result.ref);
    else setProblem(result.problem);
  };
  const [stateName, stateNote] = STATES[state];
  const talk = OPTION_LISTS.submit[0];

  if (answers.sent) {
    return (
      /* `scrollKey` so the surface takes the reader back to its own top.

         Sending replaces the step's contents without changing which step it
         is, so the key `StageStep` builds from the step alone did not move -
         and somebody who pressed send at the foot of a long form was left
         looking at the bottom of a screen whose whole message is at the top.
         Giving the sent state a key of its own is the one thing that tells the
         surface something changed. */
      <StageStep
        at={at}
        answers={answers}
        onGo={onGo}
        corner={null}
        scrollKey="sent"
      >
        {/* The whole screen on one centre line.

            The heading and its line are centred by the kit, and everything
            round them was left against the edge - so a confirmation with six
            things on it had the two in the middle and the four beside them,
            which reads as a screen that has come apart rather than one that
            has finished.

            The badge is in a block of its own so it can be given a margin.
            Inline, the only thing between it and the heading was the leading
            of its own line box - about six pixels under a 27px extrabold line,
            which read as the two being one lump rather than a mark and the
            sentence it introduces. */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-pill bg-mark/[0.08] py-1.5 pr-4 pl-3">
              <span aria-hidden className="size-2 rounded-pill bg-mark" />
              <Kicker className="text-mark">Sent</Kicker>
            </span>
          </div>

          <H>We read it. All of it.</H>
          <Sub>
            Including the parts in your own words, which are usually the useful
            part. Two or three questions come back in writing, within two
            working days.
          </Sub>

          {/* The reference, quoted back. It is the one thing somebody wants
              from a confirmation screen that they cannot work out for
              themselves, and the one thing worth writing down. */}
          {answers.ref ? (
            <p className="mt-6 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
              <Kicker>Your reference</Kicker>
              <b className="font-mono text-[15px] font-bold tracking-[0.08em] text-ink tabular-nums">
                {answers.ref}
              </b>
            </p>
          ) : null}

          <p className="mx-auto mt-5 max-w-[58ch] text-[13.5px] leading-[1.5] text-quiet sm:text-[14px]">
            Your answers are still here and still yours - keep changing them and
            send it again, and the newer one is the one we read.
          </p>

          <div className="mt-7 flex justify-center">
            <Pill onClick={() => setSent(false)}>Keep answering</Pill>
          </div>
        </div>
      </StageStep>
    );
  }

  return (
    <StageStep
      at={at}
      answers={answers}
      onGo={onGo}
      corner={
        <Disc
          label={answers.sending ? "Sending" : "Send my scoping request"}
          tone="ink"
          disabled={answers.sending || missing.length > 0}
          onClick={send}
        >
          <Send className="size-4" strokeWidth={2.2} />
        </Disc>
      }
    >
      <H>Send it.</H>
      <Sub>
        You can send at any point - what changes is what we can do with what
        arrives. No bar, no percentage, no grade.
      </Sub>

      {/* Who is asking, on the step that sends rather than on one of its own.

          It was a step, and a step made of four fields is a page somebody has
          to walk through before they are allowed to finish. Asked here, they
          are filled in by the person who has already decided to send it, which
          is the only moment any of it is worth knowing. */}
      <section className="mt-6 mx-auto max-w-[720px]">
        <SubTitle className="mt-0">Who is asking</SubTitle>
        <p className="mt-0.5 text-[12.5px] leading-[1.45] text-label">
          The only part about you, and the only part we cannot do without. Four
          fields, and two of them are not required at all.
        </p>

        <div className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <Field
              key={field.k}
              id={`ask-${field.k}`}
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

          <p className="mt-2 text-[12px] leading-[1.5] text-label">
            So the first call is the right length. Never shown back to you as a
            grade.
          </p>
        </div>
      </section>

      {/* Where it stands, and the named things still missing, each a link
          straight to its question. */}
      <section className="mt-6 mx-auto max-w-[720px] rounded-[16px] bg-canvas p-5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={cn(
              "size-2.5 rounded-pill",
              state === "ready"
                ? "bg-mark"
                : state === "near"
                  ? "bg-quiet"
                  : "bg-planned",
            )}
          />
          <b className="text-[15.5px] font-bold text-ink">{stateName}</b>
        </div>
        <p className="mt-1.5 text-[13px] leading-[1.5] text-quiet">
          {stateNote}
        </p>

        <ul className="mt-4 flex flex-col border-t border-hair">
          {MINIMUMS.map((minimum) => {
            const value = met[minimum.k as keyof typeof met];
            const done = Boolean(value);

            return (
              <li
                key={minimum.k}
                className="border-b border-hair last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => onGoKey(MIN_MAP[minimum.k])}
                  className="group/min flex w-full cursor-pointer items-center gap-3 py-2.5 text-left"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-[19px] flex-none items-center justify-center rounded-pill border-2",
                      done
                        ? "border-mark bg-mark text-white"
                        : "border-planned text-transparent",
                    )}
                  >
                    <Check className="size-[11px]" strokeWidth={3.2} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <b className="block text-[13.5px] leading-[1.25] font-semibold text-ink">
                      {minimum.title}
                      {value === "na" ? (
                        <span className="ml-2 font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase">
                          Not yours to answer
                        </span>
                      ) : null}
                    </b>
                    <span className="mt-0.5 block text-[12px] leading-[1.4] text-label">
                      {minimum.why}
                    </span>
                  </span>

                  {/* The arrow alone. The whole row is the control and it
                      already names what it goes to, so "take me to it" was a
                      caption on a door saying door - four times over. */}
                  <ArrowUpRight
                    aria-hidden
                    className="size-3.5 flex-none text-idx transition-colors group-hover/min:text-ink"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-7 mx-auto max-w-[720px]">
        <SubTitle className="mt-0">{talk.title}</SubTitle>
        <p className="mt-0.5 text-[12.5px] leading-[1.45] text-label">
          {talk.note}
        </p>
        <div className="mt-2 flex flex-col gap-1">
          {talk.rows.map((row) => (
            <TickRow
              key={row.k}
              single
              on={isOn(answers, row.scope, row.k)}
              name={row.n}
              note={row.sub}
              onToggle={() => {
                setPick(row.scope, row.k, true, true);
                touchStep("submit");
              }}
            />
          ))}
        </div>

        {/* Choosing to book a time has to be able to book a time. The question
            was asked and the answer recorded, and then nothing happened - which
            is the one thing a booking question must not do. */}
        {/* How long to hold, asked here so the diary opens with it already
            chosen. A quarter of an hour to an hour: the shortest that is worth
            anyone's diary, and the longest we will hold without knowing what it
            is for. */}
        {isOn(answers, "talk", "book") || isOn(answers, "talk", "times") ? (
          <div className="mt-4">
            <b className="block text-[13px] font-semibold text-ink">
              How long shall we hold
            </b>

            <div
              role="radiogroup"
              aria-label="How long shall we hold"
              className="mt-2 flex flex-wrap gap-2"
            >
              {[15, 30, 45, 60].map((length) => (
                <button
                  key={length}
                  type="button"
                  role="radio"
                  aria-checked={chipOn(answers, "talk.len", String(length))}
                  onClick={() => {
                    toggleChip("talk.len", String(length), true, "submit");
                  }}
                  className={cn(
                    "cursor-pointer rounded-pill px-4 py-1.5 text-[13px] font-semibold tabular-nums transition-colors",
                    chipOn(answers, "talk.len", String(length))
                      ? "bg-ink text-white"
                      : "bg-canvas text-body hover:bg-hair hover:text-ink",
                  )}
                >
                  {length} min
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {isOn(answers, "talk", "book") ? (
          <Link
            href={`${ROUTES.book}?mins=${heldFor(answers)}`}
            className="group/book mt-3 inline-flex items-center gap-2 rounded-pill bg-ink px-4.5 py-2 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Choose a time
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover/book:translate-x-0.5 group-hover/book:-translate-y-0.5"
            />
          </Link>
        ) : null}

        {isOn(answers, "talk", "times") ? (
          <div className="mt-3">
            <p className="mb-2 max-w-[58ch] text-[12.5px] leading-[1.5] text-label">
              Days and time bands rather than a slot, and anything from two
              working days out - that is the first day our diary opens.
            </p>
            <AddRow
              placeholder="Mornings, or Tuesday and Thursday after two"
              label="The times that suit you"
              onAdd={(value) =>
                addRef({
                  kind: "Times that suit",
                  text: value,
                  where: { stepKey: "submit", step: "Submit" },
                })
              }
            />
          </div>
        ) : null}
      </section>

      <section className="mt-8 mx-auto max-w-[1100px]">
        <SubTitle className="mt-0">Where you are in how we work</SubTitle>
        <p className="mt-0.5 text-[12.5px] leading-[1.45] text-label">
          Thirteen steps, from this run-through to the end of early life
          support. Sending it puts you on the second one.
        </p>

        <ol className="mt-3 grid gap-x-10 sm:grid-cols-2">
          {HOW_WE_WORK.map((entry) => (
            <li
              key={entry.ix}
              className="flex items-start gap-3 border-b border-hair py-2 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
            >
              <span
                className={cn(
                  "w-6 flex-none font-mono text-[10px] font-bold tabular-nums",
                  entry.state === "done"
                    ? "text-mark"
                    : entry.state === "here"
                      ? "text-ink"
                      : "text-idx",
                )}
              >
                {entry.ix}
              </span>
              <span className="min-w-0 flex-1">
                <b
                  className={cn(
                    "block text-[13px] leading-[1.3] font-semibold",
                    entry.state === "ahead" ? "text-quiet" : "text-ink",
                  )}
                >
                  {entry.n}
                </b>
                <span className="mt-0.5 block text-[11.5px] leading-[1.4] text-label">
                  {entry.sub}
                </span>
              </span>
              {entry.mark ? (
                <span
                  className={cn(
                    "flex-none font-mono text-[8.5px] font-bold tracking-[0.1em] uppercase",
                    entry.state === "done" ? "text-mark" : "text-ink",
                  )}
                >
                  {entry.mark}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {/* What is stopping it, or what went wrong, said above the button rather
          than after it is pressed. A control that refuses without saying why is
          a control somebody presses four times. */}
      {/* The end of it, on the centre line the rest of the run sits on.

          It was three blocks against the left edge - a button, a paragraph
          beside it, and a second paragraph under both - each a different width,
          which read as three unrelated notes rather than as one way out. One
          centred column, one measure, and the words under the control they are
          about. */}
      <div className="mx-auto mt-8 flex max-w-[52ch] flex-col items-center text-center">
        {missing.length ? (
          <p className="text-[13px] leading-[1.6] text-quiet">
            Before this can go we need {missing.join(", ").toLowerCase()}. They
            are the four fields above.
          </p>
        ) : null}

        {answers.problem ? (
          <p
            role="alert"
            className="mt-4 w-full rounded-[12px] bg-blocked/[0.08] px-4 py-3 text-[13px] leading-[1.6] text-blocked"
          >
            {answers.problem}
          </p>
        ) : null}

        <Pill
          tone="ink"
          arrow
          className="mt-5"
          disabled={answers.sending || missing.length > 0}
          onClick={send}
        >
          {answers.sending ? "Sending it" : "Send my scoping request"}
        </Pill>

        <p className="mt-4 text-[12px] leading-[1.55] text-label">
          What you have made is a scope, not a quote - the price comes at step
          seven, against this document, in writing. And the document stays
          yours.
        </p>

        {/* Beside the button that sends it, not only in the footer.

            This screen collects a name, a company, an email, a phone number,
            free text, uploaded files and answers about somebody's business. A
            privacy notice seven links down the foot of the page is not a
            notice given at the point of collection. */}
        <p className="mt-2.5 text-[12px] leading-[1.55] text-label">
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

    </StageStep>
  );
}
