import Image from "next/image";
import Link from "next/link";

import { ROUTES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The mark.
 *
 * The real one now, from `public/assets/logo.png`, in place of the two
 * interlocking rings this drew for itself while there was none.
 *
 * Two things about the file decide how it is used. It has a genuinely
 * transparent background - the corners are `rgba(0,0,0,0)`, not white - so it
 * sits on any surface without a plate behind it. And the mark is a long way in
 * from the edges of its own canvas: 1336 by 1004 inside 1920 by 1916, which is
 * 70% of the width and 52% of the height. Rendered at the size the lockup wants,
 * that empty canvas would leave the mark at half the height of the name beside
 * it.
 *
 * So the box is the shape of the mark rather than of the file, and the file is
 * scaled inside it until the mark fills it. `object-contain` fits the square
 * image by the box's height; 1 / 0.696 then takes the mark out to the box's
 * width, and its own 1.33 aspect brings the height with it. The transparent
 * remainder overflows on all four sides and shows as nothing.
 *
 * If the file is ever replaced, this is the one number to recheck: it is the
 * reciprocal of how much of the canvas width the mark occupies.
 */
const CANVAS_TRIM = 1.437;

function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("relative block", className)}>
      <Image
        src="/assets/logo.png"
        alt=""
        aria-hidden
        fill
        /* Told the size it is actually drawn at, or the optimiser has no way to
           know it is not serving a 1920px original into a 40px box. */
        sizes="48px"
        priority
        className="object-contain"
        style={{ transform: `scale(${CANVAS_TRIM})` }}
      />
    </span>
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
      {/* Landscape, because the mark is. A square box round a 1.33 mark is a
          column of nothing either side of it, and the name would sit that much
          further from what it names. */}
      <span
        className={cn(
          "shrink-0 transition-opacity",
          as === "link" && "group-hover/mark:opacity-70",
        )}
      >
        <Mark className="h-[26px] w-[34.6px]" />
      </span>

      {/* One word, in two colours, and it is still one word.

          The old note here said two colours inside `TwinLoom` would split a
          single word into two. That was right while the mark was a pair of drawn
          rings in ink: the colour would have been decoration, and decoration is
          what splits a word. It is not right now. The mark runs blue into teal,
          and the half of the name that runs with it is the half the mark is
          named for - so the colour is the same fact stated twice rather than a
          second idea.

          One `span`, so the two halves are one line box: set as two blocks they
          could be broken between, and a name that wraps in the middle of itself
          is not a lockup. */}
      <span className="truncate text-[18px] leading-none font-extrabold tracking-[-0.03em] text-ink">
        {SITE.halves[0]}
        <span className="thread-text">{SITE.halves[1]}</span>
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
