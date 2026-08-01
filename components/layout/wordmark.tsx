import Link from "next/link";

import { ROUTES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The mark: two threads, linked.
 *
 * Twin, and woven, in one shape. Each ring is a single arc carrying a gap where
 * the other passes over it, so the two genuinely interlock rather than merely
 * overlap: the left thread goes over at the top crossing and under at the
 * bottom. Take either gap away and it collapses into two circles touching, which
 * is a diagram of nothing.
 *
 * The geometry is worked out rather than eyeballed. Radius 6 on centres six
 * apart puts the crossings at y 6.8 and 17.2, and each gap is twelve degrees of
 * arc either side of its crossing, which is the smallest break that still reads
 * as a break at sixteen pixels.
 *
 * Drawn, not loaded. Two paths, inheriting `currentColor`, sharp at any size.
 */
function Threads({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      className={className}
    >
      {/* Left thread: broken at the lower crossing, where the right passes over. */}
      <path d="M10.85 17.71A6 6 0 1 1 13.01 16.46" />
      {/* Right thread: broken at the upper crossing, where the left passes over. */}
      <path d="M13.15 6.29A6 6 0 1 1 10.99 7.54" />
    </svg>
  );
}

/**
 * The name, as a lockup.
 *
 * The mark carries the personality so the word does not have to: set in one
 * weight, one colour and slightly tight, which is what a name looks like when it
 * is confident rather than styled. Two colours or two weights inside `TwinLoom`
 * would split a single word into two, and it is not two words.
 *
 * The mark stands on the page rather than in a tile. A filled shape would be the
 * only solid block on a site made entirely of hairlines, and it would read as a
 * button, which a logo is not. Drawn in ink at the same weight as everything
 * else, it belongs to the same drawing.
 */
export function Wordmark({
  className,
  as = "link",
}: {
  className?: string;
  /** A heading in the phone menu, where it is a title rather than a way home. */
  as?: "link" | "text";
}) {
  const inner = (
    <>
      <span
        className={cn(
          "shrink-0 text-ink transition-colors",
          as === "link" && "group-hover/mark:text-active",
        )}
      >
        <Threads className="size-[27px]" />
      </span>

      <span className="truncate text-[18px] leading-none font-extrabold tracking-[-0.03em] text-ink">
        {SITE.name}
      </span>
    </>
  );

  if (as === "text") {
    return (
      <span className={cn("flex min-w-0 items-center gap-2", className)}>
        {inner}
      </span>
    );
  }

  return (
    <Link
      href={ROUTES.home}
      aria-label={`${SITE.name}, home`}
      className={cn(
        "group/mark flex min-w-0 items-center gap-2 rounded-field",
        className,
      )}
    >
      {inner}
    </Link>
  );
}
