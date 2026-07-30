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
      className="mt-16 flex items-start justify-between gap-8 border-t border-border pt-8"
    >
      {previous ? (
        <Link href={previous.href} rel="prev" className="group max-w-[45%]">
          <span className="block text-[13px] text-quiet">Previous</span>
          <span className="mt-1 flex items-center gap-1.5 text-[16px] font-semibold text-ink">
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
          className="group max-w-[45%] text-right"
        >
          <span className="block text-[13px] text-quiet">Next</span>
          <span className="mt-1 flex items-center justify-end gap-1.5 text-[16px] font-semibold text-ink">
            {next.label}
            <ChevronRight
              aria-hidden
              className="size-4 shrink-0 text-label transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-ink"
            />
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  );
}
