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
 * The name, woven, and playable. The company is named for a loom, so the hero is
 * warp threads with the wordmark woven into them: where a thread crosses a
 * letter it is ink, everywhere else a hairline. The word is not drawn on the
 * cloth, it is made of it.
 *
 * Which is what makes plucking worth doing. A bowed thread carries its share of
 * the letter with it, so running a cursor across the name ripples the name.
 *
 * The notes are synthesised rather than loaded, so the whole thing costs no
 * download. Sound waits to be asked for, both because browsers rightly refuse
 * otherwise and because a page that makes a noise at you unbidden has already
 * lost the argument.
 *
 * Below the loom the page turns into two columns rather than one centred stack.
 * A stack put the claim, the standfirst and the actions in a narrow ribbon down
 * the middle with the width unused on both sides; facing them off against each
 * other fills it and gives the eye a left edge to come back to.
 *
 * The threads carry no meaning a reader could miss. Everything the page says is
 * said in text, and the loom is labelled for what it is, so somebody who cannot
 * see it or hear it loses a pleasure and not a word.
 */
export default function HomeV3Page() {
  const at = SITE.tagline.indexOf(". ");
  const claim = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  return (
    <section className="page-frame flex min-h-[var(--stage)] flex-col justify-center overflow-clip py-10">
      <div className="mx-auto w-full max-w-wide">
        <p className="rise font-mono text-[10px] font-bold tracking-[0.24em] text-label uppercase">
          {SITE.name} / play it
        </p>

        <h1 className="sr-only">{SITE.name}</h1>

        <LoomStrings word={SITE.name} className="mt-6" />

        <div className="mt-12 grid gap-x-16 gap-y-8 border-t border-hair pt-10 lg:grid-cols-2 lg:items-end">
          <p
            style={{ "--in": "90ms" } as React.CSSProperties}
            className="rise max-w-[17ch] text-[clamp(28px,3.4vw,50px)] leading-[1.06] font-extrabold tracking-[-0.04em] text-ink"
          >
            {claim}
            {promise ? <span className="text-active"> {promise}</span> : null}
          </p>

          <div style={{ "--in": "220ms" } as React.CSSProperties} className="rise">
            <p className="max-w-[52ch] text-[16.5px] leading-[1.6] text-body sm:text-[17.5px]">
              {SITE.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link
                href={ROUTES.build}
                className="inline-flex items-center rounded-field bg-active px-5 py-2.5 text-[15px] font-semibold text-white transition-[opacity,transform] hover:opacity-90 active:translate-y-px"
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
