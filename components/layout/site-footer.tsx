import { Container } from "@/components/shared";
import { FOOTER_NAV, NEWSLETTER, SITE } from "@/lib/content/site";

import { BrandMark } from "./brand-mark";
import { NewsletterForm } from "./newsletter-form";

/**
 * The global footer.
 *
 * A dark block inset from the page rather than a ruled band. The page is white
 * throughout with no dividers, so a rule here would read as one more section
 * boundary; a block reads as the end of the page. The gradient hairline across
 * its top is the accent set's second and last appearance, after the wordmark.
 *
 * Link columns and the signup share the top row; the wordmark, the copyright and
 * the ownership line sit on a bar under one hairline.
 */
export function SiteFooter() {
  /* Static rendering bakes this in at build, which is what we want: a rebuild
     refreshes it and nothing ships a hardcoded year. */
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto pb-5 sm:pb-6">
      <Container>
        <div className="relative overflow-hidden rounded-[26px] bg-ink px-6 py-10 text-white sm:px-10 sm:py-12">
          <span
            aria-hidden
            className="bg-brand-gradient absolute inset-x-0 top-0 h-px opacity-70"
          />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.5fr)]">
            {FOOTER_NAV.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="font-mono text-[11px] font-extrabold tracking-[0.08em] text-white/40 uppercase">
                  {group.title}
                </h2>

                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={`${group.title}-${item.label}`}>
                      <a
                        href={item.href}
                        className="text-[13.5px] font-medium text-white/65 transition-colors hover:text-white"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="font-mono text-[11px] font-extrabold tracking-[0.08em] text-white/40 uppercase">
                {NEWSLETTER.heading}
              </h2>

              <p className="mt-4 max-w-[340px] text-[13px] leading-[1.55] text-white/55">
                {NEWSLETTER.body}
              </p>

              <div className="mt-4 max-w-[380px]">
                <NewsletterForm />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <BrandMark size="large" tone="onDark" />

            <p className="text-[12.5px] text-white/45">
              Copyright {year} {SITE.name}. All rights reserved.
            </p>

            <p className="text-[12.5px] font-semibold text-white/80">
              {SITE.ownership}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
