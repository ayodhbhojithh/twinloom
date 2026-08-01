"use client";

import Link from "next/link";

import { ROUTES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   What every version of the home page shares.

   Ten layouts, one set of words. The copy is the framework's own: `SITE.tagline`
   is the headline and `SITE.description` is the standfirst on all ten, so what
   is being compared is the design and nothing else.

   All ten are built to one screenful, and everything here is drawn with type,
   rules and one accent. There is no photography on this site, and inventing some
   would commit it to a look it cannot maintain.
--------------------------------------------------------------------------- */

export { ROUTES, SITE };

export const PROMISES = [
  "One question",
  "A written scope",
  "Two working days",
] as const;

/** The tagline is two sentences: what you do, then what we do. */
export function splitTagline() {
  const at = SITE.tagline.indexOf(". ");
  return {
    claim: at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline,
    promise: at > -1 ? SITE.tagline.slice(at + 2) : "",
  };
}

/**
 * One screenful.
 *
 * `--stage` is set once, in `globals.css`, and reduced by anything standing
 * between the header and the page. `min-h` rather than `h`, so a very short
 * window spills rather than clipping: losing the bottom of a page is worse than
 * scrolling a little.
 *
 * `overflow-clip` because every version puts something past its own edge, and
 * none of that is allowed to reach the window and produce a sideways scrollbar.
 */
export function Stage({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative isolate flex min-h-[var(--stage)] flex-col overflow-clip",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** The framework's own marker, for a screen that is a place rather than a page. */
export function EmptyPill({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-border bg-well py-1.5 pr-3.5 pl-2.5 font-mono text-[10px] font-bold tracking-[0.14em] text-quiet uppercase",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-pill bg-planned" />
      Nothing in here yet
    </span>
  );
}

export function Btn({
  href,
  variant = "secondary",
  size = "normal",
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "secondary" | "ink" | "quiet" | "white";
  size?: "normal" | "large";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-field font-semibold transition-colors",
        size === "large"
          ? "px-7 py-[14px] text-[16px]"
          : "px-5 py-[11px] text-[14.5px]",
        variant === "primary" && "bg-active text-white hover:opacity-90",
        variant === "ink" && "bg-ink text-white hover:opacity-85",
        variant === "secondary" &&
          "border border-ink bg-field text-ink hover:bg-ink hover:text-white",
        variant === "quiet" &&
          "border border-border bg-field text-quiet hover:border-ink hover:text-ink",
        variant === "white" &&
          "bg-field text-ink hover:bg-hair",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** The mono label every version uses, in one place. */
export function Kicker({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] font-bold tracking-[0.2em] uppercase",
        className ?? "text-label",
      )}
    >
      {children}
    </p>
  );
}

/** The promise row, as a run of mono with pale separators. */
export function Promises({
  className,
  separator = "/",
}: {
  className?: string;
  separator?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] font-bold tracking-[0.2em] text-label uppercase",
        className,
      )}
    >
      {PROMISES.map((promise, at) => (
        <span key={promise} className="flex items-center gap-3">
          {at > 0 ? (
            <span aria-hidden className="text-planned">
              {separator}
            </span>
          ) : null}
          {promise}
        </span>
      ))}
    </p>
  );
}

/**
 * A band of repeating words, drifting.
 *
 * The track holds the run twice and shifts by exactly half its width, so the
 * loop has no seam and no gap. Decorative and `aria-hidden`: the words in it are
 * already said in the copy, and a screen reader should not have to sit through
 * them eight times.
 */
export function Tape({
  words,
  className,
  reverse,
  slow,
  tone = "well",
}: {
  words: readonly string[];
  className?: string;
  reverse?: boolean;
  slow?: boolean;
  tone?: "well" | "ink" | "accent";
}) {
  const run = [...words, ...words, ...words, ...words];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none overflow-hidden border-y py-2.5",
        tone === "well" && "border-border bg-well",
        tone === "ink" && "border-ink bg-ink",
        tone === "accent" && "border-active bg-active",
        className,
      )}
    >
      <div
        className={cn(
          "drift flex w-max",
          slow && "drift-slow",
          reverse && "drift-back",
        )}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {run.map((word, at) => (
              <span
                key={`${copy}-${at}`}
                className={cn(
                  "flex items-center gap-6 px-6 font-mono text-[13px] font-bold tracking-[0.16em] whitespace-nowrap uppercase",
                  tone === "well" && "text-quiet",
                  tone === "ink" && "text-white",
                  tone === "accent" && "text-white",
                )}
              >
                {word}
                <span
                  className={cn(
                    tone === "well" ? "text-planned" : "text-white/45",
                  )}
                >
                  &middot;
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
