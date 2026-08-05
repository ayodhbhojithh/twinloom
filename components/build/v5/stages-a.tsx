"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { ACTIONS, GROUPS, STEPS } from "@/lib/build/v5";
import { CARD_BY } from "@/lib/build/v5-cards";
import { orderedActions } from "@/lib/build/v5-derive";
import { BANDS, ROWS } from "@/lib/build/v5-rows";
import {
  isOn,
  picked,
  setOrder,
  togglePick,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { StageStep } from "./frame";
import { Glyph } from "./glyph";
import { H, Misses, Sub, SubTitle, TickRow } from "./kit";
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

/* --------------------------------------------------------------- 02 layout */

/* ------------------------------------------------------------------ 03 who */

export function StageWho({ at, answers, onGo }: StepProps) {
  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>Who comes to your website?</H>
      {/* No note at the end of each row saying which page it adds. The panel
          beside the step already lists every page and who asked for it, so the
          row was answering a question that is answered better a few inches to
          the right - and it was answering it eleven times. */}
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
        fixed ? "cursor-default" : "cursor-pointer hover:bg-canvas",
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
      <StageStep at={at} answers={answers} onGo={onGo} scrollKey={open ?? "card"}>
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
          className="flex items-center gap-3 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-canvas"
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
              className="cursor-pointer rounded-pill bg-canvas px-2.5 py-1 font-mono text-[9.5px] font-bold text-quiet transition-colors hover:text-ink"
            >
              Up
            </button>
            <button
              type="button"
              aria-label="Move down"
              onClick={() => move(n, n + 1)}
              className="cursor-pointer rounded-pill bg-canvas px-2.5 py-1 font-mono text-[9.5px] font-bold text-quiet transition-colors hover:text-ink"
            >
              Down
            </button>
          </span>
        </li>
      ))}
    </ol>
  );
}
