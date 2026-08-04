"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

import { ACTIONS, GROUPS, STEPS } from "@/lib/build/v5";
import { CARD_BY } from "@/lib/build/v5-cards";
import { orderedActions } from "@/lib/build/v5-derive";
import { BANDS, ROWS } from "@/lib/build/v5-rows";
import { WIRES } from "@/lib/build/v5-wires";
import {
  isOn,
  picked,
  setOrder,
  setPick,
  togglePick,
  touchStep,
  type Answers,
} from "@/lib/build/v5-store";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

import { StageStep } from "./frame";
import { Glyph } from "./glyph";
import { H, Kicker, Misses, Sub, SubTitle, TickRow } from "./kit";
import { CardSurface } from "./stage-card";

/* ---------------------------------------------------------------------------
   The first four steps, on the surface.

   Every feature the document version had is here; what has gone is the
   reading. A step is its question, its answers, and the box for the thing we
   did not think to ask - the paragraphs that explained the question before
   letting you at it are not.
--------------------------------------------------------------------------- */

type StepProps = {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
};

/* --------------------------------------------------------------- 01 arrive */

export function StageArrive({ at, answers, onGo }: StepProps) {
  const facts = [
    { n: "12", label: "Steps", note: "Only two of them compulsory" },
    { n: "0", label: "Prices", note: "Nothing here is scored or quoted" },
    { n: "2", label: "Working days", note: "To a written scope, in your words" },
  ];

  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>A written scope, in your words.</H>
      <Sub>
        Answer what you like and leave the rest - an unanswered question becomes
        an assumption you can correct, never a hole.
      </Sub>

      {/* The three facts of the arrangement, at the weight of facts rather
          than of paragraphs. */}
      <div className="mt-7 grid max-w-[820px] gap-3 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-[16px] bg-field p-5">
            <b className="block font-mono text-[30px] leading-none font-bold text-ink tabular-nums">
              {fact.n}
            </b>
            <Kicker className="mt-2.5 block text-ink">{fact.label}</Kicker>
            <span className="mt-1 block text-[12.5px] leading-[1.45] text-quiet">
              {fact.note}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link
          href={ROUTES.site}
          className="group/floor inline-flex items-center gap-2 rounded-pill bg-ink px-4.5 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
        >
          What every website includes
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform group-hover/floor:translate-x-0.5 group-hover/floor:-translate-y-0.5"
          />
        </Link>

        <p className="text-[13px] leading-[1.5] text-quiet">
          Eleven things, on every site we build. Your answers add to that floor
          and never take from it.
        </p>
      </div>
    </StageStep>
  );
}

/* --------------------------------------------------------------- 02 layout */

export function StageLayout({ at, answers, onGo }: StepProps) {
  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>Pick a shape.</H>
      <Sub>
        The one closest to the site in your head. A starting point for the
        first drawing, not a decision - change it later and nothing else moves.
      </Sub>

      <div className="mt-7 grid max-w-[1160px] gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {WIRES.map((wire) => {
          const on = isOn(answers, "layout", wire.k);

          return (
            <button
              key={wire.k}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setPick("layout", wire.k, true, true);
                touchStep("layout");
              }}
              className={cn(
                "group/wire relative flex cursor-pointer flex-col rounded-[16px] p-4 text-left transition-colors",
                on ? "bg-field ring-2 ring-ink" : "bg-field hover:bg-hair",
              )}
            >
              {on ? (
                <span
                  aria-hidden
                  className="absolute top-3 right-3 flex size-[22px] items-center justify-center rounded-pill bg-mark text-white"
                >
                  <Check className="size-[12px]" strokeWidth={3.2} />
                </span>
              ) : null}

              <span className="mb-3.5 block overflow-hidden rounded-[10px] bg-well p-2">
                <svg viewBox="0 0 160 108" aria-hidden className="block w-full">
                  {wire.bars.map((bar, n) => (
                    <rect
                      key={n}
                      x={bar.x}
                      y={bar.y}
                      width={bar.w}
                      height={bar.h}
                      rx={2}
                      fill="currentColor"
                      className={cn(
                        "text-ink",
                        bar.kind === "h"
                          ? "opacity-70"
                          : bar.kind === "b"
                            ? "opacity-40"
                            : "opacity-[0.14]",
                      )}
                    />
                  ))}
                </svg>
              </span>

              <b className="text-[14.5px] leading-[1.25] font-bold text-ink">
                {wire.n}
              </b>
              <span className="mt-1 block text-[12.5px] leading-[1.45] text-quiet">
                {wire.d}
              </span>
              <span className="mt-2.5 block font-mono text-[9px] font-semibold tracking-[0.1em] text-idx uppercase">
                {wire.w}
              </span>
            </button>
          );
        })}
      </div>

      <Misses step="layout" answers={answers} />
    </StageStep>
  );
}

/* ------------------------------------------------------------------ 03 who */

export function StageWho({ at, answers, onGo }: StepProps) {
  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>Who comes to your website?</H>
      <Sub>
        Tick everyone who might arrive. The next step is written by what you
        tick here, so nothing is ever on offer that nobody asked for.
      </Sub>

      <div className="mt-6 grid max-w-[1100px] gap-x-6 sm:grid-cols-2">
        {GROUPS.map((group) => (
          <TickRow
            key={group.k}
            on={isOn(answers, "who", group.k)}
            name={group.n}
            mark={group.pages.length ? `Adds ${group.pages[0]}` : "No page"}
            onToggle={() => togglePick("who", group.k, "who")}
          />
        ))}
      </div>

      <Misses step="who" answers={answers} />
    </StageStep>
  );
}

/* ------------------------------------------------------------------- 04 do */

/**
 * One thing a visitor can do: its picture, its name, what ticking it gets you,
 * and the way into the questions behind it where it has any.
 */
export function ActionRow({
  k,
  scope,
  step,
  answers,
  fixed,
  onDetail,
}: {
  k: string;
  scope: string;
  step: string;
  answers: Answers;
  fixed?: boolean;
  onDetail?: () => void;
}) {
  const meta = ROWS[k];
  const on = fixed || isOn(answers, scope, k);
  if (!meta) return null;

  return (
    <div
      role={fixed ? undefined : "checkbox"}
      aria-checked={fixed ? undefined : on}
      tabIndex={fixed ? undefined : 0}
      onClick={fixed ? undefined : () => togglePick(scope, k, step)}
      onKeyDown={
        fixed
          ? undefined
          : (event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                togglePick(scope, k, step);
              }
            }
      }
      className={cn(
        "group/row flex w-full items-center gap-3.5 rounded-[12px] px-3 py-2.5 text-left transition-colors",
        fixed ? "cursor-default" : "cursor-pointer hover:bg-field",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-[21px] flex-none items-center justify-center rounded-pill border-2 transition-colors",
          on
            ? "border-mark bg-mark text-white"
            : "border-planned text-transparent group-hover/row:border-quiet",
        )}
      >
        <Check className="size-[12px]" strokeWidth={3.2} />
      </span>

      <span
        aria-hidden
        className={cn(
          "flex size-9 flex-none items-center justify-center rounded-[10px] transition-colors",
          on ? "bg-field text-ink" : "bg-field/60 text-quiet",
        )}
      >
        <Glyph parts={meta.icon} className="size-[19px]" />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[14.5px] leading-[1.25] font-semibold",
            on ? "text-ink" : "text-body",
          )}
        >
          {meta.n}
        </span>
        <span className="mt-0.5 block text-[12px] leading-[1.4] text-label">
          {meta.sub}
        </span>
      </span>

      <span
        className={cn(
          "hidden flex-none font-mono text-[9px] font-bold tracking-[0.1em] uppercase sm:block",
          on ? "text-mark" : "text-idx",
        )}
      >
        {fixed ? "Always" : on ? "On the list" : "Pick"}
      </span>

      {onDetail ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDetail();
          }}
          className="flex-none cursor-pointer rounded-pill border border-border bg-field px-3 py-1 text-[12px] font-semibold text-body transition-colors hover:border-quiet hover:text-ink"
        >
          Detail
        </button>
      ) : null}
    </div>
  );
}

export function StageDo({ at, answers, onGo }: StepProps) {
  const [open, setOpen] = useState<string | null>(null);
  const needs = picked(answers, "who");
  const order = orderedActions(answers);

  if (open && CARD_BY[open]) {
    return (
      <StageStep at={at} answers={answers} onGo={onGo}>
        <CardSurface
          card={CARD_BY[open]}
          answers={answers}
          stepKey="do"
          backLabel={STEPS[at].n}
          onBack={() => setOpen(null)}
          onOpen={setOpen}
        />
      </StageStep>
    );
  }

  const bands = BANDS.filter(
    (band) => band.step === "do" && (!band.need || needs.includes(band.need)),
  );

  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>What can your visitors do?</H>
      <Sub>
        Three start ticked because most sites want them. A row with Detail has a
        few questions behind it, asked only when the answer changes what gets
        built.
      </Sub>

      {bands.map((band) => {
        const rows = ACTIONS.filter((action) => action.band === band.band);
        if (!rows.length) return null;

        return (
          <section key={band.band} className="mt-7 max-w-[1160px]">
            <SubTitle count={rows.length} className="mt-0">
              {band.title}
            </SubTitle>
            <p className="mt-0.5 text-[12.5px] leading-[1.45] text-label">
              {band.note}
            </p>

            <div className="mt-2.5 grid gap-x-6 lg:grid-cols-2">
              {rows.map((action) => (
                <ActionRow
                  key={action.k}
                  k={action.k}
                  scope="do"
                  step="do"
                  answers={answers}
                  fixed={action.pre === "fix"}
                  onDetail={
                    action.l2 ? () => setOpen(`dw-${action.l2}`) : undefined
                  }
                />
              ))}
            </div>
          </section>
        );
      })}

      {order.length > 1 ? (
        <section className="mt-8 max-w-[560px]">
          <SubTitle className="mt-0">{CARD_BY["dw-order"].title}</SubTitle>
          <p className="mt-0.5 text-[12.5px] leading-[1.45] text-label">
            {CARD_BY["dw-order"].note}
          </p>
          <OrderList order={order} />
        </section>
      ) : null}

      <Misses step="do" answers={answers} />
    </StageStep>
  );
}

/**
 * The order the things are met in. The home page leads with whatever is
 * first, and which one that is belongs to somebody who knows the business.
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
    <ol className="mt-2.5">
      {order.map((key, n) => (
        <li
          key={key}
          className="flex items-center gap-3 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-field"
        >
          <span className="w-6 flex-none font-mono text-[10px] font-bold text-idx tabular-nums">
            {String(n + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1 text-[13.5px] font-semibold text-ink">
            {byKey[key]?.n ?? key}
          </span>
          <span className="flex flex-none gap-1">
            <button
              type="button"
              aria-label="Move up"
              onClick={() => move(n, n - 1)}
              className="cursor-pointer rounded-pill bg-field px-2.5 py-1 font-mono text-[9.5px] font-bold text-quiet transition-colors hover:text-ink"
            >
              Up
            </button>
            <button
              type="button"
              aria-label="Move down"
              onClick={() => move(n, n + 1)}
              className="cursor-pointer rounded-pill bg-field px-2.5 py-1 font-mono text-[9.5px] font-bold text-quiet transition-colors hover:text-ink"
            >
              Down
            </button>
          </span>
        </li>
      ))}
    </ol>
  );
}
