import { AlertTriangle, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

import type { PageSection } from "@/components/layout";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The vocabulary of the legal pages.

   Eight documents share one set of parts, because eight documents that each
   invent their own heading sizes and their own way of showing a table read as
   eight documents from eight companies. A reader who has learned one of these
   has learned all of them.

   The shape is a reference document rather than a marketing page: a title, the
   date it was last changed, what it covers, then numbered sections that can be
   linked to and quoted at us. The section index in the right gutter is the
   site's own, from `PageShell`, so it behaves the same here as everywhere else.

   Two things this set does that a generated page would not.

   Every section is numbered in its own title, and the number is in the index
   too. Somebody raising a complaint writes "clause 18" and both of us have to
   be able to find the same paragraph.

   Nothing that is not yet decided is filled in. A gap is drawn as a gap, in the
   blocked red, with what is missing written out - because the failure mode of a
   legal page is not an empty row, it is a plausible sentence nobody checked.
--------------------------------------------------------------------------- */

/**
 * The day this set last changed.
 *
 * One constant for all eight. The handover asks for the day each page actually
 * publishes rather than the day it was drafted, and eight dates typed into
 * eight files is seven of them going stale the first time one page is edited.
 * Set this on the day the set goes live.
 */
export const POLICY_UPDATED = "7 August 2026";

/**
 * The head of a policy page.
 *
 * The title and the date on the left, what the document covers on the right.
 * Scope belongs at the top and beside the title rather than as the first
 * paragraph: it is the one thing that decides whether a reader is on the right
 * page at all, and a paragraph is where you put things people read second.
 */
export function PolicyHead({
  title,
  updated,
  scope,
  note,
  children,
}: {
  title: string;
  /** The day this page last changed, written out. */
  updated: string;
  /** What the document covers, and what it does not. */
  scope: string;
  /** One line under the rule, where the document has a standard to name. */
  note?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-12">
      <div className="grid max-w-measure items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:gap-8">
        <div className="min-w-0">
          <h1 className="max-w-[20ch] text-[clamp(30px,3.4vw,46px)] leading-[1.04] font-extrabold tracking-[-0.042em] text-ink">
            {title}
          </h1>

          <p className="mt-3 text-[14px] text-quiet">
            Last updated:{" "}
            <span className="font-medium text-body">{updated}</span>
          </p>
        </div>

        {/* Tinted rather than ruled. The page is otherwise ink on white, so a
            wash of the accent is enough to lift one box out of it without
            drawing a border round anything. */}
        <aside className="rounded-[16px] bg-mark/[0.07] p-5">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
            Scope
          </p>
          <p className="mt-2 text-[13.5px] leading-[1.6] text-body">{scope}</p>
        </aside>
      </div>

      {note ? (
        <p className="mt-8 max-w-measure border-t border-hair pt-6 text-[14px] leading-[1.6] text-quiet">
          {note}
        </p>
      ) : null}

      {children}
    </header>
  );
}

/**
 * One numbered section.
 *
 * It takes the index entry itself rather than a title and an id written out
 * twice. The index in the gutter and the heading on the page are then the same
 * string by construction, and a section renamed in one place cannot go on
 * saying the old name in the other.
 */
export function Clause({
  s,
  children,
}: {
  s: PageSection;
  children: React.ReactNode;
}) {
  return (
    <section
      id={s.id}
      aria-labelledby={`${s.id}-h`}
      className="mt-12 scroll-mt-[calc(var(--nav-height)+24px)] first:mt-0"
    >
      <h2
        id={`${s.id}-h`}
        className="group/h flex max-w-measure items-baseline gap-2 text-[19px] leading-[1.25] font-bold tracking-[-0.022em] text-ink sm:text-[21px]"
      >
        {s.title}

        {/* A clause somebody is going to quote is a clause somebody wants to
            link to. Revealed on hover so it is not eleven extra marks down the
            page for everybody else. */}
        <a
          href={`#${s.id}`}
          aria-label={`Link to ${s.title}`}
          className="text-idx opacity-0 transition-opacity group-hover/h:opacity-100 focus-visible:opacity-100"
        >
          <LinkIcon aria-hidden className="size-3.5" />
        </a>
      </h2>

      <div className="mt-4">{children}</div>
    </section>
  );
}

/** A heading inside a clause, for the parts that are separately findable. */
export function Sub({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-7 mb-3 text-[15.5px] leading-[1.3] font-bold tracking-[-0.014em] text-ink">
      {children}
    </h3>
  );
}

/** A paragraph, at the measure the rest of the site reads at. */
export function P({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mt-3.5 max-w-measure text-[15px] leading-[1.7] text-body first:mt-0",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * A list of things.
 *
 * Marked with a rule of the accent rather than a bullet glyph. A legal page is
 * mostly lists, and a page of round dots reads as a slide deck.
 */
export function Points({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-4 flex max-w-measure flex-col gap-2.5">{children}</ul>
  );
}

export function Point({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      {/* The mark is centred on the first line rather than nudged down from
          the top of it. A hand-set top margin is right at one type size and
          wrong at every other, and it was reading high: a box exactly one line
          tall, with the dot centred in it, stays right whatever the line box
          becomes. */}
      <span
        aria-hidden
        className="flex h-[1.65em] flex-none items-center text-[14.5px]"
      >
        <span className="size-1.5 rounded-pill bg-mark" />
      </span>
      <span className="min-w-0 text-[14.5px] leading-[1.65] text-body">
        {children}
      </span>
    </li>
  );
}

/**
 * Two columns of fact: a label and a value.
 *
 * A company number, a registered office and a VAT number are the things
 * somebody comes to a legal page to copy, so they are set apart from the prose
 * and given a surface of their own rather than run into a sentence.
 */
export function Facts({
  rows,
}: {
  rows: readonly { k: string; v: React.ReactNode }[];
}) {
  return (
    <dl className="mt-5 max-w-[720px] overflow-hidden rounded-[16px] bg-canvas">
      {rows.map((row, n) => (
        <div
          key={row.k}
          className={cn(
            "grid gap-x-6 gap-y-1 px-5 py-3.5 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]",
            n > 0 && "border-t border-hair",
          )}
        >
          <dt className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-label uppercase sm:pt-1">
            {row.k}
          </dt>
          <dd className="min-w-0 text-[14px] leading-[1.6] text-ink">
            {row.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * A real table, for the things that genuinely are one.
 *
 * The purposes and lawful bases, the retention periods, the cookie inventory
 * and the sub-processor list are grids of fact where a row means nothing
 * without its column heading. Everything else on these pages is prose.
 *
 * It scrolls inside its own box. A four column table at phone width either
 * scrolls somewhere or takes the whole page sideways with it.
 */
export function Grid({
  head,
  rows,
}: {
  head: readonly string[];
  rows: readonly (readonly React.ReactNode[])[];
}) {
  return (
    <div className="quiet-scroll mt-5 max-w-measure overflow-x-auto rounded-[16px] bg-canvas">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="px-5 py-3 font-mono text-[9px] font-bold tracking-[0.14em] text-label uppercase"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, n) => (
            <tr key={n} className="border-t border-hair align-top">
              {row.map((cell, at) => (
                <td
                  key={at}
                  className={cn(
                    "px-5 py-3.5 text-[13.5px] leading-[1.55]",
                    at === 0 ? "font-semibold text-ink" : "text-body",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** An address or a number, set to be copied rather than read. */
export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-[720px] rounded-[12px] bg-canvas px-4 py-3 font-mono text-[12.5px] leading-[1.6] text-ink">
      {children}
    </p>
  );
}

/** An address, written out. */
export function Mail({ address }: { address: string }) {
  return (
    <a
      href={`mailto:${address}`}
      className="font-medium text-ink underline decoration-hair underline-offset-2 transition-colors hover:text-mark hover:decoration-mark"
    >
      {address}
    </a>
  );
}

/** A link to another page of the set, or out. */
export function Ref({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const away = href.startsWith("http");

  if (away) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-ink underline decoration-hair underline-offset-2 transition-colors hover:text-mark hover:decoration-mark"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="font-medium text-ink underline decoration-hair underline-offset-2 transition-colors hover:text-mark hover:decoration-mark"
    >
      {children}
    </Link>
  );
}

/**
 * Something that is not decided yet, drawn as not decided yet.
 *
 * The one rule these pages have to obey. A legal document does not fail by
 * having an empty row in it; it fails by having a plausible sentence in it that
 * nobody checked, which is what happens the moment a placeholder is written as
 * though it were an answer.
 *
 * So a gap is red, it says what is missing, and it is impossible to read past.
 */
export function Gap({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 flex max-w-measure gap-3 rounded-[12px] bg-blocked/[0.08] px-4 py-3">
      <AlertTriangle
        aria-hidden
        className="mt-[3px] size-4 flex-none text-blocked"
        strokeWidth={2.2}
      />
      <span className="min-w-0 text-[13.5px] leading-[1.6] text-blocked">
        <b className="font-bold">Still to confirm. </b>
        {children}
      </span>
    </p>
  );
}

/**
 * A whole page that is not ready.
 *
 * Three of these eight cannot be published until something is done that is not
 * writing: a scan, an audit, a list of suppliers. Saying so at the top is the
 * only honest version of the page - the alternative is a cookie table of
 * examples, which reads as a declaration of what the site does and is not one.
 */
export function NotYet({
  what,
  children,
}: {
  what: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 rounded-[18px] bg-blocked/[0.08] p-5 sm:p-6">
      <p className="flex items-center gap-2.5 font-mono text-[9px] font-bold tracking-[0.16em] text-blocked uppercase">
        <AlertTriangle aria-hidden className="size-4" strokeWidth={2.2} />
        Not ready to publish
      </p>

      <b className="mt-3 block max-w-[42ch] text-[16px] leading-[1.3] font-extrabold tracking-[-0.02em] text-ink">
        {what}
      </b>

      <div className="mt-2.5 max-w-measure text-[14px] leading-[1.65] text-body">
        {children}
      </div>
    </div>
  );
}

/**
 * The entity line, on every page of the set.
 *
 * Company law wants it findable, and eight pages that each say it slightly
 * differently is eight chances to say it wrong. One component, one wording.
 */
export function PolicyFoot() {
  return (
    <footer className="mt-16 max-w-measure border-t border-hair pt-7">
      <p className="max-w-measure text-[12.5px] leading-[1.7] text-label">
        TwinLoom is a trading name of TwinCoreTech Ltd, registered in England
        and Wales, company number 15997244. Registered office: Bromley Old Town
        Hall, 30 Tweedy Road, Bromley BR1 3FE. VAT registration number 489 0108
        74.
      </p>
    </footer>
  );
}
