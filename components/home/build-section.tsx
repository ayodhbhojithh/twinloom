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
        {/* The cloth, drawn rather than fetched.

            A rendered file stood here for a while, and it was replaced by what
            it had replaced. What that file cost to make behave is worth keeping
            written down, because it is the argument for the canvas: its white
            point had to be lifted per channel so `multiply` had a true white to
            leave alone; the mask and the blend had to be forced onto the same
            element, because anything making a stacking context between the
            picture and the page cuts the blend group and multiply with nothing
            behind it is white; and its margins had to be cropped off the file
            itself, because cropping them in CSS took the tops off the tallest
            threads.

            None of that applies here. A canvas draws on transparency, so there
            is no ground to blend away and no white point to correct; it is
            sized by its box, so there is nothing to crop; and it fades its own
            two ends, so there is no mask and no stacking context to go wrong.

            Outside the frame, as the picture was. The negative margin is
            exactly the gutter, so the field takes the whole width without
            having to know what the width is - a field of threads meant to carry
            on past the window must not stop where a paragraph stops. */}
        <LoomWave className="-mx-(--page-gutter) w-auto" />

        {/* Centred, and the only centred thing in this section.

            What is said here is one address to the room and it can sit in the
            middle of the page; the tool below it is work, and work has a left
            edge to read down.

            The heading is a real one now rather than the screen-reader-only one
            that stood in for the canvas. A picture is not a heading however many
            letters were woven into it, and now that there are none at all there
            is nothing to argue about. */}
        <div className="reveal mt-8 flex flex-col items-center text-center [--step:1]">
          {/* No eyebrow over it, and no rule under that.

              The word TwinLoom stood here in small caps with a short rule below
              it, which is a lockup: a name, a mark and then a heading. The name
              is in the bar at the top of every page and again at the foot of it,
              and a third setting of it four inches above the second is a page
              introducing itself to somebody who has been reading it for a
              while. */}
          <h2 className="max-w-[22ch] text-[clamp(34px,4.4vw,64px)] leading-[1.02] font-extrabold tracking-[-0.045em] text-ink">
            Weave your digital presence.
          </h2>

          {/* Two commas rather than a dash. The sentence is one thing with an
              aside folded into the middle of it, and a dash there would make the
              aside the point. */}
          <p className="mt-4 max-w-[52ch] text-[clamp(16px,1.4vw,21px)] leading-[1.45] text-quiet">
            Your website, your brand and the systems behind them, woven into one
            clear digital presence.
          </p>
        </div>

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
