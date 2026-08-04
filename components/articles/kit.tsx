import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   What an article is made of.

   Not a markdown renderer. A renderer can only do to every paragraph what it
   does to all of them, which is how four considered pieces turn into one long
   grey column with six tables in it.

   These are the shapes the writing actually takes: a run of prose, a set of
   named things, a comparison, a figure worth pulling out, and a question
   somebody asks. Each article is written with them, so the page can be set as
   what it says rather than as what it was typed in.
--------------------------------------------------------------------------- */

/** The opening paragraph, at the one size that is larger than the rest. */
export function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-[62ch] text-[clamp(16px,1.3vw,18.5px)] leading-[1.6] text-ink">
      {children}
    </p>
  );
}

/** A section, numbered in the margin so the run of them is countable. */
export function Sect({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={sectId(title)}
      className="mt-14 scroll-mt-[calc(var(--nav-height)+24px)] first:mt-10"
    >
      <h2 className="flex items-start gap-4">
        <span className="mt-[9px] font-mono text-[10px] font-bold text-mark tabular-nums">
          {String(n).padStart(2, "0")}
        </span>
        <span className="max-w-[24ch] text-[clamp(21px,1.9vw,28px)] leading-[1.12] font-extrabold tracking-[-0.032em] text-ink">
          {title}
        </span>
      </h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}

export const sectId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** A paragraph, at the article's one reading size. */
export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-[70ch] text-[15px] leading-[1.72] text-body first:mt-0">
      {children}
    </p>
  );
}

/** A short run of things, each one a fact rather than a sentence. */
export function Points({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-5 grid max-w-[74ch] gap-x-8 gap-y-2.5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <Check
            aria-hidden
            className="mt-[4px] size-3.5 flex-none text-mark"
            strokeWidth={3}
          />
          <span className="text-[14px] leading-[1.55] text-body">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Named things: the name in the margin, what it is beside it.
 *
 * This is the shape most of these articles are actually written in - a run of
 * platforms, technologies or kinds of sale, each with a sentence or two. Set as
 * prose it cannot be scanned; set as a table it gets columns it does not have.
 */
export function Terms({
  rows,
}: {
  rows: readonly { term: string; text: string; when?: string }[];
}) {
  return (
    <dl className="mt-6 flex max-w-[76ch] flex-col">
      {rows.map((row) => (
        <div
          key={row.term}
          className="grid gap-x-7 gap-y-1 py-4 first:pt-0 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]"
        >
          <dt className="text-[14px] leading-[1.35] font-extrabold tracking-[-0.02em] text-ink sm:mt-[3px] sm:text-right">
            {row.term}
          </dt>

          <dd className="min-w-0">
            <p className="text-[14.5px] leading-[1.65] text-body">{row.text}</p>

            {row.when ? (
              <p className="mt-1.5 flex gap-2 text-[13px] leading-[1.55] text-quiet">
                <span
                  aria-hidden
                  className="mt-[7px] size-1 flex-none rounded-pill bg-mark"
                />
                {row.when}
              </p>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Things set beside each other, where the comparison is the point. */
export function Cards({
  cards,
}: {
  cards: readonly { name: string; note: string; mark?: string }[];
}) {
  return (
    <div className="mt-6 grid max-w-[76ch] gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <div key={card.name} className="rounded-[18px] bg-canvas p-5">
          {card.mark ? (
            <span className="font-mono text-[9px] font-bold tracking-[0.14em] text-mark uppercase">
              {card.mark}
            </span>
          ) : null}

          <b
            className={cn(
              "block text-[15px] leading-[1.25] font-extrabold tracking-[-0.02em] text-ink",
              card.mark && "mt-2",
            )}
          >
            {card.name}
          </b>

          <p className="mt-1.5 text-[13.5px] leading-[1.6] text-quiet">
            {card.note}
          </p>
        </div>
      ))}
    </div>
  );
}

/** A figure worth reading on its own, and what it means. */
export function Figures({
  items,
}: {
  items: readonly { n: string; label: string; note: string }[];
}) {
  return (
    <div className="mt-6 grid max-w-[76ch] gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-[18px] bg-canvas p-5">
          <b className="block font-mono text-[26px] leading-none font-bold text-ink tabular-nums">
            {item.n}
          </b>
          <span className="mt-2.5 block font-mono text-[9px] font-bold tracking-[0.14em] text-label uppercase">
            {item.label}
          </span>
          <p className="mt-1.5 text-[13px] leading-[1.55] text-quiet">
            {item.note}
          </p>
        </div>
      ))}
    </div>
  );
}

/** The one sentence in a section that the rest of it is there to support. */
export function Pull({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-7 flex max-w-[62ch] gap-5 text-[clamp(17px,1.5vw,21px)] leading-[1.4] font-extrabold tracking-[-0.03em] text-ink">
      <span aria-hidden className="mt-[9px] h-[3px] w-8 flex-none bg-mark" />
      {children}
    </p>
  );
}

/** Questions people ask, set so an answer can be found without reading past it. */
export function Ask({
  rows,
}: {
  rows: readonly { q: string; a: string }[];
}) {
  return (
    <div className="mt-6 flex max-w-[76ch] flex-col gap-2.5">
      {rows.map((row) => (
        <div key={row.q} className="rounded-[18px] bg-canvas p-5 sm:p-6">
          <b className="block max-w-[52ch] text-[15px] leading-[1.35] font-extrabold tracking-[-0.02em] text-ink">
            {row.q}
          </b>
          <p className="mt-2 text-[14px] leading-[1.65] text-body">{row.a}</p>
        </div>
      ))}
    </div>
  );
}
