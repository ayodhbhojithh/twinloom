"use client";

import dynamic from "next/dynamic";

import { NearView } from "./near-view";

import { LoomStrings } from "./loom-strings";

/* The tool, fetched when somebody is on their way to it.

   It is the same component the build page renders, and there it is the page - so
   it is imported plainly there and loads with everything else. Here it is the
   last thing on a landing page, four screenfuls down, and it brings its own
   uploader with it: a hundred and fifty kilobytes plus another sixty, parsed on
   arrival by every visitor to be used by the ones who scroll to the end.

   `ssr: false` because it is a tool with measured surfaces and a docked panel.
   What a server can say about it is an empty box, and hydrating that is work
   done twice. */
const BuildFlow = dynamic(
  () => import("@/components/build/v5/flow").then((m) => m.BuildFlow),
  { ssr: false },
);

/* The two wave drawings and the switch between them are gone.

   `LoomWave` drew the site's name as a field - sixty curves in one version, a
   few hundred bars in the other - and it was a picture of the idea rather than
   the idea: a wave that happens to be here, with no way in and nothing to do.
   What stands here now is the loom itself, which is the same name made of
   strings you can play. The wave is gone from the tree entirely - a thousand
   lines nothing imported, and `three` in the dependency list to draw it - and
   it is in git if the idea is ever wanted back.
--------------------------------------------------------------------------- */

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
        {/* The name, woven and playable.

            It was a wave - the same word drawn as a field of curves, arriving
            on the scroll and then drifting on its own. A picture of a loom
            rather than one: nothing to do, nowhere to press, and a switch above
            it offering a second version of the same picture.

            This is the claim itself, strung. It was the name for a moment -
            which put the site's own name on the page a third time, four inches
            under the heading that said the same thing in words. Weaving the
            claim instead means the sentence and the picture are one object:
            moving across it plucks the strings the words are made of and each
            sounds its own note, so the line at the head of the section that asks
            people to describe a website is a line they have to touch to find out
            about. The arrow keys do it too,
            and the label says so, because a picture that only answers a pointer
            is a picture half the readers cannot reach.

            Nothing plays until somebody moves across it. An `AudioContext` that
            starts on its own is the reason browsers stopped letting them - see
            `loom-strings`, which builds one on the first real gesture and closes
            it on the way out.

            The reveal is on the wrapper rather than the instrument: `.reveal`
            carries `will-change: transform`, and putting that on the box a
            canvas measures itself in is asking for the measurement and the
            animation to disagree. */}
        {/* Off on a phone, and the words are set as words instead.

            The weave sizes the sentence to the width it is given, so at three
            hundred points eight words came out as a line of hairlines about a
            centimetre tall - illegible as type and too fine to be a picture,
            with strings a finger cannot separate. There is no version of this
            that works at that width: it is a wide object, and a phone is not
            wide.

            What it was for is still delivered on a phone - the claim, said once,
            at a size somebody can read. The instrument belongs to the screens
            that have room for it. */}
        <div className="reveal [--step:0] max-sm:hidden">
          <LoomStrings
            word="Weave your digital presence."
            className="-mx-(--page-gutter)"
          />
        </div>

        {/* Centred, and the only centred thing in this section.

            What is said here is one address to the room and it can sit in the
            middle of the page; the tool below it is work, and work has a left
            edge to read down.

            The heading is a real one now rather than the screen-reader-only one
            that stood in for the canvas. A picture is not a heading however many
            letters were woven into it, and now that there are none at all there
            is nothing to argue about. */}
        {/* The heading: read out everywhere, seen where the weave is not.

            From `sm` up the weave above says these eight words as a picture, so
            setting them again as type is the claim printed twice. There it is
            `sr-only` - read out, counted in the document outline, and not drawn
            a second time.

            Below `sm` the weave is gone, so this is the claim. `not-sr-only`
            puts it back into the page and the sizes beside it make it the
            heading it always was in the markup. */}
        <h2 className="sr-only max-sm:not-sr-only max-sm:block max-sm:text-center max-sm:text-[min(27px,7vw)] max-sm:leading-[1.06] max-sm:font-extrabold max-sm:tracking-[-0.042em] max-sm:text-ink">
          Weave your digital presence.
        </h2>

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
          {/* About a screenful. The tool opens on its own first step, which is
              a cut surface with a floor of its own - see `Stage` - so the space
              held here is close to what arrives in it. */}
          <NearView min={620}>
            <BuildFlow />
          </NearView>
        </div>
      </div>
    </section>
  );
}
