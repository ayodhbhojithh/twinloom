import { ArrowUpRight } from "lucide-react";

import { Panel, Section } from "@/components/shared";
import { FEATURED_WORK } from "@/lib/content/home";

/**
 * Home, block 5. Two or three cases, then out to the Work section.
 *
 * The cases come from the artifacts and are not confirmed engagements, so the
 * strip carries the same placeholder marking as the proof block. Nothing here
 * should read as a claim until real projects replace it.
 */
export function FeaturedWorkSection() {
  return (
    <Section
      id="work"
      heading={FEATURED_WORK.heading}
      lead={FEATURED_WORK.lead}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_WORK.items.map((item) => (
          <li key={item.client}>
            <Panel className="flex h-full flex-col p-5">
              <span className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
                {item.sector}
              </span>

              <h3 className="mt-2 text-[17px] font-bold">{item.client}</h3>

              <p className="mt-1.5 text-[14px] leading-[1.6] text-body">
                {item.body}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
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
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center font-mono text-[10px] tracking-[0.08em] text-faint uppercase">
        {FEATURED_WORK.placeholder}
      </p>
    </Section>
  );
}
