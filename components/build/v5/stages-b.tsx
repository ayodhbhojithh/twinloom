"use client";

import { useState } from "react";

import { PAY_WAYS, REF_KINDS, SELL_KINDS, STEPS } from "@/lib/build/v5";
import { CARD_BY, LAYER_THREE } from "@/lib/build/v5-cards";
import { HAVE_GROUPS } from "@/lib/build/v5-have";
import { OPTION_LISTS } from "@/lib/build/v5-options";
import {
  addRef,
  chipsIn,
  dropRef,
  isOn,
  picked,
  setLike,
  setPick,
  toggleChip,
  togglePick,
  touchStep,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { isPicture, type Attached } from "@/lib/build/upload";

import { DropZone } from "./drop";
import { StageStep } from "./frame";
import {
  AddRow,
  AttachChip,
  Chip,
  H,
  Kicker,
  Misses,
  RefText,
  Sub,
  SubTitle,
  TickInline,
  TickRow,
  TickSet,
} from "./kit";
import { ColourStudioPanel } from "./colour-studio";
import { CardSurface, type CardLike } from "./stage-card";
import { ActionRow } from "./stages-a";

/* ---------------------------------------------------------------------------
   Steps five to eight: what you sell, how it should feel, what you already
   have, and the desk. The card behind a row takes the surface when opened,
   exactly as on the do step, so no question is ever asked in a box floating
   over another question.
--------------------------------------------------------------------------- */

type StepProps = {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
};

/* ----------------------------------------------------------------- 05 sell */

/** Which card a kind of selling opens. Bookings live under Book an
 *  appointment, so `time` opens that card rather than a copy of it - the
 *  question is asked once, whichever step it is reached from. */
function sellCard(k: string) {
  return k === "time" ? "dw-book" : `dw-${k}`;
}

export function StageSell({ at, answers, onGo }: StepProps) {
  const [open, setOpen] = useState<string | null>(null);
  const selling = picked(answers, "sell").length > 0;
  const three = LAYER_THREE[0];

  if (open) {
    const card: CardLike | undefined =
      open === three.id ? { ...three, level: three.kicker } : CARD_BY[open];

    if (card) {
      return (
        <StageStep
          at={at}
          answers={answers}
          onGo={onGo}
          scrollKey={open ?? "card"}
        >
          <CardSurface
            card={card}
            answers={answers}
            stepKey="sell"
            backLabel={STEPS[at].n}
            onBack={() => setOpen(null)}
            onOpen={setOpen}
          />
        </StageStep>
      );
    }
  }

  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>What are you selling?</H>
      <Sub>
        Each kind carries a short set of questions of its own, opened from the
        row. Skip it all if nothing is bought on the site.
      </Sub>

      <div className="mt-6 grid mx-auto max-w-[1160px] gap-x-6 lg:grid-cols-2">
        {SELL_KINDS.map((kind) => (
          <ActionRow
            key={kind.k}
            k={kind.k}
            scope="sell"
            step="sell"
            answers={answers}
            onDetail={() => setOpen(sellCard(kind.k))}
          />
        ))}
      </div>

      {/* How you sell today, and how they pay: asked only once something is
          being sold.

          Both are questions about a shop, and a page that asks how they pay
          before anybody has said anything is bought is asking about a thing
          that does not exist yet. They arrive the moment a kind is ticked. */}
      {selling
        ? OPTION_LISTS.sell.map((list) => (
            <section key={list.scope} className="mt-8 mx-auto max-w-[720px]">
              <SubTitle className="mt-0">{list.title}</SubTitle>
              {list.note ? (
                <p className="mt-0.5 text-[12.5px] leading-[1.45] text-label">
                  {list.note}
                </p>
              ) : null}
              <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
                {list.rows.map((row) => (
                  <TickRow
                    key={row.k}
                    single={row.one}
                    on={isOn(answers, row.scope, row.k)}
                    name={row.n}
                    note={row.sub}
                    onToggle={() => {
                      if (row.one) {
                        setPick(row.scope, row.k, true, true);
                        touchStep("sell");
                        return;
                      }
                      togglePick(row.scope, row.k, "sell");
                    }}
                  />
                ))}
              </div>
            </section>
          ))
        : null}

      {selling ? (
        <section className="mt-8 mx-auto max-w-[1160px]">
          <SubTitle count={PAY_WAYS.length} className="mt-0">
            How they pay
          </SubTitle>
          <div className="mt-2 grid gap-x-6 lg:grid-cols-2">
            {PAY_WAYS.map((way) => (
              <ActionRow
                key={way.k}
                k={way.k}
                scope="pay"
                step="sell"
                answers={answers}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* The back of the shop, only once there is a shop. Its questions turn
          up late and cost money when they do, and "not sure yet" is a real
          answer to every one of them. */}
      {selling ? (
        <section className="mt-8 mx-auto max-w-[720px]">
          <button
            type="button"
            onClick={() => setOpen(three.id)}
            className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[14px] bg-canvas px-4.5 py-3.5 text-left transition-colors hover:bg-hair"
          >
            <span className="min-w-0">
              <Kicker className="block">{three.kicker}</Kicker>
              <b className="mt-1 block text-[15px] font-bold text-ink">
                {three.title}
              </b>
              <span className="mt-0.5 block text-[12.5px] leading-[1.45] text-quiet">
                {three.questions.length} questions, and none of them holds
                anything up today.
              </span>
            </span>
            <span className="flex-none font-mono text-[9.5px] font-bold tracking-[0.12em] text-quiet uppercase">
              Open
            </span>
          </button>
        </section>
      ) : null}

      <Misses step="sell" answers={answers} />
    </StageStep>
  );
}

/* ---------------------------------------------------------------- 06 style */

const STYLE_CARDS = ["dw-brandfiles", "dw-picker", "dw-typeface"] as const;

export function StageStyle({ at, answers, onGo }: StepProps) {
  const [open, setOpen] = useState<string | null>(null);
  const [feel, ...single] = OPTION_LISTS.style;

  if (open && CARD_BY[open]) {
    return (
      <StageStep
        at={at}
        answers={answers}
        onGo={onGo}
        scrollKey={open ?? "card"}
      >
        <CardSurface
          card={CARD_BY[open]}
          answers={answers}
          stepKey="style"
          backLabel={STEPS[at].n}
          onBack={() => setOpen(null)}
          onOpen={setOpen}
        />
      </StageStep>
    );
  }

  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>How should it feel?</H>
      <Sub>
        The one step where a feeling is a real answer. Nothing here puts a page
        on your site - it changes how every page you have described looks.
      </Sub>

      <section className="mt-6 mx-auto max-w-[1100px]">
        <SubTitle className="mt-0">{feel.title}</SubTitle>
        <p className="mt-0.5 text-[12.5px] leading-[1.45] text-label">
          {feel.note}
        </p>
        <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
          {feel.rows.map((row) => (
            <TickRow
              key={row.k}
              on={isOn(answers, row.scope, row.k)}
              name={row.n}
              note={row.sub}
              onToggle={() => togglePick(row.scope, row.k, "style")}
            />
          ))}
        </div>
      </section>

      {/* The three one-answer questions, side by side: colour, light or dark,
          and type. Chips, because each is a choice between alternatives. */}
      <div className="mt-8 grid mx-auto max-w-[1100px] gap-x-10 gap-y-7 lg:grid-cols-3">
        {single.map((list) => (
          <section key={list.scope} className="min-w-0">
            <SubTitle className="mt-0">{list.title}</SubTitle>
            {list.note ? (
              <p className="mt-0.5 text-[12.5px] leading-[1.45] text-label">
                {list.note}
              </p>
            ) : null}
            <TickSet
              single
              options={list.rows.map((row) => ({
                k: row.k,
                label: row.n,
                note: row.sub || undefined,
              }))}
              isOn={(k: string) => isOn(answers, list.scope, k)}
              onPick={(k: string) => {
                setPick(list.scope, k, true, true);
                touchStep("style");
              }}
            />
          </section>
        ))}
      </div>

      <ColourStudioPanel />

      <section className="mt-8 mx-auto max-w-[1100px]">
        <SubTitle className="mt-0">Behind this, if you have them</SubTitle>
        <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
          {STYLE_CARDS.map((id) => {
            const card = CARD_BY[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => setOpen(id)}
                className="flex cursor-pointer flex-col rounded-[14px] bg-canvas p-4 text-left transition-colors hover:bg-hair"
              >
                <b className="text-[14px] leading-[1.25] font-bold text-ink">
                  {card.title}
                </b>
                <span className="mt-1 line-clamp-2 text-[12px] leading-[1.45] text-quiet">
                  {card.note}
                </span>
                <span className="mt-2.5 font-mono text-[9px] font-bold tracking-[0.12em] text-quiet uppercase">
                  Open
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <Misses step="style" answers={answers} />
    </StageStep>
  );
}

/* ----------------------------------------------------------------- 07 have */

export function StageHave({ at, answers, onGo }: StepProps) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <StageStep at={at} answers={answers} onGo={onGo} scrollKey="dw-have">
        <CardSurface
          card={CARD_BY["dw-have"]}
          answers={answers}
          stepKey="have"
          backLabel={STEPS[at].n}
          onBack={() => setOpen(false)}
        />
      </StageStep>
    );
  }

  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>What do you already have?</H>
      <Sub>
        Three answers a row, and the middle one is the honest one most of the
        time. Marking a row as needing help removes questions later on.
      </Sub>

      <div className="mt-6 grid mx-auto max-w-[1240px] gap-x-10 gap-y-7 xl:grid-cols-2">
        {HAVE_GROUPS.map((group) => (
          <section key={group.title} className="min-w-0">
            <SubTitle className="mt-0">{group.title}</SubTitle>

            <div className="mt-2 flex flex-col">
              {group.rows.map((row) => {
                const value = chipsIn(answers, row.q)[0];

                return (
                  <div
                    key={row.key}
                    /* Stacked, always. Laid out as a wrapping row, a short
                       title kept its answers beside it and a long one pushed
                       them onto the next line, so thirteen rows sat in two
                       different shapes for no reason a reader could see. */
                    className="rounded-[10px] px-2.5 py-2 transition-colors hover:bg-canvas"
                  >
                    <span className="block">
                      <span className="block text-[13.5px] leading-[1.25] font-semibold text-ink">
                        {row.title}
                      </span>
                      {row.note ? (
                        <span className="mt-0.5 block text-[11.5px] leading-[1.35] text-label">
                          {row.note}
                        </span>
                      ) : null}
                    </span>

                    {/* Three answers, ticked rather than pilled. The middle
                        one is the honest answer most of the time, so it is
                        offered as plainly as the other two rather than being
                        the gap between yes and no. */}
                    <span
                      role="radiogroup"
                      aria-label={row.title}
                      className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1"
                    >
                      {[
                        ["have", "We have it"],
                        ["tidy", "Needs tidying"],
                        ["help", "We would like help"],
                      ].map(([k, label]) => (
                        <TickInline
                          key={k}
                          on={value === k}
                          label={label}
                          onPick={() => toggleChip(row.q, k, true, "have")}
                        />
                      ))}

                      {row.attach ? (
                        <AttachChip
                          attach={row.attach}
                          answers={answers}
                          stepKey="have"
                          where={{ stepKey: "have", qid: row.q, q: row.title }}
                        />
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-7">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-pill bg-canvas px-4 py-2 text-[13px] font-semibold text-body transition-colors hover:bg-hair hover:text-ink"
        >
          {CARD_BY["dw-have"].title}
        </button>
      </div>
    </StageStep>
  );
}

/* ----------------------------------------------------------------- 08 refs */

export function StageRefs({ at, answers, onGo }: StepProps) {
  const [kind, setKind] = useState<string>("note");
  const [files, setFiles] = useState<Attached[]>([]);

  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>Anything you would rather show us?</H>
      <Sub>
        A link, a file, a sentence. Say what you like about it - that sentence
        is worth more to us than the link on its own.
      </Sub>

      <div className="mt-6 mx-auto max-w-[720px]">
        {/* The file goes in rather than getting named.

            "Or the name of a file" was the whole of the old answer: somebody
            typed "brochure.pdf" and nothing was attached to anything. A
            document, an image and a screenshot are files, so they go where they
            can be handed over; a note and a link were only ever a line of text,
            and they stay one. */}
        <DropZone
          label="Drop files here, or choose them"
          note="Pictures, brochures, price lists, screenshots. Up to 10 MB each."
          files={files}
          onAdd={(taken) => {
            setFiles((was) => [...was, ...taken]);
            for (const file of taken) {
              addRef(
                {
                  kind: isPicture(file.type) ? REF_KINDS.image : REF_KINDS.file,
                  text: file.name,
                  where: null,
                  url: file.url,
                  publicId: file.publicId,
                },
                "refs",
              );
            }
          }}
          onDrop={(at2) =>
            setFiles((was) => was.filter((_, index) => index !== at2))
          }
        />

        {/* The chips and the row they change, side by side.

            Stacked, the two read as separate controls and the row asked its
            question twice - once as a pair of chips and again as a placeholder
            underneath them. On one line the chip is plainly the switch for the
            field beside it. */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex flex-none items-center gap-2">
            {(["note", "site"] as const).map((key) => (
              <Chip key={key} on={kind === key} onClick={() => setKind(key)}>
                {REF_KINDS[key]}
              </Chip>
            ))}
          </div>

          <div className="min-w-[240px] flex-1">
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
                addRef(
                  { kind: REF_KINDS[kind], text: value, where: null },
                  "refs",
                )
              }
            />
          </div>
        </div>

        {answers.refs.length ? (
          <ul className="mt-4 flex flex-col gap-1.5">
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
                    "placeholder:text-label focus:border-ink sm:w-[220px]",
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
        ) : (
          <p className="mt-4 text-[13px] leading-[1.5] text-quiet">
            Nothing added yet, and that is a real answer - this list is never
            required. It is the same list the notes panel keeps.
          </p>
        )}
      </div>
    </StageStep>
  );
}
