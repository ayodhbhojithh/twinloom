import Link from "next/link";

import { FOOTER_COLUMNS, FOOTER_LEGAL, LEGAL, SITE } from "@/lib/site";

import { Wordmark } from "./wordmark";

/**
 * The site footer.
 *
 * The mark and what we do on the left, the sections beside it, and one rule
 * with the paperwork under it. No panel, no fill and no ornament: a footer on a
 * site built from white and hairlines should be the same site, quieter, rather
 * than a slab bolted to the bottom of it.
 *
 * Large, and made of almost nothing. This is the last thing on every page and
 * the one place a reader is deciding whether to go somewhere else, so the links
 * are given room to be read rather than scanned. What separates the bands is
 * space, and the only rule on the whole thing is the one above the paperwork.
 *
 * It invents nothing. There is no phone number, address or inbox here because
 * the site does not have those written down anywhere, and a footer is the last
 * place to start guessing at facts.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="page-frame border-t border-hair py-10 lg:py-11">
      {/* The sections take only the width they need and sit together on the
          right, with the mark holding the left. Even columns across the whole
          width read as four unrelated things rather than as one block of links
          beside a name. */}
      <div className="grid w-full grid-cols-2 gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,auto))] lg:gap-x-20">
        <div className="col-span-2 min-w-0 lg:col-span-1">
          <Wordmark />

          <p className="mt-3 max-w-[52ch] text-[14px] leading-[1.55] text-quiet">
            {SITE.description}
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="min-w-0">
            <h3 className="mb-3 text-[14px] font-semibold tracking-[-0.01em] text-ink">
              {column.title}
            </h3>

            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-[14px] leading-[1.3] font-medium text-quiet transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-9 flex flex-col justify-between gap-3 border-t border-hair pt-5 lg:flex-row lg:items-center">
        <p className="text-[13px] font-medium text-quiet">
          &copy; {year} {LEGAL.entity}. {LEGAL.rights}
          <span className="sr-only"> {SITE.name}.</span>
        </p>

        <nav aria-label="Legal">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_LEGAL.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13px] font-medium text-quiet underline decoration-planned decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Last, smallest, and still legible. It is the one thing here nobody
          reads by choice, and burying it any further would be a decision about
          somebody else's rights. */}
      <p className="mt-4 text-[12px] leading-[1.55] text-label">
        {LEGAL.line}
      </p>
    </footer>
  );
}
