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
          /* Kept at or above the header's own fade, which is eight pixels of
             white running out below the bar. Any tighter and the fade would be
             lying over the top edge of the picture instead of over the ground,
             which is the one thing it must not do. */
          paddingTop: "clamp(8px, 0.55vw, 11px)",
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
