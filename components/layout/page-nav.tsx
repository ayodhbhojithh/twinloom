"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { siblingPages } from "@/lib/site";

/**
 * Previous and next, at the foot of a page.
 *
 * The order is the rail's, which is the order the site puts its own pages in, so
 * this is not a second opinion about what follows what. It reads that list rather
 * than keeping one.
 *
 * It matters more here than on most sites. Forty eight pages, many of them one
 * short screen, and a lot of them only make sense in sequence: route one, route
 * two, what we understood, your initial plan, sent. Somebody reading through
 * should not have to go back to the rail between each one.
 *
 * No boxes. A label above and the title below, one pushed to each edge, under a
 * rule. Two bordered cards at the foot of a page read as content, and these are
 * not content: they are the way out.
 *
 * The chevrons point outwards, away from the page, so the direction is legible
 * before either label is read.
 */
export function PageNav() {
  const pathname = usePathname();
  const { previous, next } = siblingPages(pathname);

  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Previous and next page"
      /* Two beside each other on a screen, two rows on a phone.

         Side by side, each is capped at 45 per cent - which on a wide page is
         plenty and on a handset is about a hundred and forty points. "Build your
         website" broke over two lines and "How we work" did not, so the pair sat
         at two different heights with the chevrons at two different places, one
         label ragged right and the other ragged left.

         Stacked, each takes the width, and what was doing the aligning - the two
         edges - is replaced by the one edge every other block on the page runs
         to. A row each also gives the labels somewhere to be: the word above and
         the page name below it, both against the same margin. */
      className="mt-16 flex items-start justify-between gap-8 border-t border-border pt-8 max-sm:mt-9 max-sm:flex-col max-sm:items-stretch max-sm:gap-0 max-sm:pt-5"
    >
      {previous ? (
        <Link
          href={previous.href}
          rel="prev"
          className="group max-w-[45%] max-sm:max-w-none max-sm:border-b max-sm:border-hair/60 max-sm:py-3"
        >
          <span className="block text-[13px] text-quiet max-sm:text-[11.5px]">
            Previous
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-[16px] font-semibold text-ink max-sm:mt-0.5 max-sm:text-[14.5px]">
            <ChevronLeft
              aria-hidden
              className="size-4 shrink-0 text-label transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:text-ink"
            />
            {previous.label}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}

      {next ? (
        <Link
          href={next.href}
          rel="next"
          /* Right aligned beside its neighbour, left aligned under it. The
             right edge is what marks it as the way forward when there is a
             second block to its left; in a column it would be the one thing on
             the page not starting where everything else does. */
          className="group max-w-[45%] text-right max-sm:max-w-none max-sm:py-3 max-sm:text-left"
        >
          <span className="block text-[13px] text-quiet max-sm:text-[11.5px]">
            Next
          </span>
          <span className="mt-1 flex items-center justify-end gap-1.5 text-[16px] font-semibold text-ink max-sm:mt-0.5 max-sm:justify-start max-sm:text-[14.5px]">
            {next.label}
            <ChevronRight
              aria-hidden
              className="size-4 shrink-0 text-label transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-ink max-sm:ml-auto"
            />
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  );
}
