import Link from "next/link";

import { cn } from "@/lib/utils";

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
 */
export function TextLink({
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
        "font-semibold text-active underline-offset-[3px] transition-colors hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
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
