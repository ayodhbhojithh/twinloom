import Link from "next/link";

import { EVERY_SITE } from "@/lib/build/data";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The page's rhythm below the fold: what the section is, on the left, and the
 * section itself filling the rest.
 *
 * One arrangement used three times. A page whose every block starts on the same
 * two lines reads as set rather than as assembled, and it uses the width without
 * stretching prose across it.
 */
function Row({
  label,
  labelClass,
  title,
  children,
}: {
  label: string;
  labelClass?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-x-16 gap-y-8 border-t border-border pt-12 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
      <div className="min-w-0">
        <p
          className={cn(
            "font-mono text-[10.5px] font-bold tracking-[0.2em] uppercase",
            labelClass ?? "text-label",
          )}
        >
          {label}
        </p>
        <h2 className="mt-4 text-[27px] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance text-ink sm:text-[35px]">
          {title}
        </h2>
      </div>

      <div className="min-w-0">{children}</div>
    </section>
  );
}

const CLAUSES = [
  {
    n: "01",
    title: "You answer one question.",
    body: "Tick who comes to your website. There is no brief to write, no budget to name and nothing to install. One answer is enough to send.",
  },
  {
    n: "02",
    title: "The scope writes itself.",
    body: "Every answer adds a page, and every page says which of your answers put it there. Take an answer back and its pages go with it, so what we describe can only hold what you asked for.",
  },
  {
    n: "03",
    title: "We send it back in two working days.",
    body: "A written scope in your own words. It costs nothing, and nothing is fixed until you have read it and agreed it.",
  },
] as const;

/**
 * The three clauses, set as a specification rather than as feature cards.
 *
 * This company sells a written document, so the page is set the way the
 * deliverable is: numbered, ruled, the clause on one side and what it means on
 * the other. Nothing in a box and no icons, because an icon beside "you answer
 * one question" would be decoration standing in for the sentence.
 */
export function Clauses() {
  return (
    <Row label="How it works" title="Three steps, and you only do the first.">
      <dl>
        {CLAUSES.map((clause) => (
          <div
            key={clause.n}
            className="grid gap-x-10 gap-y-2 border-b border-hair py-6 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[2.5rem_minmax(0,15rem)_minmax(0,1fr)]"
          >
            <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-idx tabular-nums">
              {clause.n}
            </span>

            <dt className="text-[19px] leading-[1.25] font-bold tracking-[-0.018em] text-balance text-ink">
              {clause.title}
            </dt>

            <dd className="max-w-[54ch] text-[16px] leading-[1.6] text-quiet">
              {clause.body}
            </dd>
          </div>
        ))}
      </dl>
    </Row>
  );
}

/**
 * The floor, set as one run of text rather than as a ticklist.
 *
 * Six ticks in a grid is the shape of a pricing table, and this is not one: none
 * of these is optional, none is an upgrade, and a control beside each would
 * imply a choice that does not exist. Run together with separators they read as
 * what they are, which is one sentence about what a website is for.
 */
export function Included() {
  return (
    <Row
      label="The floor"
      labelClass="text-done"
      title="Six things are in every site we build."
    >
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[19px] leading-[1.45] font-medium text-ink sm:text-[22px]">
        {EVERY_SITE.map((thing, at) => (
          <span key={thing} className="flex items-center gap-3">
            {at > 0 ? (
              <span aria-hidden className="text-planned">
                &middot;
              </span>
            ) : null}
            {thing}
          </span>
        ))}
      </p>

      <p className="mt-7 max-w-[62ch] text-[15.5px] leading-[1.6] text-quiet">
        Nothing to tick and nothing to add on. Whatever you answer, and even if
        you answer nothing at all, your website can do all six on the day it goes
        live.
      </p>
    </Row>
  );
}

/**
 * The last word: the same ask the page opened with, now that they have seen
 * what answering it does. Somebody who has read the whole page should not have
 * to scroll back up to act on it.
 */
export function Closing() {
  return (
    <section className="grid items-end gap-x-16 gap-y-8 border-t border-ink pt-12 lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <h2 className="max-w-[24ch] text-[32px] leading-[1.04] font-extrabold tracking-[-0.038em] text-ink sm:text-[56px]">
          Start with one answer.
        </h2>

        <p className="mt-5 max-w-[48ch] text-[17px] leading-[1.6] text-body sm:text-[18.5px]">
          Say who your website is for, and we will write the rest down for you.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={ROUTES.build}
          className="inline-flex items-center rounded-field bg-active px-7 py-[13px] text-[15.5px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Build your website
        </Link>
        <Link
          href={ROUTES.book}
          className="inline-flex items-center rounded-field border border-ink bg-field px-7 py-[13px] text-[15.5px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Book a meeting
        </Link>
      </div>
    </section>
  );
}
