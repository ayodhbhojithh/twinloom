import type { Metadata } from "next";
import Link from "next/link";

import { LiquidWord } from "@/components/home/liquid-word";
import { ROUTES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home v4",
  description: SITE.description,
};

/**
 * Home v4.
 *
 * The name as a liquid. It is the wordmark, set in the site's own typeface and
 * put back on screen in narrow strips, each one lifted by its own amount. Run a
 * cursor through it and the surface takes the disturbance and passes it on;
 * press it and it splashes.
 *
 * The displacement is an actual wave simulation rather than a sine dressed up as
 * one, so ripples travel, reflect off the ends of the word and interfere on the
 * way back. Two crossing sines look like a flag. This looks like a liquid, and
 * the whole difference is that the strips are tied to each other.
 *
 * The heading is real text and the canvas is `aria-hidden`. What is on screen is
 * a drawing of a word; what a reader or a crawler gets is the word.
 */
export default function HomeV4Page() {
  const at = SITE.tagline.indexOf(". ");
  const claim = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  return (
    <section className="page-frame flex min-h-[var(--stage)] flex-col justify-center overflow-clip py-10">
      <div className="mx-auto w-full max-w-wide">
        <p className="rise text-center font-mono text-[10px] font-bold tracking-[0.24em] text-label uppercase">
          {SITE.name} / touch it
        </p>

        <h1 className="sr-only">{SITE.name}</h1>

        <LiquidWord word={SITE.name} className="mt-4 w-full cursor-crosshair" />

        <p className="text-center font-mono text-[9.5px] font-bold tracking-[0.2em] text-planned uppercase">
          Run your cursor through it, or press to splash
        </p>

        <div className="mt-14 grid gap-x-16 gap-y-8 lg:grid-cols-2 lg:items-end">
          <p
            style={{ "--in": "90ms" } as React.CSSProperties}
            className="rise max-w-[17ch] text-[clamp(28px,3.4vw,50px)] leading-[1.06] font-extrabold tracking-[-0.04em] text-ink"
          >
            {claim}
            {promise ? <span className="text-mark"> {promise}</span> : null}
          </p>

          <div style={{ "--in": "220ms" } as React.CSSProperties} className="rise">
            <p className="max-w-[52ch] text-[16.5px] leading-[1.6] text-body sm:text-[17.5px]">
              {SITE.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link
                href={ROUTES.build}
                className="inline-flex items-center rounded-field bg-mark px-5 py-2.5 text-[15px] font-semibold text-white transition-[opacity,transform] hover:opacity-90 active:translate-y-px"
              >
                Build your website
              </Link>
              <Link
                href={ROUTES.book}
                className="inline-flex items-center rounded-field bg-ink px-5 py-2.5 text-[15px] font-semibold text-white transition-[opacity,transform] hover:opacity-85 active:translate-y-px"
              >
                Book a meeting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
