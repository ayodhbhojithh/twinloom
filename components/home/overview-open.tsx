import Image from "next/image";
import { Info } from "lucide-react";

import { INCLUDED, OFFER, SERVICES } from "@/lib/services";

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
 * What we build first, then what sits behind it, then the four that run
 * alongside. "One partner, the whole build" is deliberately not in it: it is
 * not a seventh discipline, it is the sum of the other six, and it has the line
 * at the foot rather than a card of its own.
 *
 * Each card is the discipline's own drawing rather than its Lucide icon. The
 * icon is the fallback the services page keeps for a discipline whose picture
 * has not been made yet, and all six of these have one.
 */
const CARDS = [...OFFER, ...SERVICES]
  .filter((entry) => entry.n !== "One partner, the whole build")
  .map((entry) => ({ art: entry.art, name: entry.n, say: entry.sub }));

export function OverviewOpen() {
  return (
    <>
      {/* What we do. On the canvas, so the eleven beside it read as the
          white surface and this reads as the room they stand in. */}
      <div className="quiet-scroll min-h-0 overflow-y-auto bg-canvas px-6 py-5 sm:px-9 sm:py-6 lg:px-11 lg:py-7">
        <div className="flex items-center gap-3.5">
          <Image
            src="/assets/logo.png"
            alt=""
            width={128}
            height={128}
            aria-hidden
            draggable={false}
            sizes="128px"
            className="size-11 flex-none object-contain"
          />
          <span className="text-[clamp(22px,2.2vw,32px)] leading-none font-extrabold tracking-[-0.03em] text-ink">
            TwinLoom
          </span>
        </div>

        <h2 className="mt-5 max-w-[16ch] text-[clamp(26px,3vw,44px)] leading-[1.06] font-extrabold tracking-[-0.038em] text-ink">
          Connecting ideas. Building presence.
        </h2>

        <p className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.6] text-quiet">
          Websites that perform. Software that powers. Digital services that
          move you forward.
        </p>

        {/* Three across, two down, and each card centred on its own drawing.

            The sentence is clamped rather than rewritten: these are the same
            six sentences the services page sets, and a card that needs its own
            shorter copy is a seventh place for the offer to be worded
            differently. Three lines is what the tallest of them takes. */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.name}
              className="flex min-w-0 flex-col items-center rounded-card border border-hair/40 bg-field px-4 py-4 text-center"
            >
              {card.art ? (
                <Image
                  src={card.art}
                  alt=""
                  width={320}
                  height={320}
                  aria-hidden
                  draggable={false}
                  sizes="200px"
                  className="h-24 w-auto flex-none object-contain"
                />
              ) : null}

              <b className="mt-3 block text-[13.5px] leading-[1.25] font-bold tracking-[-0.02em] text-ink">
                {card.name}
              </b>
              <p className="mt-1.5 line-clamp-3 text-[12px] leading-[1.5] text-quiet">
                {card.say}
              </p>
            </div>
          ))}
        </div>

        {/* The seventh, said as a line rather than drawn as a card - it is
            what the six above add up to, and a sum set beside its own parts
            reads as a seventh part. */}
        <div className="mt-6 flex items-center justify-center gap-5">
          <Image
            src="/assets/logo.png"
            alt=""
            width={128}
            height={128}
            aria-hidden
            draggable={false}
            sizes="128px"
            className="size-12 flex-none object-contain"
          />
          {/* Both lines the one grey, at the one weight. They are a single
              sentence broken over two, and setting the first darker made it a
              heading with a caption under it - which is two things where the
              reference has one. */}
          <p className="text-[15.5px] leading-[1.55] text-quiet">
            One partner. Every part connected.
            <span className="block">
              From the first idea to long-term growth.
            </span>
          </p>
        </div>
      </div>

      {/* The eleven. Numbered rather than ticked: a column of eleven ticks
          says the same thing eleven times, and the count is the actual claim. */}
      <div className="quiet-scroll flex min-h-0 flex-col overflow-y-auto px-6 py-5 sm:px-9 sm:py-6 lg:px-11 lg:py-7">
        <h3
          id="project-open-name"
          className="max-w-[34ch] text-[clamp(19px,1.9vw,27px)] leading-[1.15] font-extrabold tracking-[-0.032em] text-ink"
        >
          Every site we build gets the same eleven inclusions, whatever its
          size.
        </h3>

        <p className="mt-3 max-w-[56ch] text-[13.5px] leading-[1.6] text-quiet">
          Not a tier, not an upgrade, and not something to ask for.
          <span className="block">
            A five page site gets the list. A fifty page site gets the list.
          </span>
        </p>

        {/* The rule between rows is the faintest one the palette has. Eleven
            of them stacked is eleven lines of furniture against eleven lines
            of type, and at the hairline weight they separate the rows without
            being read as part of them. */}
        <ol className="mt-5">
          {INCLUDED.map((line, n) => (
            <li
              key={line.say}
              className="flex min-w-0 items-center gap-4 border-b border-hair/50 py-2"
            >
              <span
                aria-hidden
                className="flex size-8 flex-none items-center justify-center rounded-full bg-canvas font-mono text-[10px] font-bold text-ink tabular-nums"
              >
                {String(n + 1).padStart(2, "0")}
              </span>
              <line.icon
                aria-hidden
                className="size-5 flex-none text-quiet"
                strokeWidth={1.5}
              />
              <span className="min-w-0 text-[13.5px] leading-[1.45] text-body">
                {line.say}
              </span>
            </li>
          ))}
        </ol>

        {/* What happens next, which is the one thing this panel does not
            already answer. */}
        <p className="mt-5 flex items-start gap-3 rounded-card bg-canvas px-5 py-3.5 text-[13px] leading-[1.6] text-quiet">
          <Info
            aria-hidden
            className="mt-0.5 size-4 flex-none text-idx"
            strokeWidth={2}
          />
          <span>
            You will be given the option to book a meeting with us as part of
            your submission, or you can provide us with some time slots that
            work for you, and we will reach out to you to set up the meeting.
          </span>
        </p>
      </div>
    </>
  );
}
