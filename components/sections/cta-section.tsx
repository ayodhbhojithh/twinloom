import { ArrowRight, Mail, Phone } from "lucide-react";

import { Container, MonoLabel } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/content/site";

const WHAT_HAPPENS = [
  "We go through what you ticked, line by line",
  "We tell you what to drop and what you have missed",
  "You get a fixed proposal, not a range",
] as const;

export function CtaSection() {
  return (
    <section
      id="book"
      aria-labelledby="book-title"
      className="scroll-mt-20 border-t border-hairline bg-canvas py-14 sm:py-18 lg:py-22"
    >
      <Container>
        <div className="overflow-hidden rounded-card border border-hairline bg-ink px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center lg:gap-14">
            <div>
              <MonoLabel className="text-white/55">
                Thirty minutes, no obligation
              </MonoLabel>

              <h2
                id="book-title"
                className="mt-3 text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance sm:text-[36px] lg:text-[42px]"
              >
                Bring what you ticked. We will tell you what it really takes.
              </h2>

              <p className="mt-4 max-w-[520px] text-[15px] leading-[1.65] text-white/70">
                A scope call is a conversation, not a pitch. If the honest answer
                is that you need less than you ticked, that is what you will
                hear.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="h-12 justify-center bg-white px-5 text-ink hover:bg-white/85"
                >
                  <a href={`mailto:${SITE.email}?subject=Scope%20call`}>
                    Book a 30 minute scope call
                    <ArrowRight data-icon="inline-end" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-12 justify-center px-5 text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="#estimator">Go back and adjust the scope</a>
                </Button>
              </div>
            </div>

            <div className="rounded-inner border border-white/12 bg-white/[0.04] p-5">
              <MonoLabel className="text-white/55">
                What happens on the call
              </MonoLabel>

              <ul className="mt-3 flex flex-col gap-2.5">
                {WHAT_HAPPENS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-white/85"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/45"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-col gap-2 border-t border-white/12 pt-4">
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2.5 text-[13px] text-white/70 transition-colors hover:text-white"
                >
                  <Mail aria-hidden className="size-3.5" />
                  {SITE.email}
                </a>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-[13px] text-white/70 transition-colors hover:text-white"
                >
                  <Phone aria-hidden className="size-3.5" />
                  {SITE.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
