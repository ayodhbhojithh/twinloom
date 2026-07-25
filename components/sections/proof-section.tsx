import { Container } from "@/components/shared";
import { PROOF } from "@/lib/content/home";

/**
 * Home, block 2. The numbers and one quote, backing up the promise directly
 * above them.
 *
 * A band between hairlines rather than a card: it belongs to the hero, and
 * boxing it would cut it off from the claim it is there to support.
 *
 * Reference: the KPI row in twincoretech_site.html.
 */
export function ProofSection() {
  return (
    <section aria-label="Proof">
      <Container>
        <div className="border-t border-line py-8 sm:py-10">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 text-center lg:grid-cols-4">
            {PROOF.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-[26px] font-extrabold tracking-[-0.02em] sm:text-[28px]">
                    {stat.value}
                  </span>
                  <span className="mt-1 block font-mono text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <figure className="mx-auto mt-8 max-w-[680px] text-center">
            <blockquote className="text-[15px] leading-[1.55] font-semibold text-balance sm:text-[16px]">
              &ldquo;{PROOF.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-2 font-mono text-[10.5px] tracking-[0.08em] text-faint uppercase">
              {PROOF.attribution}
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
