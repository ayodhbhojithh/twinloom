import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { FOOTER_COLUMNS, FOOTER_LEGAL, LEGAL, ROUTES, SITE } from "@/lib/site";

import { CutPanel, TopDisc } from "./cut-panel";
import { Wordmark } from "./wordmark";

/**
 * The site footer.
 *
 * One cut surface, the same shape the landing card and every working screen are
 * built from. The mark stands in the notch at the top, the year stands in the
 * bite at the bottom left, and the way back up is a disc in the corner cut - so
 * the last thing on the page is recognisably the same site as the first, rather
 * than a slab bolted underneath it.
 *
 * Minimal by subtraction. There are no rules, no boxes and no fills inside the
 * surface: what separates one band from the next is space, and the shape does
 * the work an ornament would otherwise be asked to do.
 *
 * It invents nothing. There is no phone number, address or inbox here because
 * the site does not have those written down anywhere, and a footer is the last
 * place to start guessing at facts.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="page-frame pt-6 pb-7">
      <CutPanel
        className="w-full"
        toolbar={
          /* Filling the notch, not floating in it. A plate narrower than the
             cut leaves the cut showing either side of it, which reads as two
             shapes that failed to line up rather than as one. */
          <span className="flex h-10 w-full items-center justify-center rounded-pill bg-field">
            <Wordmark />
          </span>
        }
        aside={
          /* The year, where the landing card keeps the next project. It is the
             one fact a footer is actually asked for, and the cut is what makes
             the bottom of this surface the same shape as the top of it. */
          <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-label tabular-nums">
            {year}
          </span>
        }
        corner={<TopDisc />}
        foot={
          /* Last, smallest, and still legible. It is the one thing here nobody
             reads by choice, and burying it any further would be a decision
             about somebody else's rights - so it runs along the bottom band
             between the year and the way up, rather than above an empty
             strip. */
          <div className="flex w-full flex-col gap-x-10 gap-y-4 lg:flex-row lg:items-end lg:justify-between">
            <p className="order-2 min-w-0 max-w-[74ch] text-[11.5px] leading-[1.55] text-label lg:order-1">
              {LEGAL.line}
              <span className="mt-1 block text-quiet">
                &copy; {year} {LEGAL.entity}. {LEGAL.rights}
                <span className="sr-only"> {SITE.name}.</span>
              </span>
            </p>

            <nav aria-label="Legal" className="order-1 flex-none lg:order-2">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
                {FOOTER_LEGAL.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[12.5px] font-medium text-quiet underline decoration-planned decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        }
      >
        {/* Two blocks, not four columns.

            Given a column each across the whole width, three short lists of
            links spread until the gaps between them were wider than the links
            themselves. They are one thing - everywhere else on the site - so
            they hold together as a block against the right edge, and the ask
            holds the left. */}
        <div className="grid gap-x-12 gap-y-11 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <p className="max-w-[24ch] text-[clamp(21px,2.1vw,30px)] leading-[1.12] font-extrabold tracking-[-0.035em] text-ink">
              {SITE.tagline}
            </p>

            <Link
              href={ROUTES.build}
              className="group/go mt-5 inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
            >
              Build your website
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform group-hover/go:translate-x-0.5 group-hover/go:-translate-y-0.5"
              />
            </Link>
          </div>

          <div className="ml-auto grid w-fit grid-cols-2 gap-x-10 gap-y-8 text-right sm:grid-cols-3 lg:gap-x-14 xl:gap-x-20">
            {FOOTER_COLUMNS.map((column) => (
              <nav
                key={column.title}
                aria-label={column.title}
                className="min-w-0"
              >
                <h3 className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
                  {column.title}
                </h3>

                <ul className="mt-3.5 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="text-[13.5px] leading-[1.3] font-medium text-quiet transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </CutPanel>
    </footer>
  );
}
