import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The draft's `.act.lk`: an action that reads as a sentence.
 *
 * Bold ink with a hairline underline, which firms up to ink on hover. It is the
 * draft's most used control by a distance, and the reason is that most of this
 * site's choices are worded as sentences rather than labelled as buttons. A row of
 * buttons would ask people to scan; a paragraph with one bold phrase in it asks
 * them to read, which is what the copy is written for.
 *
 * The underline is the affordance and it is always present. A bold word alone does
 * not read as clickable, and a link that only underlines on hover cannot be found
 * without a mouse.
 */
export function QuietLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-semibold text-ink underline decoration-border decoration-1 underline-offset-[3px] transition-colors hover:decoration-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/**
 * The draft's `.pks`: a run of short lines, each its own paragraph.
 *
 * Not a list. The draft deliberately does not bullet these, because they are
 * sentences that happen to be adjacent rather than items in a set, and a bullet in
 * front of "an online shop" makes it a specification. The spacing does the
 * grouping instead.
 */
export function Picks({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mb-[22px] max-w-[840px]", className)}>{children}</div>
  );
}

/** One line of a `Picks` run. `more` is the quieter one that ends it. */
export function Pick({
  more,
  className,
  children,
}: {
  more?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "mb-2 text-[15.5px] leading-[1.65] sm:text-[16px]",
        more ? "mt-4 text-quiet" : "text-body",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** The grey half of a pick: what the link means, after the link. */
export function Aside({ children }: { children: React.ReactNode }) {
  return <span className="text-quiet">{children}</span>;
}

/**
 * The small print under an action. The draft's `.gnote`: the reassurance that
 * belongs to the button above it rather than to the page.
 */
export function GuideNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-[22px] max-w-[820px] text-[12.5px] leading-[1.6] text-quiet">
      {children}
    </p>
  );
}
