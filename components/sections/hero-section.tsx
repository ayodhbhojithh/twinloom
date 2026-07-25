import { ArrowRight } from "lucide-react";

import { ActionButton, Container, Eyebrow, Rise } from "@/components/shared";
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
 * Above the fold, so it rises on load rather than on scroll, one line after
 * another. Sequential `index` rather than hand-picked delays, so the cascade
 * stays even if a line is added or removed.
 *
 * Reference: the home hero in twincoretech_site.html for the content, turn 2 of
 * the design canvas for the treatment.
 */
export function HeroSection() {
  return (
    <section id="top" aria-labelledby="hero-headline">
      <Container className="pt-12 pb-10 text-center sm:pt-16 lg:pt-20">
        <Rise index={0}>
          <Eyebrow tone="faint">{HERO.eyebrow}</Eyebrow>
        </Rise>

        <Rise index={1} y={22}>
          <h1
            id="hero-headline"
            className="mt-4 text-[34px] leading-[1.3] font-extrabold tracking-[-0.03em] sm:text-[44px] lg:text-[54px]"
          >
            {HERO.headline.map((line) => (
              <span key={line.text} className="block">
                {line.text}
                {"accent" in line && line.accent ? (
                  <span className="text-brand-gradient">{line.accent}</span>
                ) : null}
              </span>
            ))}
          </h1>
        </Rise>

        <Rise index={2}>
          <p className="mt-5 font-script text-[21px] leading-tight text-faint sm:text-[25px]">
            {HERO.aside}
          </p>
        </Rise>

        <Rise index={3}>
          <p className="mt-5 text-[16px] leading-[1.6] text-body sm:text-[17px]">
            {HERO.sub}
          </p>
        </Rise>

        <Rise
          index={4}
          y={22}
          className="mt-7 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center"
        >
          <ActionButton href={PRIMARY_CTA.href}>
            {HERO.ctaLabel}
            <ArrowRight aria-hidden className="size-4" />
          </ActionButton>

          <ActionButton variant="secondary" href={SECONDARY_CTA.href}>
            {SECONDARY_CTA.label}
          </ActionButton>

          <ThoughtsOpenButton size="default" />
        </Rise>

        <Rise index={5} y={10}>
          <p className="mt-4 font-mono text-[11.5px] tracking-[0.06em] text-faint">
            {SITE.reassurance}
          </p>
        </Rise>
      </Container>
    </section>
  );
}
