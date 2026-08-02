import type { Metadata } from "next";
import Link from "next/link";

import { LoomStrings } from "@/components/home/loom-strings";
import { ROUTES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home v3",
  description: SITE.description,
};

/**
 * Home v3.
 *
 * A loom you can play. The company is named for one, so the hero is warp threads
 * strung across the screen that pluck as a cursor crosses them: each bows,
 * rings, and sounds a note. It is the brand rather than a decoration that
 * happens to sit on the brand's page.
 *
 * The notes are synthesised rather than loaded, so the whole thing costs no
 * download. Sound waits to be asked for, both because browsers rightly refuse
 * otherwise and because a page that makes a noise at you unbidden has already
 * lost the argument.
 *
 * The threads carry no meaning a reader could miss. Everything the page says is
 * said in text above and below them, and the loom is labelled for what it is, so
 * somebody who cannot see it or hear it loses a pleasure and not a word.
 */
export default function HomeV3Page() {
  const at = SITE.tagline.indexOf(". ");
  const claim = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  return (
    <section className="page-frame flex min-h-[var(--stage)] flex-col justify-center overflow-clip py-10">
      <div className="mx-auto w-full max-w-[68rem]">
        <p className="rise text-center font-mono text-[10px] font-bold tracking-[0.24em] text-label uppercase">
          {SITE.name} / play it
        </p>

        <h1
          style={{ "--in": "90ms" } as React.CSSProperties}
          className="rise mx-auto mt-6 max-w-[20ch] text-center text-[clamp(30px,3.8vw,52px)] leading-[1.06] font-extrabold tracking-[-0.042em] text-balance text-ink"
        >
          {claim}
          {promise ? <span className="text-active"> {promise}</span> : null}
        </h1>

        <LoomStrings className="mt-10" />

        <p
          style={{ "--in": "260ms" } as React.CSSProperties}
          className="rise mx-auto mt-10 max-w-[52ch] text-center text-[16.5px] leading-[1.6] text-body sm:text-[18px]"
        >
          {SITE.description}
        </p>

        <div
          style={{ "--in": "360ms" } as React.CSSProperties}
          className="rise mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={ROUTES.build}
            className="inline-flex items-center rounded-field bg-active px-7 py-[14px] text-[16px] font-semibold text-white transition-[opacity,transform] hover:opacity-90 active:translate-y-px"
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
      </div>
    </section>
  );
}
