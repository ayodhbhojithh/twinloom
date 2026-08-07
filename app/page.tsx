import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BuildSection } from "@/components/home/build-section";
import { NotchedCard } from "@/components/home/notched-card";
import { PartnersSection } from "@/components/home/partners-section";
import { ReadingSection } from "@/components/home/reading-section";
import { SandboxSection } from "@/components/home/sandbox-section";
import { pageMeta } from "@/lib/seo";
import { ROUTES, SITE } from "@/lib/site";

/** The services line, whole, for the places that take one string. */
const SERVICES = `${SITE.services.ink} ${SITE.services.quiet}`;

export const metadata: Metadata = {
  ...pageMeta({
    /* The landing page is the one that has to say what the company does in the
       title itself. `TwinLoom` alone is a result nobody clicks who does not
       already know the name, and the people who know the name are not the ones
       this page is for. */
    title: `${SITE.name} - ${SERVICES}`,
    description: SITE.description,
    path: ROUTES.home,
  }),
  /* `absolute` because the layout appends the company name to every title, and
     this one already carries it. */
  title: { absolute: `${SITE.name} - ${SERVICES}` },
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
 *
 * The card holds exactly one screenful, the tool follows it, what we have
 * written follows that, then what we have built, then who does the work. Describing what
 * this company does takes a paragraph nobody reads, so the second screen asks
 * the first question instead, and whatever is answered there is already answered
 * on the build page.
 */
export default function LandingPage() {
  return (
    <>
      {/* The film on the card, asked for before the card exists.

          `preload="auto"` on the element only starts once the browser has
          parsed its way down to it, and by then it is queued behind the fonts,
          the stylesheet and the bundle. This is in the head - React hoists it -
          so the fetch is opened while the rest of the document is still being
          read, which is most of the delay before it plays.

          Here rather than in the layout: it is 2.7MB and it is on this page
          only. Preloading it from the layout would spend that on every route on
          the site to save it on one. */}
      <link
        rel="preload"
        as="video"
        type="video/mp4"
        href="/videos/1.mp4"
        fetchPriority="high"
      />

      <section className="flex h-[var(--stage)] flex-col overflow-clip py-8">
        <div className="page-frame flex w-full shrink-0 flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="min-w-0">
            {/* One run of words, broken by the measure rather than by the
                sentences, and not evened up.

                `text-wrap: balance` is off here: it makes both lines the same
                length, which turns a headline into a block. Filling the first
                line and letting the second run short gives the shape a top edge
                and a diagonal, which is the thing that reads as a headline
                rather than as a paragraph.

                Thirty-four characters, which is where this line falls in two.
                Twenty-five was set for a shorter headline and takes this one to
                three, and the third line comes off the card below it. */}
            <h1 className="rise section-head max-w-[34ch] text-ink [text-wrap:pretty]">
              {SITE.services.ink}
              {/* The second half a grade quieter, which is the same split the
                  footer makes: the thing we are known for in ink, everything
                  else behind it. Tone says what a gradient would have said, and
                  says it in the one palette the page has. */}
              <span className="text-quiet"> {SITE.services.quiet}</span>
            </h1>
          </div>

          {/* Two of the same shape on a phone, side by side rather than one
              under the other.

              Stacked and each as wide as its own words, they were two different
              lengths on two lines, left aligned against a headline three lines
              deep - which reads as a list somebody has not finished laying out.
              A row of two equal halves is one object with a middle, and it costs
              the fold a line of height rather than two.

              From `sm` they go back to their own widths, because there the row
              sits beside the headline instead of under it and equal halves of
              nothing would only stretch them. */}
          <div
            style={{ "--in": "120ms" } as React.CSSProperties}
            className="rise grid w-full grid-cols-2 gap-2.5 sm:flex sm:w-auto sm:flex-wrap sm:items-center"
          >
            <Link
              href={ROUTES.book}
              className="group inline-flex items-center justify-center gap-2 rounded-pill bg-well px-4 py-2.5 text-[14px] font-semibold whitespace-nowrap text-ink transition-colors hover:bg-hair sm:justify-start sm:px-5 sm:text-[14.5px]"
            >
              Book a meeting
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href={ROUTES.build}
              className="group inline-flex items-center justify-center gap-2 rounded-pill bg-ink px-4 py-2.5 text-[14px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-85 sm:justify-start sm:px-5 sm:text-[14.5px]"
            >
              Build your website
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        <div className="page-frame mt-7 min-h-0 w-full flex-1">
          <NotchedCard className="h-full w-full" />
        </div>
      </section>

      <BuildSection />

      {/* Third: what we have written. Somebody who has read the card and tried
          the tool either wants to start or wants to know how we think, and this
          is the answer to the second. */}
      <ReadingSection />

      {/* Fourth: the sandbox. Everything above it is a claim about what we can
          build; this is the part where two of the claims run in front of you. */}
      <SandboxSection />

      {/* Fifth: who actually does the work. The question that follows all four
          of the sections above it. */}
      <PartnersSection />
    </>
  );
}
