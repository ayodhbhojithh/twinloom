import type { Metadata } from "next";
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

      {/* The same air on all four sides, and less of it than the page's own.

          Two things were wrong. The sides came from `--page-gutter`, which steps
          20 / 32 / 48 / 64 / 80 with the window, while the top and bottom were a
          flat 32 - so on a laptop the frame round the one thing on this page was
          eighty at the sides and thirty-two at the ends, which is not a frame.
          And matched at eighty it was simply too much: the card is the page, and
          a page whose subject is held a hundred and sixty pixels short of its
          own height is a page with a margin where its content should be.

          So the gutter is overridden here rather than read. Every `.page-frame`
          inside this section picks the new value up, and the vertical padding
          reads the same variable, so one declaration sets all four sides and
          they cannot come apart again.

          `clamp` rather than the stepped scale, because this is one card sized
          to the window rather than a column of text that needs to settle at
          particular widths - and a step in the frame of something that is
          already fluid reads as a jump.

          The top is the one side that is not the gutter, and it is not an
          exception to the rule so much as the rule applied honestly. What sits
          above the card is not the edge of the window: it is the header, which
          carries its own padding and ends in white. Measured from the window the
          four sides were equal; measured from what a reader can actually see,
          the top was the gutter plus the whole of the header's own air. Roughly
          half of it puts the visible gap back in line with the other three.

          Written as styles rather than classes because both are `clamp`, and a
          `clamp` inside an arbitrary Tailwind value is the exact shape that has
          silently failed to reach the stylesheet on this project before. */}
      <section
        style={{
          ["--page-gutter" as string]: "clamp(16px, 2.2vw, 40px)",
          paddingTop: "clamp(8px, 1vw, 18px)",
          /* A shade under the sides rather than exactly them.

             On paper this was already the gutter and so already equal to the
             left and right. On the screen it was not reading that way, and the
             reason is that a gap between an object and the bottom of the window
             is bounded on one side only: the sides are read against the page
             either side of the card, and this is read against nothing. The eye
             adds the rest, so four equal numbers do not give four equal gaps. A
             fifth under the sides is where it settles. */
          paddingBottom: "clamp(12px, 1.8vw, 32px)",
        }}
        className="flex h-[var(--stage)] flex-col overflow-clip"
      >
        {/* The heading, kept for the document and taken off the screen.

            The services line and the two ways in were a band above the card and
            they are gone from it: the card is the page, and a headline and a
            pair of buttons competing with it left two things half read. Both
            ways in are already on this page - in the header, at the foot of the
            card, and in the footer - so nothing has been lost but the third and
            fourth copy of them.

            The heading itself is not gone, only unseen. A page with no `h1` has
            no name in its own outline, and this is the one page whose title has
            to say what the company does. It is the same string the metadata is
            built from. */}
        <h1 className="sr-only">{SERVICES}</h1>

        <div className="page-frame min-h-0 w-full flex-1">
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
