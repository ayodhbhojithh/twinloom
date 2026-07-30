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
    <p className={cn("mb-4 max-w-[720px] text-[16.5px]", className)}>
      {children}
    </p>
  );
}

/**
 * A list, marked with a rule rather than a bullet.
 *
 * A drawn 10px line instead of a bullet or a dash character. Two reasons it is
 * drawn: a glyph sits on the text baseline and drifts as the type size changes,
 * where a positioned rule stays put; and a bullet reads as a specification while a
 * rule reads as an aside, which is what these lists are.
 *
 * The marker is a hairline in the index grey, so it belongs to the same family as
 * every other rule on the site rather than being a new mark.
 */
export function List({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ul className={cn("mb-5 flex max-w-[720px] flex-col gap-3", className)}>
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
      <span
        aria-hidden
        className="absolute top-[0.68em] left-0 h-px w-2.5 bg-idx"
      />
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
