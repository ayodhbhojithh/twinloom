"use client";

import { ArrowUpRight, Check, Send } from "lucide-react";
import Link from "next/link";

import { ASK_PARTS, MIN_MAP, STATES, STEPS } from "@/lib/build/v5";
import { readiness } from "@/lib/build/v5-derive";
import { OPTION_LISTS } from "@/lib/build/v5-options";
import { deskRef } from "@/lib/build/desk";
import { carry } from "@/lib/build/handoff";
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
  startOver,
  unsent,
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
  stepStatus,
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
  /* Whether there is anything to send that has not been sent - see `unsent`.
     True on a first submission, and after that only where the answers differ
     from what went. */
  const changed = unsent(answers);

  /* The times somebody offered instead of booking, where they did. They are
     filed as notes on the desk under one kind - see the step below - so this is
     that kind read back rather than a second place to keep them. */
  const times = answers.refs
    .filter((ref) => ref.kind === "Times that suit")
    .map((ref) => ref.text.trim())
    .filter(Boolean);

  /* How many steps have had nothing out of anybody, so the offer to carry on
     can say what carrying on would be for. The last step is not counted: it is
     the one they are standing on and it is not a question. */
  const left = STEPS.filter(
    (step) => step.k !== "submit" && stepStatus(step.k, answers).done === 0,
  ).length;

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
        {/* The receipt.

            One column, left aligned, read top to bottom: it arrived, where the
            copy went, the number to quote, what happens next, the meeting, and
            then the two things there are left to do. Centred it was four short
            lines with a ragged edge on both sides; a receipt is a document
            rather than a poster.

            The meeting reads from the answers, so the three states are the same
            three the receipt in their inbox carries - see `meetingFrom` in the
            scope route. A screen and an email disagreeing about whether a
            meeting exists is worse than neither mentioning it. */}
        <div className="mx-auto w-full max-w-[62ch] py-4 text-left max-sm:py-1">
          <span
            aria-hidden
            className="flex size-11 items-center justify-center rounded-pill bg-mark text-white max-sm:size-10"
          >
            <Check className="size-[22px] max-sm:size-5" strokeWidth={2.8} />
          </span>

          <h2 className="mt-5 text-[clamp(26px,2.6vw,36px)] leading-[1.06] font-extrabold tracking-[-0.038em] text-ink max-sm:mt-4 max-sm:text-[24px]">
            Thank you
          </h2>

          <p className="mt-4 text-[15px] leading-[1.6] text-body max-sm:mt-3 max-sm:text-[13.5px]">
            Your scoping request is with us.
          </p>

          {answers.ask.email?.trim() ? (
            <p className="mt-2 text-[15px] leading-[1.6] text-body max-sm:text-[13.5px]">
              We have emailed a copy to{" "}
              <b className="font-semibold break-all text-ink">
                {answers.ask.email.trim()}
              </b>
              .
            </p>
          ) : null}

          {answers.ref ? (
            <div className="mt-7 rounded-[14px] bg-canvas p-4 max-sm:mt-5 max-sm:p-3.5">
              <Kicker className="block">Your reference</Kicker>

              <b className="mt-1.5 block font-mono text-[17px] leading-none font-bold tracking-[0.06em] text-ink tabular-nums select-all max-sm:text-[15px]">
                {answers.ref}
              </b>

              <p className="mt-2.5 text-[12.5px] leading-[1.55] text-quiet">
                Quote it in any reply. Anything you add later is filed under it.
              </p>
            </div>
          ) : null}

          <p className="mt-6 text-[13.5px] leading-[1.65] text-quiet max-sm:mt-5 max-sm:text-[13px]">
            We read what you have sent, and will talk through your requirements,
            how we work and the next steps in more depth when we meet.
          </p>

          {/* The meeting, in whichever of its three states it is in. */}
          <div className="mt-7 max-sm:mt-6">
            <SubTitle className="mt-0">Your meeting</SubTitle>

            <p className="mt-2 text-[13.5px] leading-[1.6] text-body max-sm:text-[13px]">
              {answers.booked ? (
                <>
                  You booked{" "}
                  <b className="font-semibold text-ink">
                    {answers.booked.when}
                  </b>
                  . The invitation is in your inbox.
                </>
              ) : times.length ? (
                <>
                  You gave us{" "}
                  <b className="font-semibold text-ink">{times.join("; ")}</b>{" "}
                  as times that work for you. We will confirm a slot, or come
                  back with alternatives.
                </>
              ) : (
                <>
                  No meeting yet. We will be in touch when we have read through
                  your request.
                </>
              )}
            </p>
          </div>

          {/* And the two things left to do. */}
          <div className="mt-8 border-t border-hair pt-6 max-sm:mt-6 max-sm:pt-5">
            <SubTitle className="mt-0">Before you go</SubTitle>

            <div className="mt-3 flex flex-col gap-5">
              <div>
                <Pill onClick={() => setSent(false)}>Edit your answers</Pill>

                <p className="mt-2.5 max-w-[58ch] text-[12.5px] leading-[1.6] text-quiet">
                  {left
                    ? `${left} ${left === 1 ? "area is" : "areas are"} still unanswered, and you can change anything you have already said. It all goes into the same request.`
                    : "You can change anything you have already said. It all goes into the same request."}{" "}
                  Your answers stay open in this window until you close it, or
                  press Close below.
                </p>
              </div>

              <div>
                <Pill
                  onClick={() => {
                    /* Confirmed, because it cannot be undone: the answers are
                       gone from this device the moment it runs, and what was
                       sent lives only in the two emails. */
                    if (
                      window.confirm(
                        "Close this and clear your answers? What you have already sent stays with us.",
                      )
                    ) {
                      startOver();
                    }
                  }}
                >
                  Close
                </Pill>

                {/* What this actually promises, and no more.

                    The line offered here said they could reopen their answers
                    from a link in the email. There is no such link and nothing
                    is stored anywhere to reopen - the answers live in this
                    window and the two emails are the record - so it would have
                    been a promise the site cannot keep, printed next to the
                    button that throws the answers away. Replying to the email
                    does work, and is what is offered. */}
                <p className="mt-2.5 max-w-[58ch] text-[12.5px] leading-[1.6] text-quiet">
                  You can still make changes afterwards: reply to the email we
                  sent you and we will add it to the same request.
                </p>
              </div>
            </div>
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
          label={
            answers.sending
              ? "Sending"
              : answers.ref
                ? "Send the updated version"
                : "Send my scoping request"
          }
          tone="ink"
          disabled={answers.sending || missing.length > 0 || !changed}
          onClick={send}
        >
          <Send className="size-4" strokeWidth={2.2} />
        </Disc>
      }
    >
      {/* Sent once already, or not yet - and the screen has to know which.

          It said "Send it." either way. Somebody who had sent, pressed "Keep
          answering", changed two answers and come back was invited to send a
          scoping request as though the first one had not happened - no mention
          of it, no reference, and a button whose words promised a new
          submission.

          What actually happens is a second version under the same reference:
          `deskRef` does not change after a send, and `sendScope` marks the
          payload as a follow-up. The screen was the only part of that chain
          that did not know. */}
      {answers.ref ? (
        <>
          <H>Send the updated version.</H>
          <Sub>
            You have already sent this one. Anything you have changed since goes
            under the same reference, and the newer version is the one we read.
          </Sub>

          <p className="mx-auto mt-4 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
            <Kicker>Your reference</Kicker>
            <b className="font-mono text-[13.5px] font-bold tracking-[0.06em] text-ink tabular-nums">
              {answers.ref}
            </b>
          </p>
        </>
      ) : (
        <>
          <H>Send it.</H>
          <Sub>
            You can send at any point - what changes is what we can do with what
            arrives. No bar, no percentage, no grade.
          </Sub>
        </>
      )}

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

        {/* Once there is a meeting, this stops being a question.

            Somebody comes back from the booking page having chosen a slot, and
            what stood here was the three options again - "Book a time now" still
            ticked, "Choose a time" still offered. A question already answered,
            and an invitation to book a second meeting about the same submission.

            What replaces it is the answer: what was booked and when. The
            invitation is the place to move or cancel it, so there is nothing to
            press here and nothing is offered. */}
        {answers.booked ? (
          /* The mark's green rather than the canvas grey, and a tick standing in
             it. Every other confirmed thing on this site is drawn this way - the
             ticked rows above, the booked notch on the calendar - and a meeting
             that is in the diary is the most confirmed thing on the page. */
          <div className="mt-3 rounded-[14px] bg-mark/[0.07] p-4 max-sm:p-3.5">
            <p className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex size-6 flex-none items-center justify-center rounded-pill bg-mark text-white"
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <b className="text-[13.5px] font-bold text-ink">
                Booked, and in the diary
              </b>
            </p>

            <p className="mt-3 text-[14px] leading-[1.4] font-bold tracking-[-0.015em] text-ink max-sm:text-[13.5px]">
              {answers.booked.when}
            </p>

            <p className="mt-1 text-[12.5px] leading-[1.5] text-quiet">
              {answers.booked.what}, {answers.booked.minutes} minutes
            </p>

            {/* The reference, set as the receipt and the invitation set it, so
                the three read as one piece of work rather than three
                notifications about different things. */}
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-mark/15 pt-3 text-[12px] leading-[1.55] text-label">
              Booked against
              <b className="font-mono text-[11.5px] font-bold text-quiet">
                {answers.booked.ref}
              </b>
            </p>

            <p className="mt-2 text-[12px] leading-[1.55] text-label">
              The invitation is in your inbox. Moving or cancelling it there
              tells us straight away.
            </p>
          </div>
        ) : (
          <>
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
              <>
                <Link
                  href={`${ROUTES.book}?mins=${heldFor(answers)}`}
                  /* Everything the booking screen would otherwise ask twice, put
                 down on the way out.

                 The two were separate journeys before this: somebody answered
                 ten questions, asked for a time, and landed on a flow that
                 opened by asking what the meeting was about - which is the one
                 thing it had just been told - and then asked for a name and an
                 email address that were already on the desk. The reference goes
                 with it so the meeting that comes out refers to the submission
                 rather than to nothing. */
                  onClick={() =>
                    carry({
                      ref: deskRef(),
                      about: "requirements",
                      minutes: heldFor(answers),
                      name: answers.ask.name?.trim() || undefined,
                      email: answers.ask.email?.trim() || undefined,
                      company: answers.ask.company?.trim() || undefined,
                    })
                  }
                  className="group/book mt-3 inline-flex items-center gap-2 rounded-pill bg-ink px-4.5 py-2 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
                >
                  Choose a time
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform group-hover/book:translate-x-0.5 group-hover/book:-translate-y-0.5"
                  />
                </Link>

                <p className="mt-2.5 max-w-[64ch] text-[12px] leading-[1.55] text-label">
                  It opens on the calendar, already set to go through this
                  scope. The meeting will be booked against{" "}
                  <b className="font-mono font-semibold text-quiet">
                    {deskRef()}
                  </b>
                  , which is the reference this submission comes back with.
                </p>
              </>
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
          </>
        )}
      </section>

      {/* No map of the thirteen steps here.

          It listed the whole of how we work - from this run-through to the
          end of early life support - on the screen somebody has reached by
          answering ten questions and is about to press send on. Thirteen
          things to read at the moment there is one thing to do.

          It is not lost: `/how-we-work` is that run in full, with a surface
          per zone and room to say what each step means, and it is in the bar
          at the top of this page. A summary of another page, printed above
          the only button on this one, is a summary competing with the
          button. */}

      {/* What is stopping it, or what went wrong, said above the button rather
          than after it is pressed. A control that refuses without saying why is
          a control somebody presses four times. */}
      {/* The end of it, on the centre line the rest of the run sits on.

          It was three blocks against the left edge - a button, a paragraph
          beside it, and a second paragraph under both - each a different width,
          which read as three unrelated notes rather than as one way out. One
          centred column, one measure, and the words under the control they are
          about. */}
      {/* Wider than the type in it wants, because of what is in it.

          Fifty-two characters is a reading measure - right for a paragraph
          somebody reads down, and wrong for this block. What is here is a
          button, then two footnotes set at twelve pixels: at 52ch those broke
          over three and four lines, so the foot of the run was a narrow column
          of small print under a wide surface, with the button looking like it
          belonged to a different page.

          Eighty-four is about two lines for each of them, and it is still a
          measure rather than the whole card - the surface is 1100 wide and type
          this small running the full width of it would be unreadable in the
          other direction. */}
      <div className="mx-auto mt-8 flex max-w-[84ch] flex-col items-center text-center">
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
          busy={answers.sending}
          className="mt-5"
          disabled={answers.sending || missing.length > 0 || !changed}
          onClick={send}
        >
          {answers.sending
            ? "Sending it"
            : !changed
              ? "Nothing new to send"
              : answers.ref
                ? "Send the updated version"
                : "Send my scoping request"}
        </Pill>

        {/* No line about scopes and quotes.

            It said the price comes later, against this document, in writing -
            which is true, and is the same promise the terms make and the
            proposal keeps. Under the send button it was reassurance against a
            worry nobody arriving there has: pressing send does not ask for
            money, and saying so raises the question. */}

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
