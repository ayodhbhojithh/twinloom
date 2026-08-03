"use client";

import { ArrowRight, Check } from "lucide-react";

import {
  ACTIONS,
  COLOUR_ANSWERS,
  FEELS,
  GROUPS,
  HAVE_ANSWERS,
  MIN_MAP,
  PAY_WAYS,
  REPORT,
  SELL_KINDS,
  STATES,
} from "@/lib/build/v5";
import { CARD_BY, LAYER_THREE } from "@/lib/build/v5-cards";
import { HAVE_GROUPS } from "@/lib/build/v5-have";
import { STEP_COPY } from "@/lib/build/v5-copy";
import { assumed, orderedActions, readiness, told } from "@/lib/build/v5-derive";
import {
  addRef,
  chipOn,
  dropRefTied,
  isOn,
  picked,
  setAsk,
  setKeep,
  setOrder,
  setSent,
  toggleChip,
  togglePick,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { DetailCard, OwnWords } from "../card";
import { Chip, Kicker, LayerMark, SubHead, Under } from "../parts";
import { RowTable } from "../row-table";
import { Lead, Say, StepFrame } from "../step-frame";
import { useState } from "react";

/* ---------------------------------------------------------------------------
   The remaining ten steps.

   Each one is the prototype's prose, read out of `v5-copy.ts`, with its own
   controls written here. Splitting it that way keeps the wording in one place
   where it can be checked against the source, and leaves these files as what
   each step actually does.
--------------------------------------------------------------------------- */

/** A step's own words, in the order the prototype sets them. */
function Prose({ step }: { step: string }) {
  const copy = STEP_COPY[step];

  return (
    <>
      <Lead>{copy.lead}</Lead>
      {copy.lay.map((mark) => (
        <LayerMark key={mark}>{mark}</LayerMark>
      ))}
      {copy.says.map((line, n) => (
        <Say key={n}>{line}</Say>
      ))}
    </>
  );
}

function Notes({ step }: { step: string }) {
  return (
    <>
      {STEP_COPY[step].und.map((line, n) => (
        <Under key={n}>{line}</Under>
      ))}
    </>
  );
}

function Miss({ step, answers }: { step: string; answers: Answers }) {
  return (
    <>
      {STEP_COPY[step].miss.map((box) => (
        <OwnWords
          key={box.id}
          listId={box.id}
          label={box.label}
          placeholder={box.ph}
          answers={answers}
          stepKey={step}
        />
      ))}
    </>
  );
}

type StepProps = {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
  onGoKey?: (key: string) => void;
};

/* ------------------------------------------------------------------ who */

export function StepWho({ at, answers, onGo }: StepProps) {
  const copy = STEP_COPY.who;

  return (
    <StepFrame at={at} onGo={onGo} needs={copy.stop} showBack={copy.stback}>
      <Prose step="who" />

      <div className="mt-6 grid max-w-wide gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {GROUPS.map((group) => {
          const on = isOn(answers, "who", group.k);

          return (
            <button
              key={group.k}
              type="button"
              aria-pressed={on}
              onClick={() => togglePick("who", group.k, "who")}
              className={cn(
                "flex cursor-pointer items-start gap-3.5 rounded-card p-4 text-left transition-colors",
                on ? "bg-ink" : "bg-well hover:bg-hair",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-px flex size-[22px] flex-none items-center justify-center rounded-pill",
                  on ? "bg-white/20 text-white" : "bg-field text-planned",
                )}
              >
                <Check className="size-[13px]" strokeWidth={3} />
              </span>

              <span className="min-w-0">
                <b
                  className={cn(
                    "block text-[15px] leading-[1.3] font-bold",
                    on ? "text-white" : "text-ink",
                  )}
                >
                  {group.n}
                </b>
                <span
                  className={cn(
                    "mt-1 block font-mono text-[10px] font-semibold tracking-[0.1em] uppercase",
                    on ? "text-white/55" : "text-idx",
                  )}
                >
                  {group.pages.length ? `Adds ${group.pages.join(", ")}` : "No page of its own"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <Miss step="who" answers={answers} />
      <Notes step="who" />
    </StepFrame>
  );
}

/* ------------------------------------------------------------------- do */

export function StepDo({ at, answers, onGo }: StepProps) {
  const copy = STEP_COPY.do;
  const order = orderedActions(answers);

  return (
    <StepFrame at={at} onGo={onGo} needs={copy.stop} showBack={copy.stback}>
      <Prose step="do" />

      <RowTable
        step="do"
        scope="do"
        rows={ACTIONS}
        answers={answers}
        needs={picked(answers, "who")}
      />

      <Miss step="do" answers={answers} />

      {order.length > 1 ? (
        <>
          <SubHead
            title={CARD_BY["dw-order"].title}
            note={CARD_BY["dw-order"].note}
          />
          <OrderList order={order} />
        </>
      ) : null}

      <Notes step="do" />
    </StepFrame>
  );
}

/**
 * The order the things are met in.
 *
 * The home page can only lead with one of them, and which one is a decision
 * somebody who knows the business should make rather than one we should infer
 * from the order they happened to tick things.
 */
function OrderList({ order }: { order: string[] }) {
  const byKey = Object.fromEntries(ACTIONS.map((action) => [action.k, action]));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    const [held] = next.splice(from, 1);
    next.splice(to, 0, held);
    setOrder(next);
  };

  return (
    <ol className="max-w-measure">
      {order.map((key, n) => (
        <li
          key={key}
          className="flex items-center gap-3 border-b border-hair py-2.5 last:border-b-0"
        >
          <span className="w-6 flex-none font-mono text-[11px] font-bold text-idx tabular-nums">
            {String(n + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1 text-[14.5px] font-semibold text-ink">
            {byKey[key]?.n ?? key}
          </span>
          <span className="flex flex-none gap-1">
            <button
              type="button"
              aria-label="Move up"
              onClick={() => move(n, n - 1)}
              className="cursor-pointer rounded-pill bg-well px-2.5 py-1 font-mono text-[10px] font-bold text-quiet transition-colors hover:text-ink"
            >
              Up
            </button>
            <button
              type="button"
              aria-label="Move down"
              onClick={() => move(n, n + 1)}
              className="cursor-pointer rounded-pill bg-well px-2.5 py-1 font-mono text-[10px] font-bold text-quiet transition-colors hover:text-ink"
            >
              Down
            </button>
          </span>
        </li>
      ))}
      <p className="mt-3 text-[13.5px] leading-[1.5] text-quiet">
        The home page leads with whatever is first. Leave it and we choose.
      </p>
    </ol>
  );
}

/* ----------------------------------------------------------------- sell */

export function StepSell({ at, answers, onGo }: StepProps) {
  const copy = STEP_COPY.sell;
  const selling = picked(answers, "sell").length > 0;

  return (
    <StepFrame at={at} onGo={onGo} needs={copy.stop} showBack={copy.stback}>
      <Prose step="sell" />

      <RowTable
        step="sell"
        scope="sell"
        rows={SELL_KINDS.map((kind) => ({
          k: kind.k,
          band: "sell",
          n: kind.n,
          pages: kind.pages,
          pre: "" as const,
          l2: kind.k,
        }))}
        answers={answers}
      />

      {copy.sh4[0] ? (
        <SubHead title={copy.sh4[0][0]} note={copy.sh4[0][1]} />
      ) : null}

      <RowTable
        step="sell"
        scope="pay"
        rows={PAY_WAYS.map((way) => ({
          k: way.k,
          band: "pay",
          n: way.n,
          pages: way.pages,
          pre: "" as const,
          l2: "",
        }))}
        answers={answers}
      />

      <Miss step="sell" answers={answers} />

      {/* Layer three only once there is a shop. None of it holds anything up,
          and asking it of somebody who sells nothing would be asking about a
          shop that does not exist. */}
      {selling
        ? LAYER_THREE.map((three) => (
            <div key={three.id} className="mt-10 max-w-wide">
              <Kicker className="mb-2 block">{three.kicker}</Kicker>
              <h4 className="text-[19px] font-bold tracking-[-0.015em] text-ink sm:text-[21px]">
                {three.title}
              </h4>
              <p className="mt-2 max-w-measure text-[15px] leading-[1.6] text-quiet">
                {three.note}
              </p>

              <DetailCard
                card={{ ...three, key: three.id, level: three.kicker }}
                answers={answers}
                stepKey="sell"
                onClose={() => undefined}
              />
            </div>
          ))
        : null}

      <Notes step="sell" />
    </StepFrame>
  );
}

/* ---------------------------------------------------------------- style */

export function StepStyle({ at, answers, onGo }: StepProps) {
  const copy = STEP_COPY.style;
  const [open, setOpen] = useState<string | null>(null);

  return (
    <StepFrame at={at} onGo={onGo} needs={copy.stop} showBack={copy.stback}>
      <Prose step="style" />

      <div className="mt-6">
        <b className="block text-[15.5px] font-bold text-ink">
          How it should feel
        </b>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(FEELS).map(([key, label]) => (
            <Chip
              key={key}
              on={isOn(answers, "feel", key)}
              onClick={() => togglePick("feel", key, "style")}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>

      {copy.sh4[0] ? (
        <SubHead title={copy.sh4[0][0]} note={copy.sh4[0][1]} />
      ) : null}

      <div className="flex flex-wrap gap-2">
        {Object.entries(COLOUR_ANSWERS).map(([key, label]) => (
          <Chip
            key={key}
            on={chipOn(answers, "colour", key)}
            onClick={() => toggleChip("colour", key, true, "style")}
          >
            {label}
          </Chip>
        ))}
      </div>

      {/* The three cards behind this step: your colours, the swatches, and the
          typeface. They open in place, like every other layer two. */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {["dw-brandfiles", "dw-picker", "dw-typeface"].map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setOpen(open === id ? null : id)}
            className="cursor-pointer rounded-pill bg-well px-4 py-2 font-mono text-[10px] font-bold tracking-[0.12em] text-quiet uppercase transition-colors hover:text-ink"
          >
            {open === id ? "Close" : CARD_BY[id].title}
          </button>
        ))}
      </div>

      {open ? (
        <DetailCard
          card={CARD_BY[open]}
          answers={answers}
          stepKey="style"
          onClose={() => setOpen(null)}
        />
      ) : null}

      <Miss step="style" answers={answers} />
      <Notes step="style" />
    </StepFrame>
  );
}

/* ----------------------------------------------------------------- have */

export function StepHave({ at, answers, onGo }: StepProps) {
  const copy = STEP_COPY.have;
  const [open, setOpen] = useState(false);

  return (
    <StepFrame at={at} onGo={onGo} needs={copy.stop} showBack={copy.stback}>
      <Prose step="have" />

      {/* Four groups, and the grouping is an argument: what has to exist before
          anything can go live, then the look, then the words, then what is
          running now. Three answers a row, and the middle one is offered rather
          than left as the gap between yes and no, because most of the time it
          is the honest answer. */}
      <div className="mt-8 flex max-w-wide flex-col gap-8">
        {HAVE_GROUPS.map((group) => (
          <div key={group.title} className="min-w-0">
            <h4 className="mb-3 text-[17px] leading-[1.25] font-bold tracking-[-0.015em] text-ink sm:text-[19px]">
              {group.title}
            </h4>

            <div className="overflow-hidden rounded-card bg-well">
              {group.rows.map((row) => (
                <div
                  key={row.key}
                  className="border-t border-border p-4 first:border-t-0 sm:p-5"
                >
                  <b className="block text-[15px] leading-[1.3] font-bold text-ink">
                    {row.title}
                  </b>
                  {row.note ? (
                    <p className="mt-1 max-w-measure text-[13.5px] leading-[1.5] text-quiet">
                      {row.note}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {Object.entries(HAVE_ANSWERS).map(([key, label]) => (
                      <Chip
                        key={key}
                        on={chipOn(answers, row.q, key)}
                        onClick={() => toggleChip(row.q, key, true, "have")}
                      >
                        {label}
                      </Chip>
                    ))}

                    {row.attach ? (
                      <>
                        <Kicker className="ml-1">Attach</Kicker>
                        <Chip
                          on={answers.refs.some(
                            (ref) => ref.tie === row.attach!.key,
                          )}
                          onClick={() => {
                            const tie = row.attach!.key;
                            if (answers.refs.some((ref) => ref.tie === tie)) {
                              dropRefTied(tie);
                              return;
                            }
                            addRef(
                              {
                                kind: "To send",
                                text: `${row.title}: ${row.attach!.label}`,
                                tie,
                                where: {
                                  stepKey: "have",
                                  step: "What you already have",
                                  qid: row.q,
                                  q: row.title,
                                },
                              },
                              "have",
                            );
                          }}
                        >
                          {row.attach.label}
                        </Chip>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="cursor-pointer rounded-pill bg-well px-4 py-2 font-mono text-[10px] font-bold tracking-[0.12em] text-quiet uppercase transition-colors hover:text-ink"
        >
          {open ? "Close" : CARD_BY["dw-have"].title}
        </button>
      </div>

      {open ? (
        <DetailCard
          card={CARD_BY["dw-have"]}
          answers={answers}
          stepKey="have"
          onClose={() => setOpen(false)}
        />
      ) : null}

      <Miss step="have" answers={answers} />
      <Notes step="have" />
    </StepFrame>
  );
}

/* ----------------------------------------------------------------- refs */

export function StepRefs({ at, answers, onGo }: StepProps) {
  const copy = STEP_COPY.refs;

  return (
    <StepFrame at={at} onGo={onGo} needs={copy.stop} showBack={copy.stback}>
      <Prose step="refs" />

      {copy.sh4[0] ? (
        <SubHead title={copy.sh4[0][0]} note={copy.sh4[0][1]} />
      ) : null}

      <Miss step="refs" answers={answers} />

      <p className="mt-6 max-w-measure rounded-card bg-well p-5 text-[14.5px] leading-[1.6] text-quiet">
        Everything on the desk beside this is here too, and everything you add
        here is there. They are one list seen from two places, so nothing has to
        be written down twice.
      </p>

      <Notes step="refs" />
    </StepFrame>
  );
}

/* ----------------------------------------------------------------- read */

export function StepRead({ at, answers, onGo, onGoKey }: StepProps) {
  const copy = STEP_COPY.read;
  const lines = told(answers);
  const takenAsRead = assumed(answers);

  return (
    <StepFrame at={at} onGo={onGo} needs={copy.stop} showBack={copy.stback}>
      <Prose step="read" />

      {copy.sh4[0] ? (
        <SubHead title={copy.sh4[0][0]} note={copy.sh4[0][1]} />
      ) : null}

      <div className="max-w-wide">
        {REPORT.map(([key, heading]) => (
          <div key={key} className="border-b border-hair py-4 last:border-b-0">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <b className="text-[15.5px] font-bold text-ink">{heading}</b>
              <button
                type="button"
                onClick={() => onGoKey?.(key)}
                className="cursor-pointer font-mono text-[10px] font-bold tracking-[0.12em] text-quiet uppercase transition-colors hover:text-ink"
              >
                Change this
              </button>
            </div>
          </div>
        ))}
      </div>

      {lines.length ? (
        <>
          <SubHead title="What you told us" />
          <ul className="flex max-w-measure flex-col gap-2">
            {lines.map((line, n) => (
              <li key={n} className="text-[15px] leading-[1.55] text-body">
                {line.line}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {takenAsRead.length ? (
        <>
          <SubHead
            title="What we will take as read"
            note="Each one is a sentence in your document rather than a gap. Answer the step and it stops being an assumption."
          />
          <ul className="flex max-w-measure flex-col gap-2">
            {takenAsRead.map((sentence) => (
              <li key={sentence} className="text-[15px] leading-[1.55] text-quiet">
                {sentence}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <Notes step="read" />
    </StepFrame>
  );
}

/* --------------------------------------------------------------- asking */

const FIELDS = [
  { k: "name", label: "Your name", req: true, why: "So the reply has somebody to go to." },
  { k: "company", label: "Company", req: true, why: "So we can look at what exists before we call." },
  { k: "email", label: "Email", req: true, why: "Where your scoping request is sent." },
  { k: "phone", label: "Phone", req: false, why: "Only used if a reply bounces or a meeting needs moving." },
  { k: "when", label: "When do you need it live", req: false, why: "It changes the order of the work, not the price of it." },
] as const;

const PARTS = [
  { v: "decide", label: "I decide" },
  { v: "others", label: "I decide, with others" },
  { v: "gather", label: "I am gathering this for somebody who decides" },
  { v: "advise", label: "I am advising them" },
] as const;

export function StepAsking({ at, answers, onGo }: StepProps) {
  const copy = STEP_COPY.asking;

  return (
    <StepFrame at={at} onGo={onGo} needs={copy.stop} showBack={copy.stback}>
      <Prose step="asking" />

      <div className="grid max-w-wide gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.k} className="min-w-0">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <label
                htmlFor={`ask-${field.k}`}
                className="text-[14.5px] font-semibold text-ink"
              >
                {field.label}
              </label>
              <Kicker>{field.req ? "Required" : "Optional"}</Kicker>
            </div>

            <input
              id={`ask-${field.k}`}
              type={field.k === "email" ? "email" : "text"}
              value={answers.ask[field.k] ?? ""}
              placeholder={field.label}
              onChange={(event) => setAsk(field.k, event.target.value)}
              className="w-full rounded-field bg-well px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-label focus:bg-hair"
            />
            <p className="mt-1.5 text-[13px] leading-[1.5] text-quiet">
              {field.why}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 max-w-wide">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <b className="text-[14.5px] font-semibold text-ink">
            What part do you play in this decision
          </b>
          <Kicker>Required</Kicker>
        </div>

        <div className="flex flex-wrap gap-2">
          {PARTS.map((part) => (
            <Chip
              key={part.v}
              on={chipOn(answers, "ask.part", part.v)}
              onClick={() => toggleChip("ask.part", part.v, true, "asking")}
            >
              {part.label}
            </Chip>
          ))}
        </div>

        <p className="mt-2 max-w-measure text-[13px] leading-[1.5] text-quiet">
          So the request reaches the right person here, and so the first call is
          the right length. It is never shown back to you as a grade.
        </p>
      </div>

      <Notes step="asking" />
    </StepFrame>
  );
}

/* ----------------------------------------------------------------- keep */

export function StepKeep({ at, answers, onGo }: StepProps) {
  const copy = STEP_COPY.keep;
  const on = answers.keep === true;

  return (
    <StepFrame at={at} onGo={onGo} needs={copy.stop} showBack={copy.stback}>
      <Prose step="keep" />

      <div className="max-w-measure rounded-card bg-well p-5">
        <Kicker className="mb-2 block">Your copy of this</Kicker>
        <b className="block text-[16px] font-bold text-ink">
          {on ? "Registered" : "Not registered"}
        </b>
        <p className="mt-1.5 text-[14.5px] leading-[1.6] text-quiet">
          {on
            ? "We keep what you have written and send a link to the address you gave, so you can come back and change it."
            : "We send the document to the address you gave and that is the end of it. Nothing is saved for you to come back to."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setKeep(true)}
            className="cursor-pointer rounded-field bg-ink px-5 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Register with the address I gave
          </button>
          <button
            type="button"
            onClick={() => setKeep(false)}
            className="cursor-pointer rounded-field bg-field px-5 py-2.5 text-[14.5px] font-semibold text-quiet transition-colors hover:text-ink"
          >
            No, just send it
          </button>
        </div>
      </div>

      <Notes step="keep" />
    </StepFrame>
  );
}

/* --------------------------------------------------------------- submit */

const MINIMUMS = [
  {
    k: "who",
    title: "Who the site is for",
    why: "At least one group named, or the short way round taken. Without it there is no shape to describe.",
  },
  {
    k: "do",
    title: "What people do there",
    why: "At least one thing beyond the standard inclusions, or the short way round. The standard inclusions alone are a valid answer, but we need to have been told that on purpose.",
  },
  {
    k: "sell",
    title: "The front door of the shop, if there is one",
    why: "If you picked buying, what you sell and roughly how much of it. Without it we cannot tell a shop from a page with a price on it, and the two are not close.",
  },
  {
    k: "you",
    title: "A way to reach you",
    why: "Your name, your company, the part you play, and an email address. Everything else is about the website. This is about being able to answer.",
  },
] as const;

export function StepSubmit({ at, answers, onGo, onGoKey }: StepProps) {
  const copy = STEP_COPY.submit;
  const { met, state } = readiness(answers);
  const [stateName, stateNote] = STATES[state];

  return (
    <StepFrame at={at} onGo={onGo} needs={copy.stop} showBack={copy.stback}>
      <Prose step="submit" />

      <div className="mt-6 max-w-wide rounded-card bg-well p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className={cn(
              "mt-1.5 size-2.5 flex-none rounded-pill",
              state === "ready"
                ? "bg-ink"
                : state === "near"
                  ? "bg-quiet"
                  : "bg-planned",
            )}
          />
          <span className="min-w-0">
            <b className="block text-[17px] font-bold text-ink">{stateName}</b>
            <p className="mt-1 max-w-measure text-[14.5px] leading-[1.55] text-quiet">
              {stateNote}
            </p>
          </span>
        </div>

        <Kicker className="mt-6 mb-3 block">What it takes to be ready</Kicker>

        <ul className="flex flex-col">
          {MINIMUMS.map((minimum) => {
            const value = met[minimum.k as keyof typeof met];
            const done = Boolean(value);

            return (
              <li key={minimum.k} className="border-t border-border first:border-t-0">
                <button
                  type="button"
                  onClick={() => onGoKey?.(MIN_MAP[minimum.k])}
                  className="flex w-full cursor-pointer items-start gap-3.5 py-3.5 text-left"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-px flex size-[22px] flex-none items-center justify-center rounded-pill",
                      done ? "bg-ink text-white" : "bg-field text-planned",
                    )}
                  >
                    <Check className="size-[13px]" strokeWidth={3} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <b className="block text-[15px] font-bold text-ink">
                      {minimum.title}
                      {value === "na" ? (
                        <span className="ml-2 font-mono text-[9.5px] font-bold tracking-[0.14em] text-label uppercase">
                          Not yours to answer
                        </span>
                      ) : null}
                    </b>
                    <span className="mt-1 block max-w-measure text-[13.5px] leading-[1.5] text-quiet">
                      {minimum.why}
                    </span>
                  </span>

                  <span className="mt-1 flex flex-none items-center gap-1.5 font-mono text-[9.5px] font-bold tracking-[0.12em] text-quiet uppercase">
                    Take me to it
                    <ArrowRight aria-hidden className="size-3.5" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 max-w-measure rounded-card bg-well p-5">
        <Kicker className="mb-2 block">Going with it</Kicker>
        <b className="block text-[15.5px] font-bold text-ink">
          {answers.refs.length
            ? `${answers.refs.length} on the desk`
            : "Nothing on the desk yet"}
        </b>
        <p className="mt-1.5 text-[14px] leading-[1.55] text-quiet">
          Everything in your notes panel is sent with this, filed under the
          question it was written against. Nothing there is required, and nothing
          there is checked against anything.
        </p>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setSent(true)}
          className="cursor-pointer rounded-field bg-ink px-7 py-3.5 text-[16px] font-semibold text-white transition-opacity hover:opacity-85"
        >
          Send my scoping request
        </button>
      </div>

      <Notes step="submit" />
    </StepFrame>
  );
}
