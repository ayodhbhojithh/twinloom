import Link from "next/link";

import { FOOTER_COLUMNS, FOOTER_LEGAL, LEGAL, SITE } from "@/lib/site";

/**
 * The site footer.
 *
 * A grid rather than a wrapping row. Five equal columns of links wrapped to four
 * and then one, leaving a single column stranded beside four columns of nothing.
 * A grid with a column count per breakpoint cannot produce that: one column on a
 * phone, two on a tablet, four on a laptop, and every row full.
 *
 * The legal links come out of the grid entirely and run as one line above the
 * company statement. There are seven of them, they are short, and they are the set
 * every site puts along its bottom edge, so that is where they go.
 *
 * The column headings are mono because they are labels rather than links, which is
 * the one rule the draft states about mono: machine labels only.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="page-frame mt-[70px] border-t border-border pt-10 pb-14">
      <div className="max-w-[1100px]">
        <nav
          aria-label="Footer"
          className="grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3 font-mono text-[11px] font-bold tracking-[0.14em] text-idx uppercase">
                {column.title}
              </h2>

              <ul className="flex flex-col gap-[7px]">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-[14.5px] leading-[1.45] text-quiet transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-12 border-t border-hair pt-6">
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
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

          <p className="mt-5 max-w-[900px] text-[13px] leading-[1.6] text-label">
            {LEGAL.line} &copy; {year} {LEGAL.entity}. {LEGAL.rights}
            <span className="sr-only"> {SITE.name}.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
