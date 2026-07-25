import {
  CalendarCheck,
  PenLine,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

import { Panel, Reveal, Section } from "@/components/shared";
import { OUTCOMES, type OutcomeItem } from "@/lib/content/home";

const ICONS: Record<OutcomeItem["icon"], LucideIcon> = {
  Rocket,
  RefreshCw,
  Search,
  ShoppingBag,
  PenLine,
  CalendarCheck,
  ShieldCheck,
};

/**
 * Home, block 3. The outcome menu: seven plain-English things a visitor might
 * want, so they can recognise themselves rather than decode a service list.
 *
 * Reference: TCT_Sitemap.md §1, with the card treatment from 1_landing_1.html
 * (38px tinted icon tile, 16px title, 14px body).
 */
export function OutcomesSection() {
  return (
    <Section
      id="services"
      heading={OUTCOMES.heading}
      accent={OUTCOMES.accent}
      accentTone="indigo"
      micro={OUTCOMES.micro}
      lead={OUTCOMES.lead}
      revealBody={false}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OUTCOMES.items.map((item, at) => {
          const Icon = ICONS[item.icon];

          return (
            <Reveal as="li" key={item.title} index={at}>
              <Panel className="h-full p-5">
                <span
                  aria-hidden
                  className="flex size-[38px] items-center justify-center rounded-tile bg-soft text-brand"
                >
                  <Icon className="size-[19px]" strokeWidth={2} />
                </span>

                <h3 className="mt-3.5 text-[16px] font-bold">{item.title}</h3>

                <p className="mt-1.5 text-[14px] leading-[1.6] text-body">
                  {item.body}
                </p>
              </Panel>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
