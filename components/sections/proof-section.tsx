import { Container, Reveal } from "@/components/shared";
import { PROOF } from "@/lib/content/home";

/**
 * Home, block 2. The numbers and one quote, backing up the promise directly
 * above them.
 *
 * A band between hairlines rather than a card: it belongs to the hero, and
 * boxing it would cut it off from the claim it is there to support.
 *
 * The row is capped well inside the container. Spread across the full width the
 * four stats read as four unrelated items; held together they read as one claim
 * with four parts.
 *
 * Reference: the KPI row in twincoretech_site.html.
 */
export function ProofSection() {
  return (
    <section aria-label="Proof">
      <Container>
        <div className="border-t border-line py-9 sm:py-11">
          <dl className="mx-auto grid max-w-[860px] grid-cols-2 gap-x-6 gap-y-8 text-center lg:grid-cols-4">
            {PROOF.stats.map((stat, at) => (
              <Reveal key={stat.label} index={at}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-[26px] font-extrabold tracking-[-0.02em] sm:text-[30px]">
                    {stat.value}
                  </span>
                  <span className="mt-1 block font-mono text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
                    {stat.label}
                  </span>
                </dd>
              </Reveal>
            ))}
          </dl>

          <Reveal
            as="figure"
            delay={0.1}
            className="mx-auto mt-9 max-w-[680px] text-center"
          >
            <blockquote className="text-[15px] leading-[1.55] font-semibold text-balance sm:text-[16px]">
              &ldquo;{PROOF.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-2 font-mono text-[10.5px] tracking-[0.08em] text-faint uppercase">
              {PROOF.attribution}
            </figcaption>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
