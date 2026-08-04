import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  HEADER_CTA,
  LEGAL,
  ROUTES,
  SITE,
} from "@/lib/site";

import { Threads, Wordmark } from "./wordmark";

/**
 * The site footer, as one panel.
 *
 * A wash of grey set inside the page's gutters rather than a band ruled off the
 * bottom of it. The page above is white, so a footer only has to stop being
 * white to read as the end of it: one tone quieter is enough, and it does the
 * job a heavy rule was doing without drawing a line at all.
 *
 * Four bands inside, in the order somebody leaving a page actually wants them:
 * the one thing we would like you to do, then where else you could go, then who
 * we are and the paperwork. They are separated by hairlines and by space, and
 * the type steps down a grade at each one, so the reading order is set by weight
 * rather than by boxes.
 *
 * It invents nothing. There is no phone number, address or inbox here because
 * the site does not have those written down anywhere, and a footer is the last
 * place to start guessing at facts.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  /* The tagline is two sentences: an instruction and a promise. Split at the
     stop so the promise can be set quieter than the ask, which is the order
     they are meant to be read in. */
  const at = SITE.tagline.indexOf(". ");
  const ask = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  return (
    <footer className="page-frame pt-10 pb-6">
      {/* No width cap. Nothing here is a line of text you read across: it is a
          mark, four short columns and a legal note, each held to its own
          measure. Capping the panel would only leave two bands of white down
          the sides of the one toned block on the page. */}
      <div className="relative isolate w-full overflow-hidden rounded-[22px] bg-well px-6 py-8 sm:px-8 sm:py-10 lg:px-11">
        {/* The mark, oversized and nearly out of sight, bleeding off the top
            right corner. At three percent it is texture rather than a logo: it
            gives the largest flat area on the site something to be, without
            competing with a single word set on top of it. */}
        <Threads className="pointer-events-none absolute -top-16 -right-14 -z-10 size-[240px] text-ink/[0.03] lg:-top-20 lg:-right-10 lg:size-[300px]" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2 className="max-w-[22ch] text-[clamp(21px,1.9vw,29px)] leading-[1.12] font-extrabold tracking-[-0.03em] text-ink text-balance">
            {ask}
            {promise ? <span className="text-quiet"> {promise}</span> : null}
          </h2>

          <div className="flex flex-none flex-wrap items-center gap-x-5 gap-y-2.5">
            <Link
              href={HEADER_CTA.href}
              className="group/cta inline-flex items-center gap-2 rounded-pill bg-ink py-2.5 pr-3.5 pl-4 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
            >
              {HEADER_CTA.label}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover/cta:translate-x-0.5"
                strokeWidth={2.2}
              />
            </Link>

            <Link
              href={ROUTES.book}
              className="text-[15px] font-semibold text-ink underline decoration-planned decoration-1 underline-offset-4 transition-colors hover:decoration-ink"
            >
              Book a meeting
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-x-10 gap-y-7 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,auto))] lg:gap-x-16">
          <div className="min-w-0">
            <Wordmark />

            <p className="mt-3 max-w-[32ch] text-[13px] leading-[1.55] text-quiet">
              {SITE.description}
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="mb-3 font-mono text-[10px] font-bold tracking-[0.16em] text-label uppercase">
                {column.title}
              </h3>

              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] leading-[1.4] text-quiet transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <p className="text-[12.5px] text-quiet">
              &copy; {year} {LEGAL.entity}. {LEGAL.rights}
              <span className="sr-only"> {SITE.name}.</span>
            </p>

            <nav aria-label="Legal">
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {FOOTER_LEGAL.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-quiet transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Last, smallest, and still legible. It is the one thing here nobody
              reads by choice, and burying it any further would be a decision
              about somebody else's rights. */}
          <p className="mt-4 max-w-[92ch] text-[11.5px] leading-[1.55] text-label">
            {LEGAL.line}
          </p>
        </div>
      </div>
    </footer>
  );
}
