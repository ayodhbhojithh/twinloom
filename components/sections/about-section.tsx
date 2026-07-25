import { Check, ChevronDown } from "lucide-react";

import { Panel, Reveal, Section } from "@/components/shared";
import { WHO_IS_BEHIND } from "@/lib/content/home";

/**
 * Home, block 6. Who is behind it, plus the technical detail folded away for the
 * minority who want it.
 *
 * The note is a native `<details>`, the same device the artifacts use for their
 * FAQ, which keeps this whole block on the server with no JavaScript.
 */
export function AboutSection() {
  return (
    <Section
      id="about"
      heading={WHO_IS_BEHIND.heading}
      lead={WHO_IS_BEHIND.lead}
      revealBody={false}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal index={0}>
          <Panel className="h-full p-5 sm:p-6">
            <h3 className="text-[15px] font-bold">Our story</h3>
            <p className="mt-2 text-[14.5px] leading-[1.65] text-body">
              {WHO_IS_BEHIND.story}
            </p>
          </Panel>
        </Reveal>

        <Reveal index={1}>
          <Panel className="h-full p-5 sm:p-6">
            <h3 className="text-[15px] font-bold">What we believe</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {WHO_IS_BEHIND.beliefs.map((belief) => (
                <li
                  key={belief}
                  className="flex items-start gap-2 text-[14px] leading-[1.6] text-body"
                >
                  <Check
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-brand"
                    strokeWidth={2.5}
                  />
                  {belief}
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
      </div>

      <Reveal delay={0.12} className="mt-4">
        <details className="group rounded-card border border-line bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-[14.5px] font-bold [&::-webkit-details-marker]:hidden">
            {WHO_IS_BEHIND.techNote.summary}
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 text-faint transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <p className="px-5 pb-5 text-[14px] leading-[1.65] text-body">
            {WHO_IS_BEHIND.techNote.body}
          </p>
        </details>
      </Reveal>
    </Section>
  );
}
