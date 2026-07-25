import { ArrowRight } from "lucide-react";

import { ActionButton, Container, Eyebrow } from "@/components/shared";
import { HERO } from "@/lib/content/home";
import { PRIMARY_CTA, SECONDARY_CTA, SITE } from "@/lib/content/site";

/**
 * Home, block 1. Reassure in seconds and make the journey the obvious next move,
 * with "Book a call" beside it for anyone who would rather just talk.
 *
 * Reference: TCT_Sitemap.md §1, and the hero in 1_landing_1.html for the
 * centred treatment (12px eyebrow, 38px headline, 600px sub, one big blue call
 * to action, a quiet reassurance under it).
 */
export function HeroSection() {
  return (
    <section id="top" aria-labelledby="hero-headline">
      <Container className="pt-12 pb-10 text-center sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
        <Eyebrow>{HERO.eyebrow}</Eyebrow>

        <h1
          id="hero-headline"
          className="mx-auto mt-3.5 max-w-[760px] text-[30px] leading-[1.15] font-extrabold tracking-[-0.02em] text-balance sm:text-[34px] lg:text-[38px]"
        >
          {HERO.headline}
        </h1>

        <p className="mx-auto mt-4 max-w-[600px] text-[17px] leading-[1.55] text-body">
          {HERO.sub}
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ActionButton size="lg" href={PRIMARY_CTA.href}>
            {PRIMARY_CTA.label}
            <ArrowRight aria-hidden className="size-4" />
          </ActionButton>

          <ActionButton variant="secondary" size="lg" href={SECONDARY_CTA.href}>
            {SECONDARY_CTA.label}
          </ActionButton>
        </div>

        <p className="mt-3.5 text-[13px] text-faint">{SITE.reassurance}</p>
      </Container>
    </section>
  );
}
