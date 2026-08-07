"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";

import type { CardFork, CardMiss, CardQuestion } from "@/lib/build/v5-cards";
import {
  addRef,
  chipOn,
  setText,
  toggleChip,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { CutPanel } from "@/components/layout/cut-panel";

import { AttachChip, Kicker, OwnList, Pill, TickSet } from "./kit";

/* ---------------------------------------------------------------------------
   Layer two, on the surface.

   A card does not open over the page and does not push the rows apart. The way
   back and what this is stay at the top of the step, where the step's own
   heading was; the questions go on a white card of their own, cut the way
   every surface here is cut, sitting on the step's ground.

   Two surfaces, one inside the other, and the inner one a different colour.
   That is the difference between a step and something opened from inside it -
   switching a surface for another surface drawn the same way left nothing to
   say anything had happened at all.

   The back control returns you to the row you came from, which is still
   exactly where it was.

   One renderer for all nineteen cards and for the back of the shop, because
   the source gives them one shape: a title, a note, some questions, somewhere
   to say the thing the card did not ask, and two ways on.
--------------------------------------------------------------------------- */

/** The shape every card and the layer-three block share. */
export interface CardLike {
  id: string;
  title: string;
  note: string;
  level?: string;
  questions: CardQuestion[];
  miss?: CardMiss;
  fork?: CardFork;
}

export function CardSurface({
  card,
  answers,
  stepKey,
  backLabel,
  onBack,
  onOpen,
}: {
  card: CardLike;
  answers: Answers;
  stepKey: string;
  /** What the back control names: the list this card was opened from. */
  backLabel: string;
  onBack: () => void;
  /** Follow a pointer to the card where a shared question actually lives. */
  onOpen?: (id: string) => void;
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="group/back flex cursor-pointer items-center gap-2 rounded-pill bg-well px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:bg-hair"
        >
          <ArrowLeft
            aria-hidden
            className="size-3.5 transition-transform group-hover/back:-translate-x-0.5"
          />
          {backLabel}
        </button>

        <Kicker>{card.level ?? "Layer two"}</Kicker>
      </div>

      <h3 className="mt-4 max-w-[min(26ch,var(--notch-free,62ch))] text-[clamp(19px,1.7vw,24px)] leading-[1.12] font-extrabold tracking-[-0.03em] text-ink">
        {card.title}
      </h3>
      <p className="mt-2 max-w-[62ch] text-[13.5px] leading-[1.5] text-quiet">
        {card.note}
      </p>

      {/* The questions, on a card of their own. Cut like everything else, and
          white so it reads as laid on the step rather than as the step. */}
      <CutPanel tone="field" className="mt-6 w-full">
        <div className="flex mx-auto max-w-[760px] flex-col gap-6">
          {card.questions.map((question, n) => (
            <Question
              key={question.q || `${card.id}-q${n}`}
              question={question}
              answers={answers}
              stepKey={stepKey}
              onOpen={onOpen}
            />
          ))}
        </div>

        {card.miss ? (
          <OwnList
            listId={card.miss.id}
            label={card.miss.label}
            placeholder={card.miss.placeholder}
            answers={answers}
            stepKey={stepKey}
          />
        ) : null}

        {card.fork ? (
          <div className="mt-8 border-t border-border pt-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <Pill tone="ink" onClick={onBack}>
                {card.fork.use}
              </Pill>
              <Pill
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
              >
                {card.fork.more}
              </Pill>
            </div>
            <p className="mt-3 max-w-[62ch] text-[12.5px] leading-[1.5] text-label">
              {card.fork.note}
            </p>
          </div>
        ) : null}
      </CutPanel>
    </div>
  );
}

function Question({
  question,
  answers,
  stepKey,
  onOpen,
}: {
  question: CardQuestion;
  answers: Answers;
  stepKey: string;
  onOpen?: (id: string) => void;
}) {
  return (
    <div className="min-w-0">
      <b className="block text-[15px] leading-[1.3] font-bold text-ink">
        {question.title}
      </b>
      {question.note ? (
        <p className="mt-0.5 max-w-[62ch] text-[12.5px] leading-[1.45] text-label">
          {question.note}
        </p>
      ) : null}

      {(question.groups ?? []).map((group, n) => (
        <div
          key={n}
          className="mt-3 flex flex-wrap items-center gap-2 empty:mt-0"
        >
          {group.label ? <Kicker className="mr-1">{group.label}</Kicker> : null}

          {group.chips?.length ? (
            <TickSet
              className="mt-0 w-full"
              single={group.one}
              options={group.chips.map((chip) => ({
                k: chip.v,
                label: chip.label,
              }))}
              isOn={(k) => chipOn(answers, question.q, k)}
              onPick={(k) => toggleChip(question.q, k, group.one, stepKey)}
            />
          ) : null}

          {/* A swatch says the colour rather than naming it, and keeps its
              name beside it: a colour with no name cannot be asked for on the
              phone. */}
          {(group.swatches ?? []).map((swatch) => {
            const on = chipOn(answers, swatch.q, swatch.v);
            return (
              <button
                key={swatch.v}
                type="button"
                aria-pressed={on}
                onClick={() => toggleChip(swatch.q, swatch.v, false, stepKey)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-pill border py-1.5 pr-3.5 pl-2 text-[13px] font-semibold transition-colors",
                  on
                    ? "border-ink bg-ink text-white"
                    : "border-border bg-well text-body hover:border-quiet",
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

          {(group.attach ?? []).map((attach) => (
            <AttachChip
              key={attach.key}
              attach={attach}
              answers={answers}
              stepKey={stepKey}
              where={{ stepKey, qid: question.q, q: question.title }}
            />
          ))}

          {group.goto && onOpen ? (
            <button
              type="button"
              onClick={() => onOpen(group.goto!.to)}
              className="group/go inline-flex cursor-pointer items-center gap-2 rounded-pill bg-ink px-4 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
            >
              {group.goto.label}
              <ArrowUpRight
                aria-hidden
                className="size-3.5 transition-transform group-hover/go:translate-x-0.5 group-hover/go:-translate-y-0.5"
              />
            </button>
          ) : null}
        </div>
      ))}

      {question.textarea ? (
        <textarea
          rows={question.textarea.rows}
          aria-label={question.title}
          value={answers.text[question.textarea.t] ?? ""}
          placeholder={question.textarea.placeholder}
          onChange={(event) =>
            setText(question.textarea!.t, event.target.value, stepKey)
          }
          className="mt-3 w-full mx-auto max-w-[560px] resize-y rounded-card border border-border bg-well px-3.5 py-2 text-[14px] leading-[1.6] text-ink outline-none transition-colors placeholder:text-label focus:border-ink"
        />
      ) : null}
    </div>
  );
}
