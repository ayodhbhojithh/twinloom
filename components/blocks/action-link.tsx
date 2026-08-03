import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The draft's `.act`: an action that is a link.
 *
 * Three weights, and the page decides which by what it is asking for rather than
 * by how much it wants to shout. Primary is the one thing to do, secondary is the
 * reasonable alternative, quiet is the way out.
 *
 * The draft fills primary with ink. This fills it with `active`, matching the call
 * to action in the header, so that a primary action is the same object wherever it
 * appears and colour means "this one" throughout the site.
 */
export function ActionLink({
  href,
  variant = "secondary",
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-block rounded-field px-[18px] py-[10px] text-[14.5px] font-semibold transition-colors",
        variant === "primary" &&
          "accent-fill text-white hover:opacity-90",
        variant === "secondary" &&
          "border border-ink bg-field text-ink hover:bg-ink hover:text-white",
        variant === "quiet" &&
          "border border-border bg-field font-medium text-quiet hover:text-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/**
 * A row of actions.
 *
 * The draft spaces them with a margin on each button, which leaves a stray margin
 * after the last one. A gap on the row is the same result without the remainder,
 * and it wraps cleanly on a narrow screen.
 */
export function Actions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2.5">{children}</div>;
}
