import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { NotchedCard } from "@/components/home/notched-card";
import { ROUTES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  /* `absolute` because the layout appends the company name to every title, and
     this one is the company name. */
  title: { absolute: SITE.name },
  description: SITE.description,
};

/**
 * The landing page.
 *
 * One card holding almost the whole screen, with the controls and the next
 * project standing in cuts taken out of it rather than laid on top. The words
 * sit in a band above it, kept deliberately short: the card is the page, and a
 * headline competing with it would leave two things half read.
 *
 * The cuts curve outward where they meet the card's edge. That is the only part
 * of this that is difficult, and it is the only part that makes the card read as
 * a surface rather than as three rectangles overlapping.
 *
 * This is the one screen without the rail. It is a front door rather than a page
 * of the site, and a list of forty other pages beside a front door is a corridor
 * with a doormat in it. The rail arrives the moment somebody goes through.
 *
 * It is also the one screen with no measure on it. Every other page caps its
 * content so a line of prose stays readable; there is no prose here, so the card
 * takes the window and leaves only the page gutter at each side.
 */
export default function LandingPage() {
  const at = SITE.tagline.indexOf(". ");
  const claim = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  return (
    <section className="flex h-[var(--stage)] flex-col overflow-clip py-8">
      <div className="page-frame flex w-full shrink-0 flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div className="min-w-0">
          <h1 className="rise max-w-[30ch] text-[clamp(28px,3.4vw,52px)] leading-[1.06] font-extrabold tracking-[-0.04em] text-ink">
            {claim}
            {promise ? <span className="accent-text"> {promise}</span> : null}
          </h1>
        </div>

        <div
          style={{ "--in": "120ms" } as React.CSSProperties}
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

      <div className="page-frame mt-7 min-h-0 w-full flex-1">
        <NotchedCard className="h-full w-full" />
      </div>
    </section>
  );
}
