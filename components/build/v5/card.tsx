"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";

import type { Card, CardQuestion } from "@/lib/build/v5-cards";
import {
  addOwn,
  addRef,
  chipOn,
  dropOwn,
  dropRefTied,
  setText,
  toggleChip,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { Chip, Kicker, WriteIn } from "./parts";

/* ---------------------------------------------------------------------------
   Layer two, in place.

   One component for all nineteen cards, because the prototype gives them one
   shape: a title, a note, a run of questions, somewhere to say the thing the
   card did not ask, and two ways on. Nineteen hand-written cards would have
   been nineteen chances for one of them to lose its fork.

   It opens as a dialog. Inline, a card pushed forty rows down the page and left
   the reader scrolling to find what they had just opened; over the page, the
   questions are the only thing on screen while they are being answered, and the
   row underneath is exactly where you were when it shuts.
--------------------------------------------------------------------------- */

export function DetailCard({
  card,
  answers,
  stepKey,
  onGoto,
  onClose,
  framed,
}: {
  card: Card;
  answers: Answers;
  stepKey: string;
  /** Follow a pointer to the card where a shared question actually lives. */
  onGoto?: (id: string) => void;
  onClose: () => void;
  /** Set when it is the whole of a dialog and needs no ground of its own. */
  framed?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-5 sm:p-6",
        framed ? "" : "mt-2 rounded-card border border-border bg-well",
      )}
    >
      <div
        className={cn(
          "mb-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-3",
          framed && "sticky -top-6 z-10 -mx-6 -mt-6 border-b border-border bg-field px-6 pt-6 pb-4",
        )}
      >
        <div className="min-w-0 max-w-measure">
          <b className="block text-[17px] leading-[1.25] font-bold text-ink">
            {card.title}
          </b>
          <p className="mt-1.5 text-[14px] leading-[1.55] text-quiet">
            {card.note}
          </p>
        </div>

        <div className="flex flex-none items-center gap-3">
          <Kicker>{card.level}</Kicker>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close detail"
            className="flex size-8 cursor-pointer items-center justify-center rounded-pill bg-well text-quiet transition-colors hover:bg-hair hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {card.questions.map((question, n) => (
          <Question
            key={question.q || `q-${n}`}
            question={question}
            answers={answers}
            stepKey={stepKey}
            onGoto={onGoto}
          />
        ))}
      </div>

      {card.miss ? (
        <OwnWords
          listId={card.miss.id}
          label={card.miss.label}
          placeholder={card.miss.placeholder}
          answers={answers}
          stepKey={stepKey}
        />
      ) : null}

      {card.fork ? (
        <div className="mt-6 border-t border-border pt-5">
          <Kicker className="mb-3 block">{card.fork.title}</Kicker>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-field bg-ink px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
            >
              {card.fork.use}
            </button>
            <button
              type="button"
              onClick={() =>
                addRef(
                  {
                    kind: "To send",
                    text: `${card.title}: something to attach`,
                    where: { stepKey, cardId: card.id, card: card.title },
                  },
                  stepKey,
                )
              }
              className="cursor-pointer rounded-field bg-field px-4 py-2 text-[14px] font-semibold text-ink transition-colors hover:bg-hair"
            >
              {card.fork.more}
            </button>
          </div>

          <p className="mt-3 max-w-measure text-[13.5px] leading-[1.55] text-quiet">
            {card.fork.note}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Question({
  question,
  answers,
  stepKey,
  onGoto,
}: {
  question: CardQuestion;
  answers: Answers;
  stepKey: string;
  onGoto?: (id: string) => void;
}) {
  return (
    <div className="min-w-0">
      <b className="block text-[15.5px] leading-[1.3] font-bold text-ink">
        {question.title}
      </b>
      {question.note ? (
        <p className="mt-1 max-w-measure text-[13.5px] leading-[1.5] text-quiet">
          {question.note}
        </p>
      ) : null}

      {(question.groups ?? []).map((group, n) => (
        <div key={n} className="mt-3 flex flex-wrap items-center gap-2">
          {group.label ? (
            <Kicker className="mr-1">{group.label}</Kicker>
          ) : null}

          {(group.chips ?? []).map((chip) => (
            <Chip
              key={chip.v}
              on={chipOn(answers, question.q, chip.v)}
              onClick={() => toggleChip(question.q, chip.v, group.one, stepKey)}
            >
              {chip.label}
            </Chip>
          ))}

          {/* A swatch says the colour rather than naming it. The name stays
              beside it, because a colour with no name cannot be asked for on
              the phone. */}
          {(group.swatches ?? []).map((swatch) => {
            const on = chipOn(answers, swatch.q, swatch.v);
            return (
              <button
                key={swatch.v}
                type="button"
                aria-pressed={on}
                onClick={() => toggleChip(swatch.q, swatch.v, false, stepKey)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-pill py-1.5 pr-3.5 pl-2 text-[13px] font-semibold transition-colors",
                  on
                    ? "bg-done text-white"
                    : "bg-planned text-body hover:bg-border hover:text-ink",
                )}
              >
                <span
                  aria-hidden
                  className="size-4 flex-none rounded-pill"
                  style={{ background: swatch.hex }}
                />
                {swatch.label}
              </button>
            );
          })}

          {/* An attach is a promise to send something, and it is recorded as
              one: pressing it puts a line on the desk, pressing it again takes
              that line off. */}
          {(group.attach ?? []).map((attach) => (
            <AttachChip
              key={attach.key}
              attach={attach}
              answers={answers}
              stepKey={stepKey}
              question={question}
            />
          ))}

          {group.goto && onGoto ? (
            <button
              type="button"
              onClick={() => onGoto(group.goto!.to)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-pill bg-ink px-4 py-2 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
            >
              {group.goto.label}
              <ArrowRight aria-hidden className="size-[15px]" />
            </button>
          ) : null}
        </div>
      ))}

      {question.textarea ? (
        <WriteIn
          id={`q-${question.q}`}
          rows={question.textarea.rows}
          placeholder={question.textarea.placeholder}
          value={answers.text[question.textarea.t] ?? ""}
          onChange={(value) => setText(question.textarea!.t, value, stepKey)}
        />
      ) : null}
    </div>
  );
}

function AttachChip({
  attach,
  answers,
  stepKey,
  question,
}: {
  attach: { key: string; label: string };
  answers: Answers;
  stepKey: string;
  question: CardQuestion;
}) {
  const on = answers.refs.some((ref) => ref.tie === attach.key);

  return (
    <Chip
      on={on}
      onClick={() => {
        if (on) {
          dropRefTied(attach.key);
          return;
        }
        addRef(
          {
            kind: "To send",
            text: attach.label,
            tie: attach.key,
            where: { stepKey, qid: question.q, q: question.title },
          },
          stepKey,
        );
      }}
    >
      {attach.label}
    </Chip>
  );
}

/**
 * Somewhere to say the thing the card did not ask.
 *
 * On every card, and it is the answer to the objection every set of questions
 * raises: a list of options is a list of our guesses, and the one that matters
 * is often not on it.
 */
export function OwnWords({
  listId,
  label,
  placeholder,
  answers,
  stepKey,
}: {
  listId: string;
  label: string;
  placeholder: string;
  answers: Answers;
  stepKey: string;
}) {
  const [draft, setDraft] = useState("");
  const said = answers.own[listId] ?? [];

  return (
    <div className="mt-5 max-w-measure">
      <label
        htmlFor={`own-${listId}`}
        className="mb-2 block text-[14.5px] font-semibold text-ink"
      >
        {label}
      </label>

      <form
        className="flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          addOwn(listId, draft, stepKey);
          setDraft("");
        }}
      >
        <input
          id={`own-${listId}`}
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          className="min-w-0 flex-1 rounded-field border border-border bg-field px-3.5 py-1.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-label focus:border-ink"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="flex-none cursor-pointer rounded-field bg-ink px-3.5 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-default disabled:bg-planned disabled:text-white"
        >
          Add
        </button>
      </form>

      {said.length ? (
        <ul className="mt-3 flex flex-col gap-1.5">
          {said.map((words, at) => (
            <li
              key={`${listId}-${at}`}
              className="flex items-center gap-3 rounded-field border border-border bg-field px-3.5 py-1.5"
            >
              <span className="min-w-0 flex-1 text-[14px] leading-[1.45] text-ink">
                {words}
              </span>
              <button
                type="button"
                onClick={() => dropOwn(listId, at)}
                className="flex-none cursor-pointer font-mono text-[10px] font-bold tracking-[0.14em] text-label uppercase transition-colors hover:text-ink"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}


/**
 * A card, opened over the page.
 *
 * Escape shuts it, the page behind it does not scroll, focus goes to the panel
 * and comes back to whatever opened it. A dialog that traps somebody with no way
 * out but the mouse is worse than no dialog.
 */
export function CardDialog({
  card,
  answers,
  stepKey,
  onGoto,
  onClose,
}: {
  card: Card;
  answers: Answers;
  stepKey: string;
  onGoto?: (id: string) => void;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const came = useRef<HTMLElement | null>(null);

  useEffect(() => {
    came.current = document.activeElement as HTMLElement | null;
    const held = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = held;
      window.removeEventListener("keydown", onKey);
      came.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        onClick={onClose}
        aria-hidden
        className="absolute inset-0 bg-ink/35"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={card.title}
        tabIndex={-1}
        className="quiet-scroll relative max-h-[88svh] w-full max-w-[1040px] overflow-y-auto rounded-t-[18px] bg-field outline-none sm:rounded-[18px]"
      >
        <DetailCard
          card={card}
          answers={answers}
          stepKey={stepKey}
          onGoto={onGoto}
          onClose={onClose}
          framed
        />
      </div>
    </div>
  );
}
