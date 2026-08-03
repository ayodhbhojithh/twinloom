import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { NotchedCard } from "@/components/home/notched-card";
import { ROUTES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home v7",
  description: SITE.description,
};

/**
 * Home v7.
 *
 * One card holding almost the whole screen, with the controls and the next
 * project standing in cuts taken out of it rather than laid on top. The words
 * sit in a band above it, kept deliberately short: the card is the page, and a
 * headline competing with it would leave two things half read.
 *
 * The cuts curve outward where they meet the card's edge. That is the only part
 * of this that is difficult, and it is the only part that makes the card read as
 * a surface rather than as three rectangles overlapping.
 */
export default function HomeV7Page() {
  const at = SITE.tagline.indexOf(". ");
  const claim = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  return (
    <section className="flex h-[var(--stage)] flex-col overflow-clip py-8">
      <div className="page-frame mx-auto flex w-full max-w-wide shrink-0 flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div className="min-w-0">
          <p className="rise inline-flex items-center gap-2.5 rounded-pill bg-well py-1.5 pr-4 pl-3 text-[13px] font-semibold text-body">
            <span aria-hidden className="size-2 rounded-pill bg-ink" />
            Recent work
          </p>

          <h1
            style={{ "--in": "90ms" } as React.CSSProperties}
            className="rise mt-5 max-w-[24ch] text-[clamp(28px,3.2vw,46px)] leading-[1.06] font-extrabold tracking-[-0.04em] text-ink"
          >
            {claim}
            {promise ? <span className="text-active"> {promise}</span> : null}
          </h1>
        </div>

        <div
          style={{ "--in": "220ms" } as React.CSSProperties}
          className="rise flex flex-wrap items-center gap-2.5"
        >
          <Link
            href={ROUTES.book}
            className="group inline-flex items-center gap-2 rounded-pill bg-well px-5 py-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-hair"
          >
            Book a meeting
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <Link
            href={ROUTES.build}
            className="group inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Build your website
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>

      <div className="page-frame mx-auto mt-7 w-full max-w-wide min-h-0 flex-1">
        <NotchedCard className="h-full w-full" />
      </div>
    </section>
  );
}
