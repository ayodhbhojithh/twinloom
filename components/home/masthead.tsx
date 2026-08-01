import Link from "next/link";

import { ROUTES, SITE } from "@/lib/site";

/**
 * The top of the page, in the framework's own words.
 *
 * The headline and the standfirst are `SITE.tagline` and `SITE.description`
 * verbatim, which are the prototype's home screen copy. They are not rewritten
 * here and they should not be: this is the one line the company has decided says
 * what it does, and a landing page that quietly improves on it is a landing page
 * that no longer matches the rest of the site.
 *
 * The tagline is two sentences, "what you do" and "what we do", so the second
 * takes the accent. Split on the data rather than hardcoded, so editing
 * `lib/site.ts` still changes what appears here.
 */
export function Masthead() {
  const at = SITE.tagline.indexOf(". ");
  const claim = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  return (
    <section className="hero-ground pt-2 pb-2 sm:pt-6">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10.5px] font-bold tracking-[0.2em] text-label uppercase">
        <span>One question</span>
        <span aria-hidden className="text-planned">
          /
        </span>
        <span>A written scope</span>
        <span aria-hidden className="text-planned">
          /
        </span>
        <span>Two working days</span>
      </p>

      <h1 className="mt-7 max-w-[32ch] text-[clamp(36px,5.2vw,72px)] leading-[1.04] font-extrabold tracking-[-0.04em] text-ink">
        {claim}
        {promise ? <span className="text-active"> {promise}</span> : null}
      </h1>

      <div className="mt-8 grid gap-x-14 gap-y-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <p className="max-w-[58ch] text-[17px] leading-[1.6] text-body sm:text-[18.5px]">
          {SITE.description}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={ROUTES.build}
            className="inline-flex items-center rounded-field bg-active px-7 py-[13px] text-[15.5px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Build your website
          </Link>
          <Link
            href={ROUTES.book}
            className="inline-flex items-center rounded-field border border-ink bg-field px-7 py-[13px] text-[15.5px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Book a meeting
          </Link>
        </div>
      </div>
    </section>
  );
}
