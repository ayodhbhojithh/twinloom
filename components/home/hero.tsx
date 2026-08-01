import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ROUTES, SITE } from "@/lib/site";

/** The three facts, each of which answers a question somebody would ask. */
const PROMISES = [
  "One question",
  "A written scope",
  "Two working days",
];

/**
 * The first screen.
 *
 * The claim is a sentence in two halves and the type carries it: what you do,
 * then in the accent, what we do. Everything else on this screen is subordinate
 * to that one line, which is why there is no image beside it and no card under
 * it. The ground does the decorating.
 *
 * The size is set with `clamp` rather than at breakpoints. A headline this large
 * has to shrink continuously or it breaks in the wrong place between two of
 * them, and there is no width at which "website is for." should be alone on a
 * line.
 */
export function Hero() {
  return (
    <section className="hero-ground pt-4 pb-14 sm:pt-8 lg:pb-20">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] font-bold tracking-[0.16em] text-quiet uppercase">
        <span
          aria-hidden
          className="pulse-dot size-[7px] shrink-0 rounded-pill bg-done"
        />
        {PROMISES.map((promise, at) => (
          <span key={promise} className="flex items-center gap-3">
            {at > 0 ? (
              <span aria-hidden className="text-planned">
                /
              </span>
            ) : null}
            {promise}
          </span>
        ))}
      </p>

      <h1 className="mt-6 max-w-[15ch] text-[clamp(38px,6.4vw,74px)] leading-[0.98] font-extrabold tracking-[-0.042em] text-ink">
        <span className="block">Tell us who your website is for.</span>
        <span className="block text-active">We write the rest down.</span>
      </h1>

      <p className="mt-7 max-w-measure text-[18px] leading-[1.55] text-body sm:text-[20px]">
        {SITE.description}
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Link
          href={ROUTES.build}
          className="group inline-flex items-center gap-2 rounded-field bg-active px-6 py-[13px] text-[15.5px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Build your website
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>

        <Link
          href={ROUTES.book}
          className="inline-flex items-center rounded-field border border-ink bg-field px-6 py-[13px] text-[15.5px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Book a meeting
        </Link>
      </div>

      <p className="mt-5 text-[14px] text-quiet">
        Nothing to install, nothing to sign, and no card. Start below and see
        what you get.
      </p>
    </section>
  );
}
