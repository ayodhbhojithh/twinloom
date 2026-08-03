import type { Metadata } from "next";
import Link from "next/link";

import { ParticleWordmark } from "@/components/home/particle-wordmark";
import { ROUTES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home v2",
  description: SITE.description,
};

/**
 * Home v2.
 *
 * The name, built out of a few thousand points and turning. It is sampled from
 * the word itself in the site's own typeface, so the cloud is the wordmark
 * rather than a picture of one, and it follows the pointer within a few degrees.
 *
 * The heading is real text and the canvas is `aria-hidden`. What is on screen is
 * a drawing of a word; what a reader or a crawler gets is the word. Painting a
 * company name into a canvas and leaving nothing behind it is the commonest way
 * a hero like this quietly costs a site its name.
 *
 * Everything else here is deliberately quiet. The cloud is doing the work, and
 * anything loud beside it would be two things competing.
 */
export default function HomeV2Page() {
  return (
    <section className="page-frame relative flex min-h-[var(--stage)] flex-col justify-center overflow-clip py-10">
      <div className="mx-auto w-full max-w-wide">
        <p className="rise text-center font-mono text-[10px] font-bold tracking-[0.24em] text-label uppercase">
          {SITE.tagline.split(". ")[0]}
        </p>

        <h1 className="sr-only">{SITE.name}</h1>

        <ParticleWordmark
          word={SITE.name}
          className="mx-auto h-[38svh] max-h-[420px] min-h-[210px] w-full cursor-crosshair"
        />

        <p
          style={{ "--in": "700ms" } as React.CSSProperties}
          className="rise mx-auto max-w-[54ch] text-center text-[17px] leading-[1.6] text-body sm:text-[18.5px]"
        >
          {SITE.description}
        </p>

        <div
          style={{ "--in": "820ms" } as React.CSSProperties}
          className="rise mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={ROUTES.build}
            className="inline-flex items-center rounded-field accent-fill px-7 py-[14px] text-[16px] font-semibold text-white transition-[opacity,transform] hover:opacity-90 active:translate-y-px"
          >
            Build your website
          </Link>
          <Link
            href={ROUTES.book}
            className="inline-flex items-center rounded-field border border-ink bg-field px-7 py-[14px] text-[16px] font-semibold text-ink transition-[color,background-color,transform] hover:bg-ink hover:text-white active:translate-y-px"
          >
            Book a meeting
          </Link>
        </div>

        <p
          style={{ "--in": "940ms" } as React.CSSProperties}
          className="rise mt-7 text-center font-mono text-[9.5px] font-bold tracking-[0.2em] text-planned uppercase"
        >
          Move your cursor across the name
        </p>
      </div>
    </section>
  );
}
