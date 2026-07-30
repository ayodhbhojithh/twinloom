import Link from "next/link";

import { FOOTER_COLUMNS, LEGAL, SITE } from "@/lib/site";

/**
 * The site footer.
 *
 * Five columns of links under a rule, and the legal line under a second, fainter
 * one. The draft's own arrangement, including the placeholders in square brackets:
 * a made up company number would be worse than a visible gap, and a visible gap is
 * the thing that gets filled before launch.
 *
 * The column headings are mono because they are labels rather than links, which is
 * the one rule the draft states about mono: machine labels only.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-[70px] border-t border-border px-5 pt-[30px] pb-14 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
      <div className="flex max-w-[1100px] flex-wrap gap-x-10 gap-y-8 xl:gap-x-[52px] xl:gap-y-9">
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className="min-w-[150px]">
            <h2 className="mb-2.5 font-mono text-[11px] font-bold tracking-[0.14em] text-idx uppercase">
              {column.title}
            </h2>

            <ul>
              {column.links.map((link) => (
                <li key={`${column.title}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="block py-[3px] text-[14.5px] text-quiet hover:text-ink hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="mt-3.5 max-w-[900px] flex-[100%] border-t border-hair pt-4 text-[13.5px] leading-[1.62] text-quiet">
          {LEGAL.line} &copy; {year} {LEGAL.entity}. {LEGAL.rights}
          <span className="sr-only"> {SITE.name}.</span>
        </p>
      </div>
    </footer>
  );
}
