import Link from "next/link";

import { cn } from "@/lib/utils";

export type ListTone = "planned" | "active" | "done" | "amber" | "blocked";

const DOT: Record<ListTone, string> = {
  planned: "bg-planned",
  active: "bg-mark",
  done: "bg-mark",
  amber: "bg-amber",
  blocked: "bg-blocked",
};

export interface ListRow {
  label: string;
  /** The mono note on the right. A status, a count, a section name. */
  note?: string;
  href?: string;
  tone?: ListTone;
}

/**
 * The simple list from the style guide, section 06.
 *
 * A rule above, hairlines between, a dot, a name, and a mono note pushed right.
 * It is the draft's one list pattern and it does a lot of work across the site:
 * anywhere a set of things needs a state beside it, this is the shape.
 *
 * The dot carries the state and the note names it, so the meaning never rests on
 * colour alone. That is the rule the draft states for its partner markers and it
 * holds here for the same reason.
 */
export function SimpleList({
  title,
  count,
  rows,
  className,
}: {
  title?: string;
  count?: string;
  rows: readonly ListRow[];
  className?: string;
}) {
  return (
    <div className={cn("max-w-measure", className)}>
      {title || count ? (
        <div className="flex items-baseline justify-between gap-4 pb-2.5">
          {title ? (
            <h3 className="font-mono text-[11px] font-bold tracking-[0.18em] text-idx uppercase">
              {title}
            </h3>
          ) : null}
          {count ? (
            <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-quiet uppercase">
              {count}
            </span>
          ) : null}
        </div>
      ) : null}

      <ul className="border-t border-border">
        {rows.map((row) => {
          const inner = (
            <>
              <span
                aria-hidden
                className={cn(
                  "relative top-px size-[9px] shrink-0 rounded-pill",
                  DOT[row.tone ?? "planned"],
                )}
              />

              <span className="min-w-0 flex-1 truncate text-[16px] text-ink">
                {row.label}
              </span>

              {row.note ? (
                <span className="shrink-0 text-right font-mono text-[11px] font-semibold tracking-[0.1em] text-quiet uppercase">
                  {row.note}
                </span>
              ) : null}
            </>
          );

          return (
            <li key={row.label} className="border-b border-hair">
              {row.href ? (
                <Link
                  href={row.href}
                  className="flex items-baseline gap-3.5 py-3 transition-colors hover:[&_span:nth-child(2)]:underline"
                >
                  {inner}
                </Link>
              ) : (
                <div className="flex items-baseline gap-3.5 py-3">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
