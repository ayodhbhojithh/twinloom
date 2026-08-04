import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProjectCarousel } from "@/components/home/project-carousel";
import { ROUTES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home v5",
  description: SITE.description,
};

/**
 * Home v5.
 *
 * The claim on the left, the work on the right, in the arrangement the reference
 * uses: a badge, a headline at full size, the standfirst, and the actions at the
 * foot of the column, with a deck of cards holding the middle of the frame.
 *
 * Clicking a card opens it into a panel just inside the edge of the screen, and
 * the card itself is what grows into the panel. That is the whole reason to have
 * a carousel rather than a grid: a grid shows you six things at once, and this
 * hands you one.
 *
 * The pictures are grey until there are pictures, and the projects are named for
 * the work rather than for a client. Inventing client names to fill a carousel
 * would put false credentials on a company's own site.
 */
export default function HomeV5Page() {
  const at = SITE.tagline.indexOf(". ");
  const claim = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  return (
    <section className="page-frame flex min-h-[var(--stage)] flex-col justify-center py-10">
      <div className="mx-auto grid w-full max-w-wide items-center gap-x-10 gap-y-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] xl:gap-x-14">
        <div className="min-w-0">
          <p className="rise inline-flex items-center gap-2.5 rounded-pill bg-well py-2 pr-4 pl-3 text-[14px] font-semibold text-body">
            <span aria-hidden className="size-2 rounded-pill bg-ink" />
            A written scope, in your own words
          </p>

          <h1
            style={{ "--in": "90ms" } as React.CSSProperties}
            className="rise mt-7 max-w-[24ch] text-[clamp(36px,5.2vw,78px)] leading-[1.03] font-extrabold tracking-[-0.045em] text-ink"
          >
            {claim}
            {promise ? <span className="block text-mark">{promise}</span> : null}
          </h1>

          <p
            style={{ "--in": "200ms" } as React.CSSProperties}
            className="rise mt-7 max-w-[68ch] text-[17px] leading-[1.65] text-quiet sm:text-[18.5px]"
          >
            {SITE.description}
          </p>

          <div
            style={{ "--in": "300ms" } as React.CSSProperties}
            className="rise mt-12 flex flex-wrap items-center gap-2.5"
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

        <div className="min-w-0">
          <p
            style={{ "--in": "160ms" } as React.CSSProperties}
            className="rise mb-6 font-mono text-[10px] font-bold tracking-[0.2em] text-label uppercase"
          >
            Recent work / open one
          </p>

          <ProjectCarousel />
        </div>
      </div>
    </section>
  );
}
