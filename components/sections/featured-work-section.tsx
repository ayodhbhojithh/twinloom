import { ArrowUpRight } from "lucide-react";

import { Panel, Reveal, Section } from "@/components/shared";
import { FEATURED_WORK } from "@/lib/content/home";

/**
 * Home, block 5. Two or three cases, then out to the Work page.
 *
 * Reference: the featured work grid in twincoretech_site.html.
 */
export function FeaturedWorkSection() {
  return (
    <Section
      id="work"
      heading={FEATURED_WORK.heading}
      lead={FEATURED_WORK.lead}
      revealBody={false}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_WORK.items.map((item, at) => (
          <Reveal as="li" key={item.client} index={at}>
            <Panel className="flex h-full flex-col p-5 transition-colors hover:border-brand/35">
              <span className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
                {item.sector}
              </span>

              <h3 className="mt-2 text-[17px] font-bold">{item.client}</h3>

              <p className="mt-2 text-[14px] leading-[1.6] text-body">
                {item.body}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                <span className="rounded-pill bg-soft px-2.5 py-1 text-[11.5px] font-semibold text-brand">
                  {item.result}
                </span>
                <span
                  aria-hidden
                  className="flex items-center gap-1 text-[12.5px] font-semibold text-faint"
                >
                  Case study
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </Panel>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
