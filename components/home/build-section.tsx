import { BuildFlow } from "@/components/build/v5/flow";

import { LoomStrings } from "./loom-strings";

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
      className="page-frame scroll-mt-[var(--nav-height)] py-20 lg:py-24"
    >
      {/* The head is centred and the tool under it is not. What is being said
          here is one address to the room, and it can sit in the middle of the
          page; what follows is work, and work has a left edge to read down. */}
      {/* `mx-auto`, or the section sits against the left gutter on any screen
          wider than the container and the whole thing reads as off-centre no
          matter how the type inside it is aligned. */}
      <div className="mx-auto max-w-wide">
        {/* The topic, woven rather than set.
            The same loom the "play it" screen hangs the name in: each thread
            samples the column of pixels it stands in and keeps the stretches
            where it found ink, so the words are made of the cloth rather than
            printed on it, and the whole thing answers to a pointer.

            The real heading goes in beside it, for a screen reader and for the
            document's outline. A canvas is a picture, and a picture is not a
            heading however large the letters in it are. */}
        <h2 className="sr-only">Build your website</h2>

        <LoomStrings word="Build your website" className="mx-auto max-w-wide" />

        <p className="mx-auto mt-8 mb-12 max-w-[1400px] text-center text-[17.5px] leading-[1.6] text-ink sm:text-[19px]">
          Two ways through, and you can move between them without losing
          anything. Two minutes gets you a shape. Everything after that is yours
          to give or to leave.
        </p>

        {/* The run-through itself, not a shorter version of it. It reads the
            same answers as the build page, so somebody who starts here and
            follows a link through arrives at the step they were on with
            everything they have already said still in it. */}
        <BuildFlow />
      </div>
    </section>
  );
}
