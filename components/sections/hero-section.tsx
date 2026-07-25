import { ArrowRight, CalendarClock } from "lucide-react";

import { Container, MonoLabel, Panel, ScriptNote } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/content/site";
import { pluralise } from "@/lib/format";
import { SCOPE_COMPONENTS, SCOPE_SECTIONS } from "@/lib/scope";

const ASSURANCES = [
  "No email gate",
  "A range, never a fake quote",
  "Fixed proposal after one call",
] as const;

const optionCount = SCOPE_COMPONENTS.reduce(
  (sum, component) => sum + component.options.length,
  0,
);

export function HeroSection() {
  return (
    <section id="top" className="bg-canvas py-14 sm:py-18 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center lg:gap-16">
          <div>
            <MonoLabel>{SITE.tagline}</MonoLabel>

            <h1 className="mt-3 text-[34px] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance sm:text-[46px] lg:text-[56px]">
              Price your website{" "}
              <span className="text-brand">before you talk to anyone</span>.
            </h1>

            <p className="mt-5 max-w-[600px] text-base leading-[1.6] text-ink-3 sm:text-[17px]">
              Tick the parts you actually need. The layout redraws, the estimate
              moves, and the recommended package and timeline follow. Nothing is
              hidden behind a form.
            </p>

            <ScriptNote className="mt-3">
              it is a pre estimator, not a quote. That is the point.
            </ScriptNote>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-12 justify-center px-5">
                <a href="#estimator">
                  Price it yourself
                  <ArrowRight data-icon="inline-end" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 justify-center px-5"
              >
                <a href={SITE.bookingHref}>
                  <CalendarClock data-icon="inline-start" />
                  Book a 30 minute scope call
                </a>
              </Button>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {ASSURANCES.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.06em] text-ink-4 uppercase"
                >
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-brand/60"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Panel className="p-5">
            <MonoLabel>What you price</MonoLabel>

            <ul className="mt-4 flex flex-col gap-3">
              {SCOPE_SECTIONS.map((section) => (
                <li key={section.id} className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className="mt-1.5 size-2.5 shrink-0 rounded-full"
                    style={{ background: section.accent }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-bold">
                      {section.name}
                    </span>
                    <span className="block text-[11.5px] text-ink-4">
                      {section.tag}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-ink-5">
                    {section.components.length}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t border-dashed border-hairline pt-3 font-mono text-[10px] leading-[1.6] tracking-[0.04em] text-ink-5">
              {pluralise(SCOPE_COMPONENTS.length, "component")},{" "}
              {pluralise(optionCount, "option")}. Every line explained in plain
              English.
            </p>
          </Panel>
        </div>
      </Container>
    </section>
  );
}
