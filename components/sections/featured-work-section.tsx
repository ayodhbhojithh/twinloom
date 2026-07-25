import { Reveal, Section } from "@/components/shared";
import { FEATURED_WORK, type WorkItem } from "@/lib/content/home";

import { PreviewChrome, WorkPreview } from "./work-preview";

/** The result reads in the same colour as the preview it sits under. */
const METRIC: Record<WorkItem["tone"], string> = {
  emerald: "text-accent-emerald",
  blue: "text-accent-blue",
  violet: "text-accent-violet",
};

/**
 * Home, block 5. Three cases, each as a small browser window.
 *
 * The chrome does a lot of work for three dots and a hairline: it frames the
 * block below it as a website rather than a decorative panel, which is the whole
 * claim the section is making. Taken from 2a's "Things we've shipped".
 *
 * The result sits on the same line as the client name in mono, so the number is
 * findable at a glance without a label announcing it.
 */
export function FeaturedWorkSection() {
  return (
    <Section
      id="work"
      heading={FEATURED_WORK.heading}
      accent={FEATURED_WORK.accent}
      accentTone="emerald"
      micro={FEATURED_WORK.micro}
      revealBody={false}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_WORK.items.map((item, at) => (
          <Reveal as="li" key={item.client} index={at}>
            <article className="h-full overflow-hidden rounded-card border border-line bg-card transition-colors hover:border-brand/35">
              <PreviewChrome />
              <WorkPreview preview={item.preview} />

              <div className="border-t border-line/70 px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[14.5px] font-extrabold">
                    {item.client}
                  </h3>
                  <span
                    className={`shrink-0 font-mono text-[10.5px] tracking-[0.06em] ${METRIC[item.tone]}`}
                  >
                    {item.result}
                  </span>
                </div>

                <p className="mt-1 font-mono text-[11px] text-faint/85">
                  {item.sector}
                </p>

                <p className="mt-2 text-[13.5px] leading-[1.55] text-body">
                  {item.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
