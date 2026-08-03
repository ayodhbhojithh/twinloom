import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

/** Anything that does not resolve to a route on this site. */
function isOffsite(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

/**
 * A link inside a sentence.
 *
 * Blue, and the only blue in running text, which is what makes it findable without
 * an underline sitting under every phrase. The underline arrives on hover to
 * confirm the target rather than to announce it.
 *
 * It is the most used control on the site by a distance, because most of these
 * choices are worded as sentences rather than labelled as buttons. A row of buttons
 * asks people to scan; a paragraph with one coloured phrase in it asks them to
 * read, which is what the copy is written for.
 *
 * Colour alone is never the only signal: every one of these sits in a list marked
 * with a rule, or leads a line that a bold weight has already separated from its
 * description.
 *
 * The arrow marks a link that is a destination rather than a mention. Every
 * offsite link gets one, worked out from the address so nobody has to remember a
 * flag; an onsite link takes one with `arrow`, which is right when the link is the
 * whole line and wrong when it is a term at the head of a sentence, where an arrow
 * would sit between the term and its colon.
 *
 * The arrow sits inside the link so it underlines with the text and cannot be
 * orphaned at the end of a wrapped line, and it is sized in `em` so it tracks
 * whatever type it lands in.
 */
export function TextLink({
  href,
  arrow,
  className,
  children,
}: {
  href: string;
  /** Marks an onsite link as a destination. Offsite links are marked anyway. */
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    /* Underlined rather than coloured. A link in running text has to be
       findable without reading it, and with no colour on the page the rule
       under it is what does that. It sits light and goes to ink on hover, so
       the mark is there before the pointer and confirms itself under it. */
    "font-semibold text-ink underline decoration-planned decoration-1 underline-offset-[3px] transition-colors hover:decoration-ink",
    className,
  );

  if (isOffsite(href)) {
    /* `http` opens a new tab. `mailto` and `tel` hand over to another application,
       and asking for a tab as well leaves an empty one behind. */
    const newTab = href.startsWith("http");

    return (
      <a
        href={href}
        {...(newTab
          ? { target: "_blank", rel: "noreferrer noopener" }
          : undefined)}
        className={classes}
      >
        {children}
        <Arrow />
        {newTab ? (
          <span className="sr-only"> (opens in a new tab)</span>
        ) : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

/** One glyph, one size rule, wherever it appears. */
function Arrow() {
  return (
    <ArrowUpRight
      aria-hidden
      className="ml-0.5 inline-block size-[0.82em] align-[-0.06em]"
      strokeWidth={2.5}
    />
  );
}

/**
 * The small print under an action. The draft's `.gnote`: the reassurance that
 * belongs to the button above it rather than to the page.
 */
export function GuideNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-[22px] max-w-measure text-[12.5px] leading-[1.6] text-quiet">
      {children}
    </p>
  );
}
