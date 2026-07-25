import { Container } from "@/components/shared";
import { FOOTER_NAV, SITE } from "@/lib/content/site";

import { BrandMark } from "./brand-mark";

/**
 * The global footer: three columns, contact, and the ownership line that the
 * artifacts repeat everywhere. The one hairline on the page sits here, marking
 * the end of the content rather than dividing it.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <Container width="wide" className="py-12">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-[320px]">
            <BrandMark size="large" />
            <p className="mt-3 text-[13.5px] leading-[1.6] text-body">
              {SITE.description}
            </p>
            <p className="mt-4 text-[13px] font-semibold text-ink">
              {SITE.ownership}
            </p>
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="font-mono text-[11px] font-extrabold tracking-[0.08em] text-faint uppercase">
                {group.title}
              </h2>
              <ul className="mt-3 flex flex-col gap-1.5">
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.label}`}>
                    <a
                      href={item.href}
                      className="text-[13.5px] font-medium text-body transition-colors hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={`mailto:${SITE.email}`}
            className="text-[13.5px] font-semibold text-body transition-colors hover:text-ink"
          >
            {SITE.email}
          </a>
          <p className="font-mono text-[11px] tracking-[0.06em] text-faint uppercase">
            {SITE.name} · {SITE.location}
          </p>
        </div>
      </Container>
    </footer>
  );
}
