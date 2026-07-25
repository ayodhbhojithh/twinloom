import { Container, Reveal } from "@/components/shared";
import { PROOF } from "@/lib/content/home";

/**
 * Home, block 2. The numbers and one quote, backing up the promise directly
 * above them.
 *
 * A band between hairlines rather than a card: it belongs to the hero, and
 * boxing it would cut it off from the claim it is there to support.
 *
 * Everything here is capped to one measure and the rule is capped with it. A rule
 * running the full 1440px above an 860px row draws a line longer than the thing it
 * divides, which reads as a stray edge rather than as a separator.
 *
 * The row is capped well inside the container for the same reason. Spread across
 * the full width the four stats read as four unrelated items; held together they
 * read as one claim with four parts, and each number keeps its label under it
 * rather than beside a neighbour's.
 *
 * Reference: the KPI row in twincoretech_site.html.
 */
export function ProofSection() {
  return (
    <section aria-label="Proof">
      <Container>
        <div className="mx-auto max-w-[880px] border-t border-line py-10 sm:py-12">
          <dl className="mx-auto grid max-w-[760px] grid-cols-2 gap-x-8 gap-y-9 text-center lg:grid-cols-4">
            {PROOF.stats.map((stat, at) => (
              <Reveal key={stat.label} index={at}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-[26px] leading-none font-extrabold tracking-[-0.02em] sm:text-[30px]">
                    {stat.value}
                  </span>
                  <span className="mt-2 block font-mono text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
                    {stat.label}
                  </span>
                </dd>
              </Reveal>
            ))}
          </dl>

          {/* The quote is a different kind of claim to the numbers, so it gets a
              hairline of its own rather than just more space. */}
          <Reveal
            as="figure"
            delay={0.1}
            className="mx-auto mt-10 max-w-[620px] border-t border-line pt-8 text-center"
          >
            <blockquote className="text-[15px] leading-[1.6] font-semibold text-balance sm:text-[16px]">
              &ldquo;{PROOF.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-2.5 font-mono text-[10.5px] tracking-[0.08em] text-faint uppercase">
              {PROOF.attribution}
            </figcaption>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
