import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProjectStrip } from "@/components/home/project-strip";
import { PROJECTS } from "@/components/home/projects";
import { ROUTES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home v6",
  description: SITE.description,
};

/**
 * Home v6.
 *
 * Everything on one axis down the middle: badge, claim, standfirst, two actions,
 * then the kinds of work drifting past, then the work itself as a wall running
 * off both edges of the page.
 *
 * The two drifting rows are what stop a centred page from being a poster. A
 * column of centred text has no second reading direction, so the eye finishes it
 * and stops; something crossing underneath gives it somewhere else to go.
 *
 * The reference this follows carries a row of client logos. There is none here,
 * because there are no clients to name yet and putting invented ones on a
 * company's own site is a lie about credentials rather than a placeholder. The
 * row carries the kinds of work instead, which is true today.
 */
export default function HomeV6Page() {
  const at = SITE.tagline.indexOf(". ");
  const claim = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  const kinds = PROJECTS.map((project) => project.kind);

  return (
    <section className="flex min-h-[var(--stage)] flex-col justify-center overflow-clip py-10">
      <div className="page-frame mx-auto max-w-wide text-center">
        <p className="rise mx-auto inline-flex items-center gap-2.5 rounded-pill bg-well py-2 pr-4 pl-3 text-[13.5px] font-semibold text-body">
          <span aria-hidden className="size-2 rounded-pill bg-ink" />
          A written scope, in your own words
        </p>

        <h1
          style={{ "--in": "90ms" } as React.CSSProperties}
          className="rise mx-auto mt-7 max-w-[26ch] text-[clamp(34px,5vw,76px)] leading-[1.04] font-extrabold tracking-[-0.045em] text-balance text-ink"
        >
          {claim}
          {promise ? <span className="text-active"> {promise}</span> : null}
        </h1>

        <p
          style={{ "--in": "200ms" } as React.CSSProperties}
          className="rise mx-auto mt-6 max-w-[66ch] text-[17px] leading-[1.65] text-quiet sm:text-[18.5px]"
        >
          {SITE.description}
        </p>

        <div
          style={{ "--in": "300ms" } as React.CSSProperties}
          className="rise mt-9 flex flex-wrap items-center justify-center gap-2.5"
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

      {/* The kinds of work, drifting. Full bleed, so items leave the page rather
          than stopping at a margin, which is what lets the row have no edges
          without needing anything faded over them. */}
      <div aria-hidden className="mt-14 overflow-hidden">
        <div className="drift flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {kinds.map((kind, index) => (
                <span
                  key={`${copy}-${kind}-${index}`}
                  className="flex items-center gap-10 px-10 text-[19px] font-semibold whitespace-nowrap text-planned sm:text-[22px]"
                >
                  {kind}
                  <span className="text-hair">&middot;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <ProjectStrip className="mt-12" />
    </section>
  );
}
