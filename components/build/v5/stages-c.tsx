"use client";

import { ArrowUpRight, Check, Send } from "lucide-react";
import Link from "next/link";

import { MIN_MAP, STATES } from "@/lib/build/v5";
import {
  assumed,
  pagesFrom,
  readiness,
  told,
  zonesFrom,
} from "@/lib/build/v5-derive";
import { OPTION_LISTS } from "@/lib/build/v5-options";
import { HOW_WE_WORK } from "@/lib/build/v5-work";
import {
  addRef,
  chipOn,
  isOn,
  picked,
  setAsk,
  setKeep,
  setPick,
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
   The last four steps: the read-back, the four fields, the way back in, and
   the send. The only compulsory part of the whole run lives here, and it is
   four fields and a button.
--------------------------------------------------------------------------- */

type StepProps = {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
  onGoKey: (key: string) => void;
};

/* ----------------------------------------------------------------- 09 read */

/**
 * Read it back: the scoping request as a document.
 *
 * Not a page of ticks. This is the one screen where somebody checks our account
 * of their business before it goes anywhere, and the only form that can be
 * checked is the form it will arrive in - a report, with a front, a contents,
 * numbered sections, and the things we will assume stated as sentences rather
 * than left as gaps.
 *
 * Every section carries the way back to the question that wrote it, because a
 * document you cannot correct is not a draft, it is a claim.
 */
export function StageRead({ at, answers, onGo, onGoKey }: StepProps) {
  const lines = told(answers);
  const takenAsRead = assumed(answers);
  const pages = pagesFrom(answers);
  const zones = zonesFrom(pages);
  const { state } = readiness(answers);
  const [stateName] = STATES[state];

  /* The sections, in the order they will be read, with what each one holds. A
     section with nothing in it still appears: that it is empty is a fact about
     the scope, and hiding it would leave the reader counting. */
  const parts = [
    {
      key: "who",
      title: "Who the site is for",
      count: picked(answers, "who").length,
    },
    {
      key: "do",
      title: "What people can do",
      count: picked(answers, "do").length,
    },
    {
      key: "sell",
      title: "What you sell",
      count: picked(answers, "sell").length,
    },
    {
      key: "style",
      title: "How it should feel",
      count: picked(answers, "feel").length,
    },
    {
      key: "have",
      title: "What you already have",
      count: picked(answers, "have").length,
    },
    { key: "refs", title: "Reference points", count: answers.refs.length },
  ];

  const facts = [
    { n: String(pages.length), label: "Pages described" },
    { n: String(lines.length), label: "Things you told us" },
    { n: String(takenAsRead.length), label: "Taken as read" },
  ];

  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>Read it back.</H>
      <Sub>
        Your scoping request, in the shape it will arrive in. Change anything
        from the section it sits in.
      </Sub>

      {/* The front of the document: whose it is, and what it adds up to. */}
      <div className="mt-6 max-w-[1100px] rounded-[18px] bg-field p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-5">
          <div className="min-w-0">
            <Kicker className="block">Scoping request</Kicker>
            <b className="mt-2 block max-w-[24ch] text-[clamp(19px,1.7vw,25px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink">
              {answers.ask.company?.trim() || "Your website"}
            </b>
            <p className="mt-1.5 text-[12.5px] text-quiet">
              {answers.ask.name?.trim()
                ? `Prepared with ${answers.ask.name.trim()}`
                : "Prepared from your answers"}
            </p>
          </div>

          <div className="flex flex-none flex-wrap gap-x-9 gap-y-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <b className="block font-mono text-[24px] leading-none font-bold text-ink tabular-nums">
                  {fact.n}
                </b>
                <span className="mt-1.5 block font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase">
                  {fact.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 border-t border-hair pt-4 max-w-[76ch] text-[13px] leading-[1.6] text-body">
          <b className="font-semibold text-ink">{stateName}.</b> Nothing here is
          priced, scored or graded. What is written down is what you said, and
          what you left alone is written down as an assumption you can correct.
        </p>
      </div>

      {/* Contents. Numbered, and each line the way back to the question that
          writes that section. */}
      <section className="mt-8 max-w-[1100px]">
        <SubTitle className="mt-0">Contents</SubTitle>

        <ol className="mt-2.5 grid gap-x-10 sm:grid-cols-2">
          {parts.map((part, n) => (
            <li key={part.key}>
              <button
                type="button"
                onClick={() => onGoKey(part.key)}
                className="group/sec flex w-full cursor-pointer items-baseline gap-4 border-b border-hair py-3 text-left transition-colors hover:border-ink"
              >
                <span className="w-5 flex-none font-mono text-[10px] font-bold text-idx tabular-nums">
                  {String(n + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 text-[14px] font-semibold text-ink">
                  {part.title}
                </span>

                <span
                  className={cn(
                    "flex-none font-mono text-[9px] font-bold tracking-[0.1em] uppercase tabular-nums",
                    part.count ? "text-mark" : "text-idx",
                  )}
                >
                  {part.count ? `${part.count} said` : "Assumed"}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      {/* The site itself, since it is the thing being scoped. */}
      <section className="mt-9 max-w-[1100px]">
        <SubTitle className="mt-0" count={pages.length}>
          The site your answers describe
        </SubTitle>

        <div className="mt-3 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <div key={zone.key} className="min-w-0">
              <Kicker className="block text-ink">{zone.title}</Kicker>

              <ul className="mt-2 flex flex-col">
                {zone.pages.map((page) => (
                  <li
                    key={page.name}
                    className="flex items-baseline gap-2.5 py-[3px]"
                  >
                    <span className="w-[18px] flex-none font-mono text-[9.5px] text-idx tabular-nums">
                      {page.index}
                    </span>
                    <span className="min-w-0 flex-1 text-[13.5px] leading-[1.35] font-medium text-ink">
                      {page.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* What was said, and what will be assumed. Side by side, because the
          second is only readable against the first. */}
      <div className="mt-9 grid max-w-[1100px] gap-x-10 gap-y-8 lg:grid-cols-2">
        <section className="min-w-0">
          <SubTitle count={lines.length} className="mt-0">
            What you told us
          </SubTitle>

          {lines.length ? (
            <ul className="mt-2.5 flex flex-col gap-2">
              {lines.map((line, n) => (
                <li key={n} className="flex items-start gap-2.5">
                  <Check
                    aria-hidden
                    className="mt-0.5 size-3.5 flex-none text-mark"
                    strokeWidth={3}
                  />
                  <span className="text-[13.5px] leading-[1.55] text-body">
                    {line.line}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2.5 text-[13px] text-quiet">
              Nothing yet. Everything you tick turns up here.
            </p>
          )}
        </section>

        <section className="min-w-0">
          <SubTitle count={takenAsRead.length} className="mt-0">
            What we will take as read
          </SubTitle>

          {takenAsRead.length ? (
            <>
              <ul className="mt-2.5 flex flex-col gap-2">
                {takenAsRead.map((sentence) => (
                  <li
                    key={sentence}
                    className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-quiet"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] size-1 flex-none rounded-pill bg-planned"
                    />
                    {sentence}
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-[12px] leading-[1.5] text-label">
                A sentence in your document, not a gap. Answer the step and it
                stops being an assumption.
              </p>
            </>
          ) : (
            <p className="mt-2.5 text-[13px] text-quiet">
              Nothing assumed - every step so far has been answered.
            </p>
          )}
        </section>
      </div>

      {/* The foot of it: what this is, and what happens to it. */}
      <p className="mt-9 max-w-[64ch] border-t border-hair pt-5 text-[12.5px] leading-[1.6] text-label">
        A draft of what we will read, not a proposal and not a quotation. A
        person reads it and replies in writing within two working days.
      </p>
    </StageStep>
  );
}

/* --------------------------------------------------------------- 10 asking */

const FIELDS = [
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

const PARTS = [
  { v: "decide", label: "I decide" },
  { v: "others", label: "I decide, with others" },
  { v: "gather", label: "I am gathering this for somebody who decides" },
  { v: "advise", label: "I am advising them" },
] as const;

export function StageAsking({ at, answers, onGo }: StepProps) {
  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>Who is asking?</H>
      <Sub>
        The only part about you, and the only part you cannot skip. Four fields,
        and two that are not required at all.
      </Sub>

      <div className="mt-6 grid max-w-[720px] gap-x-6 gap-y-5 sm:grid-cols-2">
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

      <div className="mt-6 max-w-[720px]">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <b className="text-[13.5px] font-semibold text-ink">
            What part do you play in this decision
          </b>
          <Kicker className="text-mark">Required</Kicker>
        </div>

        <TickSet
          single
          options={PARTS.map((part) => ({ k: part.v, label: part.label }))}
          isOn={(k: string) => chipOn(answers, "ask.part", k)}
          onPick={(k: string) => toggleChip("ask.part", k, true, "asking")}
        />

        <p className="mt-2 text-[12px] leading-[1.5] text-label">
          So the first call is the right length. Never shown back to you as a
          grade.
        </p>
      </div>
    </StageStep>
  );
}

/* ----------------------------------------------------------------- 11 keep */

export function StageKeep({ at, answers, onGo }: StepProps) {
  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>Keep a way back in?</H>
      <Sub>
        One press, no password. The way back in is a link to the address you
        have already given, and either answer sends exactly the same request.
      </Sub>

      <div className="mt-6 flex max-w-[560px] flex-col gap-1">
        <TickRow
          single
          on={answers.keep === true}
          name="Register with the address I gave"
          note="We keep what you have written and send a link, so you can come back and change it."
          onToggle={() => setKeep(true)}
        />
        <TickRow
          single
          on={answers.keep === false}
          name="No, just send it"
          note="The document goes to your address and that is the end of it. Nothing is saved."
          onToggle={() => setKeep(false)}
        />
      </div>
    </StageStep>
  );
}

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
  const [stateName, stateNote] = STATES[state];
  const talk = OPTION_LISTS.submit[0];

  if (answers.sent) {
    return (
      <StageStep at={at} answers={answers} onGo={onGo} corner={null}>
        {/* The badge sits in a block of its own so it can be given a margin.
            Left inline, the only thing between it and the heading was the
            leading of its own line box - about six pixels under a 27px
            extrabold line, which read as the two being one stuck together lump
            rather than a mark and the sentence it introduces. `flex` keeps the
            pill shrunk to its label instead of stretching the row. */}
        <div className="mb-4 flex">
          <span className="inline-flex items-center gap-2 rounded-pill bg-mark/[0.08] py-1.5 pr-4 pl-3">
            <span aria-hidden className="size-2 rounded-pill bg-mark" />
            <Kicker className="text-mark">Sent</Kicker>
          </span>
        </div>

        <H>We read it. All of it.</H>
        <Sub>
          Including the parts in your own words, which are usually the useful
          part. Two or three questions come back in writing, within two working
          days.
        </Sub>

        {/* The measure, the size and the leading of the line above it, because
            it is the same quiet voice saying the next thing. On a shorter
            measure the two paragraphs wrapped at different widths and gave the
            screen two ragged right edges where it should have one column. The
            gap is a line of that column: a paragraph break, not a new block. */}
        <p className="mt-5 max-w-[58ch] text-[13.5px] leading-[1.5] text-quiet sm:text-[14px]">
          Your answers are still here and still yours - keep changing them and
          send it again, and the newer one is the one we read.
        </p>

        <div className="mt-7 flex">
          <Pill onClick={() => setSent(false)}>Keep answering</Pill>
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
          label="Send my scoping request"
          tone="ink"
          onClick={() => setSent(true)}
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

      {/* Where it stands, and the named things still missing, each a link
          straight to its question. */}
      <section className="mt-6 max-w-[720px] rounded-[16px] bg-field p-5">
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

      <section className="mt-7 max-w-[720px]">
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
                      : "bg-field text-body hover:bg-hair hover:text-ink",
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

      <section className="mt-8 max-w-[1100px]">
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

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Pill tone="ink" arrow onClick={() => setSent(true)}>
          Send my scoping request
        </Pill>
        <p className="max-w-[46ch] text-[12px] leading-[1.5] text-label">
          What you have made is a scope, not a quote - the price comes at step
          seven, against this document, in writing. And the document stays
          yours.
        </p>
      </div>
    </StageStep>
  );
}
