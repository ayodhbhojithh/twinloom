import { Plus } from "lucide-react";

import { Reveal, Section } from "@/components/shared";
import { FAQ } from "@/lib/content/home";

/**
 * Home, block 8. The questions that come up on every enquiry.
 *
 * Two columns of native `<details>`, exactly as 2a lays them out. Native means
 * this whole block stays on the server with no JavaScript, works before
 * hydration, and is findable by the browser's own in-page search when closed.
 *
 * The plus rotates a quarter turn into a cross on open, so one glyph does both
 * states and nothing shifts position when it changes.
 */
export function FaqSection() {
  return (
    <Section
      id="faq"
      heading={FAQ.heading}
      accent={FAQ.accent}
      accentTone="violet"
      micro={FAQ.micro}
      revealBody={false}
    >
      <ul className="grid items-start gap-3 lg:grid-cols-2">
        {FAQ.items.map((item, at) => (
          <Reveal as="li" key={item.question} index={at} y={12}>
            <details className="group rounded-card-sm border border-line bg-card px-5 py-4 transition-colors open:border-brand/30 hover:border-brand/25">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] font-bold [&::-webkit-details-marker]:hidden">
                {item.question}
                <Plus
                  aria-hidden
                  className="size-4 shrink-0 text-brand transition-transform duration-300 group-open:rotate-45"
                  strokeWidth={2.5}
                />
              </summary>

              <p className="mt-2 text-[13.5px] leading-[1.6] text-body">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
