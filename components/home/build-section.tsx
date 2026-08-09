import { BuildFlow } from "@/components/build/v5/flow";

import { LoomWave } from "./loom-wave";

/**
 * The build screen, on the landing page.
 *
 * The same component the build page renders, so it is that screen rather than a
 * second version of it: every tab, every band, the panel down the right, the
 * framework note, all of it. Two implementations of one screen say different
 * things by the second edit, and this one has to stay in step because both write
 * to the same answers.
 *
 * Only the heading is written here. The build page's is the document's `h1` and
 * this page already has one, so the same words are set as an `h2` instead.
 */
export function BuildSection() {
  /* The landing hero's down arrow points at this section's id, so it carries a
     scroll margin: without one the anchor lands the heading underneath the
     sticky header rather than under it. */
  return (
    <section
      id="build"
      className="page-frame scroll-mt-[var(--nav-height)] py-14 sm:py-20 lg:py-24"
    >
      {/* The head is centred and the tool under it is not. What is being said
          here is one address to the room, and it can sit in the middle of the
          page; what follows is work, and work has a left edge to read down. */}
      {/* No cap of its own. Every other section on this page takes the frame's
          full width, and one that stops short of it at 1600 reads as a narrower
          page inserted into a wider one - the gutters stop lining up and the
          tool below looks inset rather than placed. */}
      <div className="w-full">
        {/* The cloth, on its own.

            It used to weave the words "Build your website" out of the same
            threads and let you play them, a note per strand. The word is gone
            and the instrument with it: what stands here now is the warp under a
            slow swell, which is a picture of what a loom does rather than a
            sentence made out of one.

            The heading stays, for a screen reader and for the document's
            outline. A canvas is a picture, and a picture is not a heading -
            which is truer now than it was, because there are no letters in this
            one at all. */}
        <h2 className="sr-only">Build your website</h2>

        <LoomWave className="reveal w-full" />

        {/* The run-through itself, not a shorter version of it. It reads the
            same answers as the build page, so somebody who starts here and
            follows a link through arrives at the step they were on with
            everything they have already said still in it.

            No reveal on it, and not by omission. It is the one thing on this
            page that is a tool rather than a picture of one: it has a docked
            panel and surfaces that measure themselves, and a `transform` on
            anything above them is a new containing block under all of it. The
            words that introduce it arrive on the scroll; the tool is simply
            there, which is what a tool should be. */}
        <div className="mt-12">
          <BuildFlow />
        </div>
      </div>
    </section>
  );
}
