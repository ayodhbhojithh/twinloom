import { ArrowRight } from "lucide-react";

import { ActionButton, Container, Eyebrow } from "@/components/shared";
import { ThoughtsOpenButton } from "@/components/thoughts";
import { HERO } from "@/lib/content/home";
import { PRIMARY_CTA, SECONDARY_CTA, SITE } from "@/lib/content/site";

/**
 * Home, block 1. Reassure in seconds, then offer all three doors at once.
 *
 * Three, not two: the journey for anyone happy to be guided, a call for anyone
 * who would rather talk, and the Thoughts panel for anyone who already knows
 * what they want and would rather just hand it over.
 *
 * Styled after 2a: a headline big enough to carry weight, one gradient span in
 * it, and a handwritten aside underneath.
 *
 * Reference: the home hero in twincoretech_site.html for the content, turn 2 of
 * the design canvas for the treatment.
 */
export function HeroSection() {
  return (
    <section id="top" aria-labelledby="hero-headline">
      <Container className="pt-14 pb-12 text-center sm:pt-18 sm:pb-14 lg:pt-24">
        <Eyebrow tone="faint">{HERO.eyebrow}</Eyebrow>

        <h1
          id="hero-headline"
          className="mx-auto mt-4 max-w-[1120px] text-[34px] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance sm:text-[44px] lg:text-[54px]"
        >
          {HERO.headline.lead}
          <span className="text-brand-gradient">{HERO.headline.accent}</span>
        </h1>

        <p className="mx-auto mt-5 font-script text-[21px] leading-tight text-faint sm:text-[25px]">
          {HERO.aside}
        </p>

        <p className="mx-auto mt-5 max-w-[820px] text-[16px] leading-[1.6] text-body sm:text-[17px]">
          {HERO.sub}
        </p>

        <div className="mt-7 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
          <ActionButton size="lg" href={PRIMARY_CTA.href}>
            {HERO.ctaLabel}
            <ArrowRight aria-hidden className="size-4" />
          </ActionButton>

          <ActionButton variant="secondary" size="lg" href={SECONDARY_CTA.href}>
            {SECONDARY_CTA.label}
          </ActionButton>

          <ThoughtsOpenButton size="lg" />
        </div>

        <p className="mt-5 font-mono text-[11.5px] tracking-[0.06em] text-faint">
          {SITE.reassurance}
        </p>
      </Container>
    </section>
  );
}
