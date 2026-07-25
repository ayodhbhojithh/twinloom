import { Container, MonoLabel } from "@/components/shared";
import { FOOTER_NAV, SITE } from "@/lib/content/site";

import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-hairline bg-surface py-12">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-[320px]">
            <BrandMark />
            <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-3">
              {SITE.description}
            </p>
            <p className="mt-4 font-mono text-[11px] tracking-[0.04em] text-ink-4">
              {SITE.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-14">
            {FOOTER_NAV.map((group) => (
              <div key={group.title}>
                <MonoLabel>{group.title}</MonoLabel>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="text-[13.5px] text-ink-3 transition-colors hover:text-ink"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <MonoLabel>Get in touch</MonoLabel>
              <ul className="mt-3 flex flex-col gap-2">
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-[13.5px] text-ink-3 transition-colors hover:text-ink"
                  >
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                    className="text-[13.5px] text-ink-3 transition-colors hover:text-ink"
                  >
                    {SITE.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] tracking-[0.04em] text-ink-5">
            All prices exclude VAT. Estimates are indicative, never a quote.
          </p>
          <p className="font-mono text-[10px] tracking-[0.04em] text-ink-5">
            {SITE.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
