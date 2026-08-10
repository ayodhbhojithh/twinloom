import type { Metadata } from "next";
import { BuildSection } from "@/components/home/build-section";
import { NotchedCard } from "@/components/home/notched-card";
import { PartnersSection } from "@/components/home/partners-section";
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
 * written follows that, then who does the work. Describing what this company
 * does takes a paragraph nobody reads, so the second section asks the first
 * question instead, and whatever is answered there is already answered on the
 * build page.
 */
export default function LandingPage() {
  return (
    <>
      <section
        style={{
          ["--page-gutter" as string]: "var(--sill-side)",
          /* Under the sides and the foot, but not by much.

             It was taken down to eleven, which is the floor the header's own
             fade sets - eight pixels of white running out below the bar, and any
             tighter and the fade lies over the top edge of the card instead of
             over the ground. Eleven cleared the fade and nothing else: the card
             read as hung off the header rather than as standing in the window.

             Around two thirds of the sides is where it sits. The top is the one
             edge with something above it rather than the window, so it wants
             less than the other three - but it wants some. */
          paddingTop: "var(--sill-top)",
          /* A shade under the sides rather than exactly them.

             On paper this was already the gutter and so already equal to the
             left and right. On the screen it was not reading that way, and the
             reason is that a gap between an object and the bottom of the window
             is bounded on one side only: the sides are read against the page
             either side of the card, and this is read against nothing. The eye
             adds the rest, so four equal numbers do not give four equal gaps. A
             fifth under the sides is where it settles. */
          paddingBottom: "var(--sill-bottom)",
        }}
        /* The whole window, not the window less the header - the header is
           inside the card on this page, so there is nothing above it to take
           off. */
        /* Exactly a screenful on a desk, at least a screenful on a phone.

           `h-svh` is a ceiling as well as a floor. On a desk that is right and
           it is what this has always been: the contents fit, and a front door
           that is precisely the window is the whole idea of the screen. On a
           short phone they do not fit - the mark, four trades, a claim over two
           lines, a lead, a paragraph and three doors - and held to one screen
           the last of those was cut off by the card's own edge.

           So the ceiling comes off below `sm` and nowhere else. Everything from
           `sm` up is the height it was, to the pixel. */
        className="flex flex-col overflow-clip max-sm:min-h-svh sm:h-svh"
      >
        {/* No heading here. The card carries the `h1` now - it says the same
            claim, on the screen, where the words and the two ways in sit inside
            the surface rather than in a band above it. Two would be two. */}
        {/* `min-h-0` lets a flex child shrink below its own contents, which is
            what a card holding a full screen needs and exactly what clips one
            holding more. Off below `sm`, where the card is as tall as what is in
            it.

            The floor is on the card itself, and it has to be. `flex-1` divides
            the *free* space of its container, and a container with `min-height`
            rather than `height` has none to divide - and putting the minimum on
            this box did not help either, because `h-full` on the card is
            `height: 100%` measured against a parent whose height is auto, which
            resolves to auto. Either way the card came out at its content size
            and stopped short of the screen with grey below it.

            Given to the card as its own minimum, there is nothing to resolve
            against: the screen less the two sills is exactly the height it had
            when the section was `h-svh`, and being a minimum is what lets it
            grow past that when the contents need it to. */}
        <div className="page-frame w-full flex-1 max-sm:min-h-fit sm:min-h-0">
          <NotchedCard className="h-full w-full max-sm:h-auto max-sm:min-h-[calc(100svh-var(--sill-top)-var(--sill-bottom))]" />
        </div>
      </section>

      <BuildSection />

      {/* What we have written stood here, answering somebody who had read the
          card and tried the tool and wanted to know how we think rather than
          start. It is off the home page now, not deleted: `ReadingSection` and
          the page it points to are both still live, reachable from the header
          as `Insight` for whoever came looking for it rather than met it here. */}

      {/* The sandbox stood here and is off the page for now.

          Not deleted: `components/home/sandbox-section` and everything it opens
          are untouched, and putting it back is this line uncommented. What it
          showed was two things we have built, running live in the page - which
          is the strongest thing on the page when there are enough of them and
          the thinnest when there are two. It comes back when there is a shelf
          rather than a pair. */}
      {/* <SandboxSection /> */}

      {/* Who actually does the work. The question that follows the rest. */}
      <PartnersSection />
    </>
  );
}
