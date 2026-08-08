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
      <section
        style={{
          ["--page-gutter" as string]: "clamp(16px, 2.2vw, 40px)",
          /* Under the sides and the foot, but not by much.

             It was taken down to eleven, which is the floor the header's own
             fade sets - eight pixels of white running out below the bar, and any
             tighter and the fade lies over the top edge of the card instead of
             over the ground. Eleven cleared the fade and nothing else: the card
             read as hung off the header rather than as standing in the window.

             Around two thirds of the sides is where it sits. The top is the one
             edge with something above it rather than the window, so it wants
             less than the other three - but it wants some. */
          paddingTop: "clamp(14px, 1.5vw, 28px)",
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
        {/* No heading here. The card carries the `h1` now - it says the same
            claim, on the screen, where the words and the two ways in sit inside
            the surface rather than in a band above it. Two would be two. */}
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
