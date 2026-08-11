import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Info,
  PencilLine,
} from "lucide-react";

import { SisterSentence } from "@/components/blocks";
import { INCLUDED, OFFER, SERVICES } from "@/lib/services";
import { ROUTES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   The company, opened.

   What the landing card's first screen turns into when somebody presses it.
   Every other screen on that card opens a piece of work; this one is not a
   piece of work, so it opens as what it actually is - what we do on the left,
   and what every build gets on the right.

   Both halves are read from `lib/services`, which is the same list the services
   page and the about page set. Retyping six disciplines and eleven promises
   into a panel would be a third copy of each, and the day one of them changes
   this is the copy nobody remembers to edit.
--------------------------------------------------------------------------- */

/**
 * The six, in the order the reference sets them.
 *
 * What we build first, then what sits behind it, then the ones that run
 * alongside. There is no filter here any more: "One partner, the whole build"
 * used to be dropped by name, because it was the sum of the others rather than
 * one of them and it says the same thing as the line at the foot. It is off the
 * list itself now, so there is nothing to drop.
 *
 * Each card is the discipline's own drawing rather than its Lucide icon. The
 * icon is the fallback the services page keeps for a discipline whose picture
 * has not been made yet, and all six of these have one.
 */
const CARDS = [...OFFER, ...SERVICES].map((entry) => ({
  art: entry.art,
  name: entry.n,
  say: entry.sub,
}));

export function OverviewOpen() {
  return (
    <>
      {/* What we do. On the canvas, so the eleven beside it read as the
          white surface and this reads as the room they stand in.

          Two elements rather than one, and the inner one is what centres.
          `justify-center` on the box that scrolls clips the top of anything
          taller than it - the overflow goes both ways and only one of them can
          be reached. An inner box held to at least the full height centres what
          fits and grows past it when it does not, which scrolls from the top
          like anything else. */}
      <div className="quiet-scroll min-h-0 bg-canvas lg:overflow-y-auto">
        {/* Down the middle, all of it. The cards and the line at the foot were
            centred already and the three things above them were not, so the
            column had two left edges - one for the type and one for the grid
            under it. `items-center` puts the capped blocks on the same axis
            the grid is already on. */}
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-5 text-center max-sm:px-4 max-sm:py-4 sm:px-9 sm:py-6 lg:px-11 lg:py-7">
          <div className="flex items-center gap-3.5 max-sm:gap-2.5">
            <Image
              src="/assets/logo.png"
              alt=""
              width={192}
              height={192}
              aria-hidden
              draggable={false}
              sizes="192px"
              className="size-16 flex-none object-contain max-sm:size-11"
            />
            <span className="text-[clamp(22px,2.2vw,32px)] leading-none font-extrabold tracking-[-0.03em] text-ink">
              TwinLoom
            </span>
          </div>

          <h2 className="mt-5 max-w-[16ch] text-[clamp(22px,2.4vw,34px)] leading-[1.08] font-extrabold tracking-[-0.038em] text-ink max-sm:mt-3.5 max-sm:text-[20px]">
            Connecting ideas. Building presence.
          </h2>

          <p className="mt-3 max-w-[46ch] text-[13px] leading-[1.6] text-quiet max-sm:mt-2 max-sm:text-[12px] max-sm:leading-[1.5]">
            Websites that perform. Software that powers. Digital services that
            move you forward.
          </p>

          {/* Three across, two down, and each card centred on its own drawing.

            The sentence is clamped rather than rewritten: these are the same
            six sentences the services page sets, and a card that needs its own
            shorter copy is a seventh place for the offer to be worded
            differently. Three lines is what the tallest of them takes. */}
          {/* `w-full` because the column centres its children now, and a grid
              left to size itself would shrink to its contents. */}
          {/* Two across on a screen, one down on a phone - and on a phone each
              card turns on its side.

              As a tile the drawing is the width of the card and the sentence is
              set under it, which at half a phone's width is a measure of about
              eighteen characters: "From a handful of pages through to online
              shops, booking systems, and sites that connect to the software you
              already run." came out as nine ragged lines under a picture three
              times its width. The picture was not the problem - the column
              was.

              Turned, the drawing is a mark at the left and the words take the
              rest of the row, which is a measure they can actually be read at,
              and six rows down one column is a list somebody can run an eye
              down instead of a grid they have to read in two directions. */}
          <div className="mt-6 grid w-full grid-cols-2 gap-3 max-sm:mt-4 max-sm:grid-cols-1 max-sm:gap-2 sm:grid-cols-3">
            {CARDS.map((card) => (
              <div
                key={card.name}
                className="flex min-w-0 flex-col items-center rounded-card border border-hair/40 bg-field px-4 py-4 text-center max-sm:flex-row max-sm:items-center max-sm:gap-3 max-sm:px-3 max-sm:py-2.5 max-sm:text-left"
              >
                {/* A square box, and the drawing fitted inside it.

                  Sized by height alone they were not one size at all: the
                  browser window is a wide drawing and the mark is a square
                  one, so fitting both to the same height made the first half
                  again as large as the second. One box for all six is what
                  makes them read as a set. */}
                {card.art ? (
                  <Image
                    src={card.art}
                    alt=""
                    width={320}
                    height={320}
                    aria-hidden
                    draggable={false}
                    sizes="220px"
                    className="size-28 flex-none object-contain max-sm:size-14 sm:size-30 lg:size-32"
                  />
                ) : null}

                {/* The name and the sentence are one block on a phone, so the
                    row has two parts rather than three and the words keep a
                    single left edge. */}
                <span className="min-w-0 max-sm:flex-1">
                  <b className="mt-2.5 block text-[12.5px] leading-[1.25] font-bold tracking-[-0.02em] text-ink max-sm:mt-0 max-sm:text-[13px]">
                    {card.name}
                  </b>
                  {/* No clamp on the one card that carries a link.

                    Three lines is what the longest of these sentences takes,
                    and the sentence naming the sister company ends on the
                    fourth - so the clamp was cutting the card's only control
                    off the bottom of it. */}
                  <p className="mt-1 text-[11px] leading-[1.45] text-quiet max-sm:text-[11.5px] max-sm:leading-[1.5]">
                    <SisterSentence say={card.say} />
                  </p>
                </span>
              </div>
            ))}
          </div>

          {/* The seventh, said as a line rather than drawn as a card - it is
            what the six above add up to, and a sum set beside its own parts
            reads as a seventh part. */}
          <div className="mt-6 flex items-center justify-center gap-5 max-sm:mt-4 max-sm:gap-3">
            <Image
              src="/assets/logo.png"
              alt=""
              width={128}
              height={128}
              aria-hidden
              draggable={false}
              sizes="128px"
              className="size-12 flex-none object-contain max-sm:size-9"
            />
            {/* Both lines the one grey, at the one weight. They are a single
              sentence broken over two, and setting the first darker made it a
              heading with a caption under it - which is two things where the
              reference has one. */}
            {/* Left within itself, though the column around it is centred.
                It is one sentence broken over two lines beside a mark, and
                two centred lines next to a picture are ragged on both sides
                with nothing holding them to it. */}
            <p className="text-left text-[15.5px] leading-[1.55] text-quiet max-sm:text-[12.5px] max-sm:leading-[1.45]">
              One partner. Every part connected.
              <span className="block">
                From the first idea to long-term growth.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* The eleven. Numbered rather than ticked: a column of eleven ticks
          says the same thing eleven times, and the count is the actual claim. */}
      <div className="quiet-scroll min-h-0 lg:overflow-y-auto">
        <div className="flex min-h-full flex-col justify-center px-6 py-5 max-sm:px-4 max-sm:py-4 sm:px-9 sm:py-6 lg:px-11 lg:py-7">
          <h3
            id="project-open-name"
            className="max-w-[34ch] text-[clamp(19px,1.9vw,27px)] leading-[1.15] font-extrabold tracking-[-0.032em] text-ink max-sm:text-[17.5px]"
          >
            Every site we build gets the same eleven inclusions, whatever its
            size.
          </h3>

          {/* One paragraph, not two lines.

              The second sentence was in a `block` span, which held it to its own
              line whatever the measure was - so a wider cap changed nothing and
              the pair sat as two short lines under a heading running the full
              width of the column. They are a statement and the illustration of
              it, which is a paragraph. Set as one it fills the column the
              heading already sets. */}
          <p className="mt-3 max-w-[78ch] text-[13.5px] leading-[1.6] text-quiet max-sm:mt-2 max-sm:text-[12px] max-sm:leading-[1.5]">
            Not a tier, not an upgrade, and not something to ask for. A five
            page site gets the list. A fifty page site gets the list.
          </p>

          {/* The rule between rows is the faintest one the palette has. Eleven
            of them stacked is eleven lines of furniture against eleven lines
            of type, and at the hairline weight they separate the rows without
            being read as part of them. */}
          <ol className="mt-5 max-sm:mt-3.5">
            {INCLUDED.map((line, n) => (
              <li
                key={line.say}
                className="flex min-w-0 items-center gap-4 border-b border-hair/50 py-2 max-sm:gap-2.5 max-sm:py-1.5"
              >
                <span
                  aria-hidden
                  className="flex size-8 flex-none items-center justify-center rounded-full bg-canvas font-mono text-[10px] font-bold text-ink tabular-nums max-sm:size-6 max-sm:text-[9px]"
                >
                  {String(n + 1).padStart(2, "0")}
                </span>
                <line.icon
                  aria-hidden
                  className="size-5 flex-none text-quiet max-sm:size-4"
                  strokeWidth={1.5}
                />
                <span className="min-w-0 text-[13.5px] leading-[1.45] text-body max-sm:text-[12.5px]">
                  {line.say}
                </span>
              </li>
            ))}
          </ol>

          {/* What happens next, which is the one thing this panel does not
            already answer. */}
          <p className="mt-4 flex items-start gap-2.5 rounded-card bg-canvas px-4 py-2.5 text-[12px] leading-[1.55] text-quiet max-sm:mt-3 max-sm:gap-2 max-sm:px-3 max-sm:py-2 max-sm:text-[11.5px]">
            <Info
              aria-hidden
              className="mt-px size-3.5 flex-none text-idx"
              strokeWidth={2}
            />
            <span>
              You will be given the option to book a meeting with us as part of
              your submission, or you can provide us with some time slots that
              work for you, and we will reach out to you to set up the meeting.
            </span>
          </p>

          {/* And the two ways out of it.

              This panel answered everything and asked for nothing. Somebody who
              has read six disciplines and eleven inclusions has read the whole
              case, and what was at the foot of it was a note explaining that a
              meeting can be booked - which describes a door rather than being
              one. The way to close a panel like this is the same way the card
              behind it opens: scope it, or talk first.

              Two, and not the third. The hero's row carries "View our services"
              as well, and that points at a section of the page this panel is
              lying on top of - a button whose whole effect is to scroll
              something nobody can see. The six disciplines are in the other half
              of this panel anyway.

              The doors this card sets, at this card's sizes. Filled first and
              outlined second, so the pair reads as one choice with a default
              rather than two buttons of equal weight. */}
          {/* Full width on a phone, and stacked. Sized to their own words they
              are two pills of different length read one under the other, which
              is the same fault the doors on every other surface here had. */}
          <div className="mt-5 flex flex-wrap justify-center gap-2.5 max-sm:mt-4 max-sm:flex-col max-sm:gap-2">
            <Link
              href={ROUTES.build}
              className="group/way thread-fill inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-[13.5px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90 max-sm:w-full max-sm:px-4 max-sm:py-2.5 max-sm:text-[12.5px]"
            >
              <PencilLine aria-hidden className="size-4 shrink-0" />
              Scope your website
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5"
                strokeWidth={2.4}
              />
            </Link>

            <Link
              href={ROUTES.book}
              className="group/way inline-flex items-center justify-center gap-2 rounded-pill border border-hair bg-field px-5 py-2.5 text-[13.5px] font-semibold whitespace-nowrap text-ink transition-colors hover:border-ink max-sm:w-full max-sm:px-4 max-sm:py-2.5 max-sm:text-[12.5px]"
            >
              <CalendarDays aria-hidden className="size-4 shrink-0 text-idx" />
              Book a meeting
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5 group-hover/way:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
