import { Container, Panel } from "@/components/shared";
import { PROOF } from "@/lib/content/home";

/**
 * Home, block 2. The scope spec calls social proof the highest impact thing
 * missing from the site today, so the strip is built and clearly marked as
 * placeholder rather than left out.
 *
 * Reference: TCT_Sitemap.md §1 "Proof strip", and the KPI row in
 * twincoretech_site.html.
 */
export function ProofSection() {
  return (
    <section aria-label="Proof" className="pb-12 sm:pb-16 lg:pb-20">
      <Container>
        <Panel className="px-5 py-7 sm:px-8 sm:py-9">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 text-center lg:grid-cols-4">
            {PROOF.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-[26px] font-extrabold tracking-[-0.02em] sm:text-[30px]">
                    {stat.value}
                  </span>
                  <span className="mt-1 block font-mono text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <figure className="mt-8 border-t border-line pt-7 text-center">
            <blockquote className="mx-auto max-w-[560px] text-[17px] leading-[1.5] font-semibold text-balance sm:text-[19px]">
              &ldquo;{PROOF.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-[13px] font-medium text-body">
              {PROOF.attribution}
            </figcaption>
          </figure>

          <p className="mt-6 text-center font-mono text-[10px] tracking-[0.08em] text-faint uppercase">
            {PROOF.placeholder}
          </p>
        </Panel>
      </Container>
    </section>
  );
}
