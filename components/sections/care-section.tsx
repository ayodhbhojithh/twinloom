import { ActionButton, Panel, Reveal, Section } from "@/components/shared";
import { CARE_TEASER } from "@/lib/content/home";
import { PRIMARY_CTA } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/**
 * Home, block 7. The care teaser: three monthly plans, the response times, and
 * the ownership line that makes the plan a service rather than a lock-in.
 *
 * Prices are the artifacts' own and are flagged illustrative there, so the note
 * stays until they are confirmed.
 */
export function CareSection() {
  return (
    <Section
      id="care"
      heading={CARE_TEASER.heading}
      lead={CARE_TEASER.lead}
      revealBody={false}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARE_TEASER.plans.map((plan, at) => {
          const featured = "featured" in plan && plan.featured;

          return (
            <Reveal as="li" key={plan.name} index={at}>
              <Panel
                className={cn(
                  "h-full p-5 sm:p-6",
                  featured && "border-brand shadow-featured",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[16px] font-bold">{plan.name}</h3>
                  {featured ? (
                    <span className="rounded-pill bg-brand px-2.5 py-1 text-[10.5px] font-bold tracking-[0.05em] text-white uppercase">
                      Most chosen
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 text-[28px] font-extrabold tracking-[-0.02em] tabular-nums">
                  £{plan.price}
                  <span className="ml-1 text-[13px] font-semibold text-faint">
                    / month
                  </span>
                </p>

                <p className="mt-2.5 text-[14px] leading-[1.6] text-body">
                  {plan.body}
                </p>
              </Panel>
            </Reveal>
          );
        })}
      </ul>

      <Reveal
        delay={0.12}
        className="mx-auto mt-7 max-w-[1120px] text-center"
      >
        <p className="text-[13.5px] leading-[1.6] text-body">
          <span className="font-semibold text-ink">Response times.</span>{" "}
          {CARE_TEASER.responseTimes}
        </p>
        <p className="mt-2 text-[12.5px] leading-[1.6] text-faint">
          {CARE_TEASER.note}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ActionButton href={PRIMARY_CTA.href}>
            {PRIMARY_CTA.label}
          </ActionButton>
          <ActionButton variant="secondary" href="#contact">
            Ask about care
          </ActionButton>
        </div>
      </Reveal>
    </Section>
  );
}
