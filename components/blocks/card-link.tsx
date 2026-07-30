import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * A card that is a link: a title, a line about it, and the whole thing clickable.
 *
 * For the end of a page, where the question is "what now" and the answer is one or
 * two specific places. A `QuietLink` in a sentence is right when the link is part
 * of an argument; this is right when it is the next step.
 *
 * The border firms to ink on hover rather than the card lifting or tinting. This
 * design has no shadows and one accent, so a hairline getting darker is the whole
 * available vocabulary for "you are pointing at this", and it is enough.
 */
export function CardLink({
  href,
  title,
  children,
  className,
}: {
  href: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block max-w-[400px] rounded-card border border-border px-5 py-4 transition-colors hover:border-ink",
        className,
      )}
    >
      <span className="block text-[17px] font-bold text-ink">{title}</span>

      {children ? (
        <span className="mt-1.5 block text-[15px] leading-[1.6] text-quiet">
          {children}
        </span>
      ) : null}
    </Link>
  );
}

/** A row of them, wrapping. Two is the usual number; three is the most. */
export function CardLinks({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap gap-3">{children}</div>
  );
}
