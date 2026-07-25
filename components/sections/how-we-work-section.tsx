import { Check } from "lucide-react";

import { Panel, Reveal, Section } from "@/components/shared";
import { HOW_WE_WORK } from "@/lib/content/home";

/**
 * Home, block 4. Five steps and two reassurances.
 *
 * The one-file site heads this "five simple steps" but only lists four cards,
 * with Care buried in the reassurance line. TCT_Sitemap.md §1 specifies
 * Discover, Design, Build, Launch, Care, so Care is a step here and the count
 * matches the heading.
 */
export function HowWeWorkSection() {
  return (
    <Section
      id="how-we-work"
      heading={HOW_WE_WORK.heading}
      lead={HOW_WE_WORK.lead}
      revealBody={false}
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {HOW_WE_WORK.steps.map((step, index) => (
          <Reveal as="li" key={step.name} index={index}>
            <Panel className="h-full p-4 sm:p-5">
              <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-faint tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-2 text-[15px] font-bold">{step.name}</h3>

              <p className="mt-1 text-[13.5px] leading-[1.55] text-body">
                {step.body}
              </p>
            </Panel>
          </Reveal>
        ))}
      </ol>

      <ul className="mt-6 flex flex-col items-start gap-2.5 sm:flex-row sm:justify-center sm:gap-7">
        {HOW_WE_WORK.reassurances.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-[13.5px] leading-[1.5] text-body"
          >
            <Check
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-brand"
              strokeWidth={2.5}
            />
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}
