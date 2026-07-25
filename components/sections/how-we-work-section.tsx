import { Check } from "lucide-react";

import { Reveal, Section } from "@/components/shared";
import { HOW_WE_WORK, type WorkStep } from "@/lib/content/home";

/**
 * The numbered tile, one tint per step. Written out in full rather than composed,
 * because Tailwind only ships classes it can see as complete strings.
 */
const TILE: Record<WorkStep["tone"], string> = {
  pink: "bg-[#fce7f3] text-[#db2777]",
  violet: "bg-[#ede9fe] text-[#7c3aed]",
  blue: "bg-[#dbeafe] text-[#2563eb]",
  emerald: "bg-[#d1fae5] text-[#059669]",
  amber: "bg-[#fef3c7] text-[#d97706]",
};

/**
 * Home, block 4. The process, as one ledger rather than five cards.
 *
 * Five separate cards made five separate claims. One card divided by hairlines
 * makes a single claim with five parts, which is what a process actually is, and
 * it reads top to bottom in the order the work happens. Taken from 2a's
 * "From hello to launch".
 *
 * TCT_Sitemap.md §1 specifies Discover, Design, Build, Launch, Care, so Care is a
 * step here rather than a footnote, and the count in the microcopy matches.
 */
export function HowWeWorkSection() {
  return (
    <Section
      id="how-we-work"
      heading={HOW_WE_WORK.heading}
      accent={HOW_WE_WORK.accent}
      accentTone="amber"
      micro={HOW_WE_WORK.micro}
      revealBody={false}
    >
      <ol className="overflow-hidden rounded-card border border-line bg-card">
        {HOW_WE_WORK.steps.map((step, index) => (
          <Reveal
            as="li"
            key={step.name}
            index={index}
            y={10}
            className="flex items-center gap-3.5 px-4 py-3.5 not-first:border-t not-first:border-line/70 sm:gap-4 sm:px-5 sm:py-4"
          >
            <span
              aria-hidden
              className={`flex size-[30px] shrink-0 items-center justify-center rounded-[9px] font-mono text-[12px] font-semibold ${TILE[step.tone]}`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Title and description share a line from sm up, so the row stays a
                single beat rather than a stacked block. */}
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2.5">
              <span className="text-[14.5px] font-bold sm:text-[15px]">
                {step.name}
              </span>
              <span className="text-[13px] leading-[1.45] text-faint sm:text-[13.5px]">
                {step.body}
              </span>
            </span>

            <span
              aria-hidden
              className="hidden shrink-0 font-mono text-[10.5px] tracking-[0.12em] text-faint/80 sm:block"
            >
              {step.tag}
            </span>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.12}>
        <ul className="mt-5 flex flex-col items-start gap-2.5 sm:flex-row sm:gap-7">
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
      </Reveal>
    </Section>
  );
}
