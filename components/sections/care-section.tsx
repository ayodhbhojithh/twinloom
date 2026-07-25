import { ActionButton, Reveal, Section } from "@/components/shared";
import { CARE_TEASER } from "@/lib/content/home";
import { PRIMARY_CTA } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/** One colour per bullet, so a list of three reads as three things, not a block. */
const DOT: Record<string, string> = {
  emerald: "text-accent-emerald",
  blue: "text-accent-blue",
  teal: "text-accent-teal",
  violet: "text-accent-violet",
  amber: "text-accent-amber",
  pink: "text-accent-pink",
};

/**
 * Home, block 7. The care teaser, as 2a prices things.
 *
 * The plan name is mono and small, the price is the largest thing on the card,
 * and the detail is dotted bullets rather than a paragraph. That order matches
 * the order the question gets asked: what is it called, what does it cost, what
 * do I get.
 *
 * The "Most chosen" pill straddles the top border of the featured card rather
 * than sitting inside it. It is the one deliberate break in the grid, which is
 * exactly why the eye lands there first.
 *
 * Prices are the artifacts' own and are flagged illustrative there, so the note
 * stays until they are confirmed.
 */
export function CareSection() {
  return (
    <Section
      id="care"
      heading={CARE_TEASER.heading}
      accent={CARE_TEASER.accent}
      accentTone="pink"
      micro={CARE_TEASER.micro}
      revealBody={false}
    >
      {/* Top padding leaves room for the pill to overhang the featured card. */}
      <ul className="grid gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
        {CARE_TEASER.plans.map((plan, at) => {
          const featured = "featured" in plan && plan.featured;

          return (
            <Reveal as="li" key={plan.name} index={at}>
              <article
                className={cn(
                  "relative h-full rounded-card border bg-card p-5 sm:p-6",
                  featured
                    ? "border-[1.5px] border-brand shadow-featured"
                    : "border-line",
                )}
              >
                {featured ? (
                  <span className="absolute -top-[11px] left-[22px] rounded-pill border border-[#ded2fb] bg-soft px-2.5 py-[3px] font-mono text-[10px] font-semibold tracking-[0.12em] text-brand">
                    MOST CHOSEN
                  </span>
                ) : null}

                <h3 className="font-mono text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
                  {plan.name}
                </h3>

                <p
                  className={cn(
                    "mt-2.5 text-[30px] leading-none font-extrabold tracking-[-0.02em] tabular-nums sm:text-[32px]",
                    featured && "text-brand",
                  )}
                >
                  £{plan.price}
                  <span className="ml-1 align-baseline text-[14px] font-semibold tracking-normal text-faint/80">
                    / month
                  </span>
                </p>

                <p className="mt-2 text-[13px] text-faint">{plan.body}</p>

                <ul className="mt-4 flex flex-col gap-[7px]">
                  {plan.points.map((point) => (
                    <li
                      key={point.label}
                      className="flex items-baseline gap-2 text-[13.5px] leading-[1.5] text-body"
                    >
                      <span
                        aria-hidden
                        className={`text-[9px] leading-none ${DOT[point.tone]}`}
                      >
                        ●
                      </span>
                      {point.label}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </ul>

      <Reveal delay={0.12} className="mt-6">
        <p className="text-[13.5px] leading-[1.6] text-body">
          <span className="font-semibold text-ink">Response times.</span>{" "}
          {CARE_TEASER.responseTimes}
        </p>
        <p className="mt-1.5 text-[12.5px] leading-[1.6] text-faint">
          {CARE_TEASER.note}
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
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
