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
 * Reference: the home hero in twincoretech_site.html.
 */
export function HeroSection() {
  return (
    <section id="top" aria-labelledby="hero-headline">
      <Container className="pt-12 pb-10 text-center sm:pt-16 sm:pb-12 lg:pt-20">
        <Eyebrow tone="faint">{HERO.eyebrow}</Eyebrow>

        <h1
          id="hero-headline"
          className="mx-auto mt-4 max-w-[860px] text-[30px] leading-[1.12] font-extrabold tracking-[-0.025em] text-balance sm:text-[36px] lg:text-[42px]"
        >
          {HERO.headline}
        </h1>

        <p className="mx-auto mt-4 max-w-[620px] text-[16px] leading-[1.6] text-body sm:text-[17px]">
          {HERO.sub}
        </p>

        <div className="mt-7 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
          <ActionButton href={PRIMARY_CTA.href}>
            {HERO.ctaLabel}
            <ArrowRight aria-hidden className="size-4" />
          </ActionButton>

          <ActionButton variant="secondary" href={SECONDARY_CTA.href}>
            {SECONDARY_CTA.label}
          </ActionButton>

          <ThoughtsOpenButton size="default" />
        </div>

        <p className="mt-4 text-[13px] text-faint">{SITE.reassurance}</p>
      </Container>
    </section>
  );
}
