import { cn } from "@/lib/utils";

/**
 * A paragraph, at the site's measure.
 *
 * 720px is the draft's cap on prose, and it is the reason the page can be 1360px
 * wide without becoming unreadable: the extra width is for tables and boxes, not
 * for lines of text.
 */
export function P({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("mb-4 max-w-measure text-[16.5px]", className)}>
      {children}
    </p>
  );
}

/**
 * A list, marked with a hyphen rather than a bullet.
 *
 * A real hyphen, not a drawn rule. A 10px rule at this weight reads as an em dash,
 * which is a punctuation mark this site does not use, and the marker should not be
 * making a claim the copy avoids.
 *
 * It is set in the index grey and hung outside the text, so the marker is quieter
 * than what it marks and wrapped lines align with the first word rather than with
 * the hyphen. A bullet would read as a specification; a hyphen reads as an aside,
 * which is what these lists are.
 */
export function List({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ul className={cn("mb-5 flex max-w-measure flex-col gap-3.5", className)}>
      {children}
    </ul>
  );
}

/** One item of a `List`. Lead with a `<b>` for the term it is defining. */
export function Item({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "relative pl-6 text-[16.5px] leading-[1.62] [&>b]:text-ink [&>strong]:text-ink",
        className,
      )}
    >
      {/* Shares the item's line height, so the hyphen sits on the same baseline
          as the first line of text at any type size. */}
      <span
        aria-hidden
        className="absolute top-0 left-0 leading-[1.62] text-idx select-none"
      >
        -
      </span>
      {children}
    </li>
  );
}

/**
 * Inline code.
 *
 * A chip rather than bare mono: at 16.5px body, a mono run of the same size reads
 * as slightly smaller and sits on a different baseline, so it needs a little air
 * and a boundary to stop it looking like a typographic mistake.
 */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[5px] border border-border bg-well px-1.5 py-px font-mono text-[0.86em] text-ink">
      {children}
    </code>
  );
}

/**
 * A key on a keyboard, for shortcut hints. Same chip, a little firmer, because it
 * stands for a thing you press rather than a thing you type.
 */
export function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-[5px] border border-border bg-well px-1.5 py-px font-mono text-[0.8em] font-semibold text-body">
      {children}
    </kbd>
  );
}
