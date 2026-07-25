import { ArrowRight } from "lucide-react";

import { Panel, Reveal, Section } from "@/components/shared";
import { FINAL_CTA } from "@/lib/content/home";
import { SCOPE_ROUTE, SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/**
 * Home, block 8. The three doors, so nobody has to take the journey to get in
 * touch. The guided journey is the favoured one, and says so.
 *
 * Reference: "Three ways to start" in 1_landing_1.html, including the featured
 * card's accent border and the "Our favourite" pill.
 */
/* Door 2 is the only link on the page pointing at unbuilt work: the guided
   journey itself. Door 3 waits on the Thoughts and inspiration panel, so for now
   it hands over by email like door 1. */
const DOOR_LINKS = [
  `mailto:${SITE.email}`,
  SCOPE_ROUTE,
  `mailto:${SITE.email}?subject=My%20thoughts`,
] as const;

export function FinalCtaSection() {
  return (
    <Section
      id="contact"
      aside={FINAL_CTA.aside}
      heading={FINAL_CTA.heading}
      accent={FINAL_CTA.accent}
      accentTone="gradient"
      lead={FINAL_CTA.lead}
      align="center"
      size="large"
      revealBody={false}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FINAL_CTA.doors.map((door, index) => {
          const featured = "featured" in door && door.featured;
          const href = DOOR_LINKS[index];

          return (
            <Reveal as="li" key={door.title} index={index}>
              <Panel
                className={cn(
                  "relative flex h-full flex-col p-5 sm:p-6",
                  featured && "border-brand shadow-featured",
                )}
              >
                {"badge" in door && door.badge ? (
                  <span className="absolute top-4 right-4 rounded-pill bg-brand px-2.5 py-1 text-[10.5px] font-bold tracking-[0.05em] text-white uppercase">
                    {door.badge}
                  </span>
                ) : null}

                <span
                  aria-hidden
                  className={cn(
                    "flex size-[30px] items-center justify-center rounded-full text-[13px] font-extrabold",
                    featured ? "bg-brand text-white" : "bg-soft text-brand",
                  )}
                >
                  {door.number}
                </span>

                <h3 className="mt-3.5 max-w-[80%] text-[17px] font-bold">
                  {door.title}
                </h3>

                <p className="mt-1.5 flex-1 text-[14px] leading-[1.6] text-body">
                  {door.body}
                </p>

                <a
                  href={href}
                  className={cn(
                    "mt-4 inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold transition-colors",
                    featured
                      ? "rounded-btn-sm bg-brand px-4 py-2.5 text-white shadow-cta hover:-translate-y-px hover:shadow-cta-hover"
                      : "text-brand hover:text-ink",
                  )}
                >
                  {door.action}
                  <ArrowRight aria-hidden className="size-3.5" />
                </a>
              </Panel>
            </Reveal>
          );
        })}
      </ul>

      <Reveal delay={0.12} className="mt-6">
        <Panel className="mx-auto max-w-[1120px] p-5 text-center sm:p-6">
          <h3 className="text-[16px] font-bold">{FINAL_CTA.next.title}</h3>
          <p className="mt-2 text-[14.5px] leading-[1.65] text-body">
            {FINAL_CTA.next.body}
          </p>
          <p className="mt-3 text-[13.5px] leading-[1.6] font-semibold text-ink">
            {FINAL_CTA.next.closing}
          </p>
        </Panel>
      </Reveal>
    </Section>
  );
}
