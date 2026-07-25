import { Check } from "lucide-react";

import { MonoLabel, Panel, SectionShell } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { CARE_PLANS, PACKAGE_DETAILS } from "@/lib/content/packages";
import { SITE } from "@/lib/content/site";
import { money, PACKAGE_TIERS } from "@/lib/scope";
import { cn } from "@/lib/utils";

const tierById = new Map(PACKAGE_TIERS.map((tier) => [tier.id, tier]));

export function PackagesSection() {
  return (
    <SectionShell
      id="packages"
      eyebrow="Packages"
      title="Five shapes of build, and the plan that keeps it running"
      lead="The estimator recommends one of these from whatever you tick, so you never have to work out which column you are in. Every figure is a starting point, excluding VAT."
      aside={
        <Panel className="max-w-[300px] p-4">
          <MonoLabel>Where these come from</MonoLabel>
          <p className="mt-2 text-[12.5px] leading-[1.6] text-ink-3">
            The estimator crosses a threshold and the package steps up with the
            timeline. Same numbers, one source.
          </p>
        </Panel>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {PACKAGE_DETAILS.map((detail) => {
          const tier = tierById.get(detail.tierId);
          const featured = detail.tierId === "sme-launch";

          return (
            <Panel
              key={detail.tierId}
              className={cn(
                "flex flex-col gap-4 p-5",
                featured &&
                  "border-brand/40 shadow-[0_22px_50px_-34px_rgba(124,58,237,0.55)]",
              )}
            >
              <div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[17px] font-extrabold tracking-[-0.015em]">
                    {tier?.name ?? detail.tierId}
                  </h3>
                  {featured ? (
                    <span className="rounded-full bg-brand-tint px-2 py-0.5 font-mono text-[9px] font-semibold tracking-[0.08em] text-brand uppercase">
                      Most picked
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 font-mono text-[10px] tracking-[0.08em] text-ink-5 uppercase">
                  {detail.pagesLabel}
                  {tier ? ` · ${tier.timeline}` : ""}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] tracking-[0.08em] text-ink-5 uppercase">
                  From
                </span>
                <div className="text-[26px] font-extrabold tracking-[-0.025em] tabular-nums">
                  {money(detail.fromPrice)}
                  {detail.open ? "+" : ""}
                </div>
              </div>

              <p className="text-[13px] leading-[1.55] text-ink-3">
                {detail.blurb}
              </p>

              <ul className="mt-auto flex flex-col gap-2 border-t border-dashed border-hairline pt-3">
                {detail.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-ink-3"
                  >
                    <Check
                      aria-hidden
                      className="mt-0.5 size-3.5 shrink-0 text-brand"
                      strokeWidth={3}
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <MonoLabel>Care plans</MonoLabel>
            <h3 className="mt-1.5 text-[20px] font-extrabold tracking-[-0.02em] sm:text-[24px]">
              Monthly, optional, cancel whenever
            </h3>
          </div>
          <p className="font-mono text-[10px] tracking-[0.06em] text-ink-5 uppercase">
            never part of the build total
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CARE_PLANS.map((plan) => (
            <Panel
              key={plan.name}
              className={cn(
                "flex flex-col gap-2 p-5",
                plan.featured && "border-brand/40",
              )}
            >
              <h4 className="text-[15px] font-extrabold">{plan.name}</h4>
              <div className="text-[22px] font-extrabold tracking-[-0.025em] tabular-nums">
                {plan.priceHigh
                  ? `${money(plan.price)} to ${money(plan.priceHigh)}`
                  : money(plan.price)}
                {plan.open ? "+" : ""}
                <span className="ml-1 text-[12px] font-semibold text-ink-4">
                  a month
                </span>
              </div>
              <p className="text-[12.5px] leading-[1.55] text-ink-3">
                {plan.body}
              </p>
            </Panel>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="h-11 px-5">
            <a href={SITE.bookingHref}>Talk it through on a call</a>
          </Button>
          <p className="font-mono text-[10px] tracking-[0.04em] text-ink-5">
            not sure which one? The estimator will point at it.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
