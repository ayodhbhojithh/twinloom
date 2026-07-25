import {
  LayoutTemplate,
  LineChart,
  PenLine,
  Search,
  ServerCog,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Panel, SectionShell } from "@/components/shared";
import { SERVICES, type ServiceCard } from "@/lib/content/services";
import { getSection } from "@/lib/scope";

const ICONS: Record<ServiceCard["icon"], LucideIcon> = {
  LayoutTemplate,
  PenLine,
  Search,
  LineChart,
  ShieldCheck,
  ServerCog,
};

export function ServicesSection() {
  return (
    <SectionShell
      id="what-you-get"
      eyebrow="What you get"
      title="Six things every site needs, and nothing you do not"
      lead="These are the same groups you will find in the estimator below. What you tick there becomes the what is included list in your proposal, line for line."
      tone="surface"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = ICONS[service.icon];
          const accent = getSection(service.scopeSectionId)?.accent ?? "#7c3aed";

          return (
            <Panel
              key={service.title}
              className="flex flex-col gap-3 p-5 transition-shadow hover:shadow-[0_18px_40px_-32px_rgba(35,39,51,0.4)]"
            >
              <span
                aria-hidden
                className="grid size-10 place-items-center rounded-[11px]"
                style={{ background: `${accent}14`, color: accent }}
              >
                <Icon className="size-[18px]" />
              </span>

              <h3 className="text-[16px] font-extrabold tracking-[-0.01em]">
                {service.title}
              </h3>

              <p className="text-[13.5px] leading-[1.6] text-ink-3">
                {service.body}
              </p>
            </Panel>
          );
        })}
      </div>
    </SectionShell>
  );
}
