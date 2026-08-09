import Image from "next/image";

import { BuildFlow } from "@/components/build/v5/flow";

/**
 * How the picture leaves the page at its two ends.
 *
 * The file is a rectangle and the field inside it is meant to carry on past the
 * window, so the last stretch at each side is given away. Curved rather than
 * straight: a linear fade reads as a band with an edge at each end, which is the
 * one thing a blend must not have.
 */
const WAVE_EDGE =
  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 3%, black 11%, black 89%, rgba(0,0,0,0.35) 97%, transparent 100%)";

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
        {/* The cloth, as a picture.

            It has been three things: a word woven out of threads and playable, a
            note per strand; then the same threads drawn as a wave; then that
            wave wound into a twist. All three were canvas - a few hundred
            strokes a frame, a table of harmonics, and a scale worked out so
            nothing clipped.

            This is a file. Everything that drawing was for is in it already, and
            it costs one request and no frames at all.

            Multiplied rather than laid on. The file has no transparency, so
            without a blend it is a rectangle of its own ground sitting on the
            page - and `multiply` leaves any white pixel showing whatever is
            behind it while touching none of the coloured ones.

            Which only works if the ground is actually white, and it was not: the
            file came out at 247 grey, and 247 multiplied into a page at 242 is
            234 - a box you can see, darker than the page it is meant to
            disappear into. The file's white point has been lifted per channel so
            its corners are 255, which is the fix. Doing it in CSS is not
            possible: `filter: brightness` would lift the threads with it.

            The mask and the blend are on the same element, and that is the
            whole reason this works. Anything that makes a stacking context
            between the picture and the page cuts the blend group, and multiply
            with nothing behind it is white - which is the white rectangle this
            went through twice. First `reveal`, which carries
            `will-change: opacity, transform`; then the wrapper, because
            `mask-image` makes one as well. Masking the image itself does not:
            an element's own stacking context contains its descendants, not its
            own blending.

            The mask is there because even at a true white the corners carry
            enough noise to draw a rectangle in the right light, and the field is
            meant to carry on past the window. */}
        {/* Full width, whole, and no taller than it needs to be.

            Those three could not all be had while the file carried its own
            margins: at nineteen by eight, a picture the width of a window is
            eight hundred pixels tall, and two hundred of those were the white
            the threads stand in. Cropping in CSS took the tops off the tallest
            threads and capping the width made it small.

            So the margins came off the file instead. This one is nineteen by
            four and a half rather than nineteen by eight, which is not far off
            half the height at the same width with nothing cut out of the picture
            at all - the blank was never part of it.

            Its white point was lifted the same way, per channel, so `multiply`
            has a true white to leave alone. Straight from the generator its
            ground was 246 grey, and 246 multiplied into a page at 242 is a box
            you can see. */}
        <div aria-hidden className="-mx-(--page-gutter) w-auto">
          <Image
            src="/assets/wave3.png"
            alt=""
            width={1916}
            height={422}
            draggable={false}
            /* Undiminished. The picture is a field of hairline strokes a pixel
               or two wide, which is exactly what a lossy encoder spends its
               budget smoothing away - at the default 75 the threads pick up a
               haze that reads as the image being slightly out of focus. */
            quality={100}
            sizes="100vw"
            className="wave-breathe block h-auto w-full mix-blend-multiply"
            style={{ maskImage: WAVE_EDGE, WebkitMaskImage: WAVE_EDGE }}
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
