"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SisterSentence } from "@/components/blocks";
import { CutPanel } from "@/components/layout/cut-panel";
import { OFFER, SERVICES } from "@/lib/services";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Our services.

   Built on the arrangement home v6 uses: everything on one axis down the
   middle, and a row of words drifting underneath it so a centred page has a
   second direction to read in. A column of centred text finishes and stops;
   something crossing beneath it gives the eye somewhere to go.

   What it does not do is name people we have not agreed to name. Every
   discipline here is one a build genuinely reaches for, and each says what the
   specialist covers rather than who they are - because a page of invented
   partner logos is a lie about credentials, not a placeholder.
--------------------------------------------------------------------------- */

/**
 * How far below the top each card hangs, in order.
 *
 * Set by hand rather than generated, exactly as the landing wall sets it. A row
 * of cards all on one line is a contact sheet; the same row with each card hung
 * at its own height is a wall, and which card sits where is a composition
 * rather than a random number.
 */
/* The stagger is gone.

   Six cards hung at six different heights, which on a row that is already
   drifting sideways is two movements at once - and with the cards at unequal
   heights as well, the row had no line anywhere: not along the top and not along
   the bottom. One baseline, one height, and the drift is the only thing moving.
*/

/** How the wall leaves the page: thinned at both ends, never cut. */
const EDGES =
  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 3%, black 12%, black 88%, rgba(0,0,0,0.35) 97%, transparent 100%)";

/* The one plate under all six cards is gone.

   It was `/partners/minimal.png`, and the case for it was that six different
   photographs would make six different claims about what each discipline looks
   like, none of which we can stand behind - so one surface for all of them was
   the honest version.

   That argument holds against photographs and not against drawings. A drawing
   claims nothing about the work; it is a mark for the thing, the way the number
   in the corner is. Each card carries its own now, in `public/services`, and
   whichever have not been drawn yet fall back to the Lucide icon the entry
   already carries. */

/**
 * What the wall shows.
 *
 * The seven things we do, not seven partner disciplines. There are no partners
 * to name, and a wall of specialisms on a page about services was answering a
 * question nobody had asked yet - somebody arriving here wants the list of what
 * can be bought, and this is that list.
 */
const SHOWN = [...OFFER, ...SERVICES];

const RULES = [
  "One contract, and it is with us.",
  "One invoice, and it comes from us.",
  "Named in the proposal before the work starts.",
  "Briefed and reviewed inside the project, never beside it.",
  "Their part of the result is our responsibility.",
  "Listed as a sub-processor wherever they touch personal data.",
] as const;

/**
 * The disciplines, as a row you push rather than one that drifts.
 *
 * It looped and moved on its own: the list rendered twice, the position
 * wrapping at half the width so the seam had nothing to see, drifting at
 * thirty-odd pixels a second and stopping under a hand. All of that is gone.
 *
 * A loop has to render everything twice, which puts a second `Custom
 * software` on screen beside the first at any width wide enough to show the
 * seam - the list is seven cards, not a ticker tape, and a reader who has
 * counted to seven and sees an eighth has been told the count was a lie. And
 * a row that moves on its own is a row that moves off whatever somebody was
 * reading.
 *
 * What is left is the seven, once, in order, held still. It scrolls when
 * there is more of it than there is room, and the two arrows step it a card
 * at a time. They are only there when there is somewhere to go: rendered off
 * a measurement rather than a guess about the width, so a screen wide enough
 * to hold all seven shows no controls at all - and neither arrow is offered
 * at an end it cannot move away from.
 *
 * Its own component because the landing page carries it too. Two copies of
 * seven disciplines would disagree the first week one of them changed.
 */
export function ServiceWall({
  className,
  bleed,
}: {
  className?: string;
  /**
   * Out to the edges of the window rather than the column.
   *
   * `page-bleed` measures from the middle of a centred container out to the
   * edges of the page, so it is only right where the container is centred.
   * Asked for rather than guessed at.
   *
   * The page rather than the window, deliberately: the desk opens over the
   * right of the screen and the page stands aside for it, and a row bled to
   * the viewport would carry on underneath the panel.
   */
  bleed?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState({ start: true, end: true });

  /**
   * Where the row stands: hard against its left end, its right end, or
   * neither.
   *
   * Measured rather than assumed, and re-measured on scroll and on resize -
   * the answer depends on how many cards fit, which depends on the width. A
   * row with no overflow reads as both ends at once, which is what hides both
   * arrows: there is nowhere to go in either direction.
   *
   * The pixel of slack absorbs sub-pixel scroll positions. Without it a row
   * scrolled fully right reports one-third of a pixel short of its own end
   * on a fractional-DPR screen, and the arrow to nowhere stays lit.
   */
  useEffect(() => {
    const node = track.current;
    if (!node) return;

    const measure = () => {
      const room = node.scrollWidth - node.clientWidth;
      setAt({
        start: node.scrollLeft <= 1,
        end: node.scrollLeft >= room - 1,
      });
    };

    measure();
    node.addEventListener("scroll", measure, { passive: true });

    const watcher = new ResizeObserver(measure);
    watcher.observe(node);

    return () => {
      node.removeEventListener("scroll", measure);
      watcher.disconnect();
    };
  }, []);

  /** One card and its gap, so a press moves by exactly what the eye counts. */
  const step = (way: 1 | -1) => {
    const node = track.current;
    if (!node) return;
    const card = node.firstElementChild as HTMLElement | null;
    const by = card ? card.offsetWidth + 16 : node.clientWidth * 0.8;
    node.scrollBy({ left: by * way, behavior: "smooth" });
  };

  const still = at.start && at.end;

  return (
    <div className={cn("group relative", bleed ? "page-bleed" : "", className)}>
      <div
        ref={track}
        /* Faded at both ends rather than cut off - but only while there is
           something past them. Thinning the ends of a row that already fits
           dims the first and last card for no reason. */
        style={{
          maskImage: still ? undefined : EDGES,
          WebkitMaskImage: still ? undefined : EDGES,
          scrollbarWidth: "none",
        }}
        /* Centred while they fit, packed from the left once they do not.

           `justify-center` on an overflowing scroller is the old trap: it
           centres the whole track, which pushes the first card out past
           `scrollLeft: 0` where nothing can ever scroll back to it. Applied
           only when the row has room to spare, it does what it looks like -
           seven cards sitting in the middle of a wide screen rather than
           packed against one edge with a gap at the other. */
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden sm:px-6",
          still && "justify-center",
        )}
      >
        {/* Lit rather than lifted on hover.

            The card rose a pixel and a half, which wants vertical room the row
            no longer has: setting `overflow-x` to anything but `visible` makes
            the other axis `auto` too, so with the padding gone a card that
            moved up would be clipped by its own scroller. A shadow happens
            inside the box and needs none. */}
        {SHOWN.map((entry) => (
          <article
            key={entry.n}
            /* The middle term is the phone's card and the cap is the desk's.

               At 72vw a card was 270 wide on a 375 screen, and the drawing is
               a square of that width - so nearly three quarters of the phone,
               and the picture alone as tall as the words twice over. 44vw puts
               two on screen at once with a third showing past them, which is
               what tells somebody the row goes on. Because the drawing is a
               ratio rather than a height it comes down with the card and
               nothing else has to be told.

               The cap is unchanged, so a wide screen is where it was: 44vw
               passes 286 at about a 650 wide window, and everything above that
               gets the same card as before. */
            className="group/card flex w-[clamp(146px,40vw,286px)] shrink-0 snap-start flex-col rounded-[16px] bg-field p-2.5 transition-shadow duration-300 sm:rounded-[22px] sm:p-5 hover:shadow-[0_10px_30px_rgba(24,39,75,0.08)]"
          >
            {/* The drawing, in the flow and sized by ratio rather than by a
                number.

                It was laid over the card at a fixed height with the text
                pushed clear of it by a matching fixed padding - two numbers
                that had to agree, and a picture 248 tall on a card 232 wide,
                which is what a phone got. A ratio needs neither number: every
                card in this row is the same width, so every box is the same
                height, so the type below still starts level across all seven
                - which was the only thing the overlay was buying.

                Contained, centred, on nothing. The picture's white and the
                card's white are the same white, so there is no seam to hide
                and no mask to hide it with - and out past the card's own
                padding, which the words need and the picture does not.

                The files are square on purpose. They were seven different
                canvases with the artwork sitting in a different share of each
                - between four tenths and seven - so `contain` scaled every one
                by a different number and no CSS could have evened them up.
                Each is cropped to its own artwork and padded back out to a
                square, so one box scales them all alike. */}
            <span
              aria-hidden
              className="relative -mx-1 block aspect-4/3 shrink-0 sm:aspect-square"
            >
              {entry.art ? (
                <Image
                  src={entry.art}
                  alt=""
                  fill
                  draggable={false}
                  sizes="(max-width: 640px) 72vw, 286px"
                  className="object-contain transition-transform duration-500 group-hover/card:scale-[1.06]"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center">
                  <entry.icon
                    className="size-12 text-mark transition-transform duration-500 group-hover/card:scale-[1.06]"
                    strokeWidth={1.5}
                  />
                </span>
              )}
            </span>

            <div className="mt-2 sm:mt-3">
              {/* Two lines' worth of room whether the name needs it or not.
                  Four of these run to one line and three to two, and with the
                  box sized to its own words the sentences under them landed at
                  four different heights along the row. */}
              <h3 className="min-h-[2.4em] text-[12px] leading-[1.2] font-extrabold tracking-[-0.028em] text-ink sm:text-[17px]">
                {entry.n}
              </h3>

              {/* The sentence, whole.

                  It was clamped to three lines, on the argument that it made
                  every card one height. It did not: the cards are flex items
                  in a row, so they were already stretching to the tallest of
                  them whatever their contents did. What the clamp actually
                  bought was a shorter row - and it charged three of the seven
                  a sentence cut off mid-clause with an ellipsis, which reads
                  as a page that has run out rather than as a card that is
                  full.

                  A sentence is the smallest thing on this card that is worth
                  anything. Four bullets of what each discipline covers stood
                  here once and those were right to go, because a list nobody
                  can stop to read is furniture; a line of prose is not. */}
              <p className="mt-1 text-[10.5px] leading-[1.5] text-quiet sm:mt-1.5 sm:text-[13.5px] sm:leading-[1.6]">
                <SisterSentence say={entry.sub} />
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* One arrow each side, and neither one when there is nowhere to go.

          They stand over the row's own ends rather than beside it, so the
          seven cards keep the full width - a control column either side would
          take a card's worth of room to hold a button that is not always
          there. Hidden from the reading order: the row is a scroller and a
          keyboard reaches it as one, so these are a pointer's shortcut rather
          than the only way through.

          Shown on a phone too, and they were not. A row that scrolls
          sideways inside a page that scrolls down is the one gesture people
          miss on a touch screen - there is nothing to see unless the cards
          happen to be cut off at the right moment. Smaller there, and closer
          to the edge, so they sit over the gap between cards rather than
          over a drawing. */}
      {!still ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => step(-1)}
            disabled={at.start}
            className="absolute top-1/2 left-1 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-pill border border-hair bg-field/95 text-ink shadow-sm transition-opacity hover:bg-hair disabled:pointer-events-none disabled:opacity-0 sm:left-4 sm:size-10"
          >
            <ChevronLeft className="size-4 sm:size-5" strokeWidth={2.2} />
          </button>

          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => step(1)}
            disabled={at.end}
            className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-pill border border-hair bg-field/95 text-ink shadow-sm transition-opacity hover:bg-hair disabled:pointer-events-none disabled:opacity-0 sm:right-4 sm:size-10"
          >
            <ChevronRight className="size-4 sm:size-5" strokeWidth={2.2} />
          </button>
        </>
      ) : null}
    </div>
  );
}

/**
 * Our services.
 *
 * The page this replaced was about partners. Partners are how some of the work
 * gets done, which is a fact about delivery rather than a thing anybody comes
 * to a website looking for - somebody arriving from the navigation wants to
 * know what can be bought. So the services lead, and the specialists sit under
 * them as the answer to "who actually does this one".
 *
 * The lists come from `lib/services.ts` rather than from this file, because
 * the about page names the same things, and what a company sells is the worst
 * thing on a website to be inconsistent about.
 */
export function ServicesView() {
  const drift = [
    ...SHOWN.map((entry) => entry.n),
    "One contract",
    "One invoice",
  ];

  return (
    <>
      {/* One axis down the middle, as the rest of the site sets a head. */}
      <section className="page-frame pt-4 pb-10 text-center">
        <h1 className="mx-auto max-w-[24ch] text-[clamp(32px,4.6vw,68px)] leading-[1.04] font-extrabold tracking-[-0.045em] text-balance text-ink">
          Everything we do,
          <span className="text-quiet"> and who actually does it.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[92ch] text-[16.5px] leading-[1.65] text-quiet sm:text-[18px]">
          Websites first, and the things that make one worth having: what it
          should do, what runs alongside it once it is live, and the specialist
          work a build sometimes reaches for. All of it on one contract, from
          us.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href={ROUTES.build}
            className="group inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Build your website
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <Link
            href={ROUTES.book}
            className="group inline-flex items-center gap-2 rounded-pill bg-field px-5 py-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-hair"
          >
            Talk it through
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>

      {/* The names, drifting. Full bleed, so they leave the page rather than
          stopping at a margin. */}
      <div aria-hidden className="overflow-hidden py-2">
        <div className="drift flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {drift.map((word, index) => (
                <span
                  key={`${copy}-${word}-${index}`}
                  className="flex items-center gap-10 px-10 text-[19px] font-semibold whitespace-nowrap text-planned sm:text-[22px]"
                >
                  {word}
                  <span className="text-hair">&middot;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* And the specialists, which is how some of the above gets delivered. */}
      <section className="page-frame pt-10 pb-16">
        <h2 className="mx-auto max-w-[34ch] text-center text-[clamp(21px,2.1vw,30px)] leading-[1.1] font-extrabold tracking-[-0.035em] text-ink">
          What we do, in seven.
        </h2>

        <p className="mx-auto mt-3 max-w-[110ch] text-center text-[15.5px] leading-[1.65] text-quiet">
          Two things we build, four that run alongside them, and the reason they
          are on one list. Some are led by a specialist who does that one thing
          all day - where a project needs one we say so in the proposal, brief
          them inside the work, and stay responsible for what comes back.
        </p>

        <p className="mx-auto mt-4 text-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
          Drag it, or let it run
        </p>

        <ServiceWall className="mt-9" />

        <CutPanel
          tone="field"
          className="mt-4 w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              However it is delivered
            </span>
          }
          corner={
            <Link
              href={ROUTES.build}
              aria-label="Build your website"
              title="Build your website"
              className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
            >
              <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
            </Link>
          }
        >
          <h2 className="mx-auto mt-8 max-w-[30ch] text-center text-[clamp(21px,2.1vw,30px)] leading-[1.1] font-extrabold tracking-[-0.035em] text-ink">
            Six things that hold, whoever does the work.
          </h2>

          <p className="mx-auto mt-3 max-w-[64ch] text-center text-[14px] leading-[1.65] text-quiet">
            The difference between a specialist inside a project and a supplier
            beside one is which of us you have to chase. It is never you.
          </p>

          {/* Tiles rather than a tick list.

              Six ticks in two columns read as a feature list on a pricing
              page - the same mark six times, saying only that six things are
              true. Numbered tiles say there are six of them and that each is
              its own commitment, which is what these are. */}
          <ul className="mx-auto mt-9 grid w-full max-w-[1180px] gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* One row per rule, not two. The mark and the number sat on a
                line of their own with the words underneath, which made a six
                word commitment three lines tall and left a band of empty tile
                between them. Read across, a tile is the height of what is in
                it. */}
            {RULES.map((rule, n) => (
              <li
                key={rule}
                className="flex min-w-0 items-center gap-3.5 rounded-[16px] bg-canvas py-3.5 pr-4 pl-4 transition-colors hover:bg-canvas-firm"
              >
                <span
                  aria-hidden
                  className="flex size-8 flex-none items-center justify-center rounded-pill bg-field text-mark"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>

                <span className="min-w-0 flex-1 text-[13.5px] leading-[1.45] font-semibold text-ink">
                  {rule}
                </span>

                <span className="flex-none font-mono text-[9.5px] font-bold text-idx tabular-nums">
                  {String(n + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-9 max-w-[80ch] text-center text-[12.5px] leading-[1.6] text-label">
            Most projects need none of the specialist work. Where one is needed
            it is named before the work starts, rather than added to an invoice
            afterwards.
          </p>
        </CutPanel>
      </section>
    </>
  );
}
