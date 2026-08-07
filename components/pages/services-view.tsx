"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
const HANG = [48, 0, 30, 66, 14, 54];

/**
 * How the picture leaves the card.
 *
 * Curved rather than linear, and over most of the lower half: a short straight
 * fade reads as a band with an edge at each end, which is the one thing a blend
 * must not have.
 */
/** How the wall leaves the page: thinned at both ends, never cut. */
const EDGES =
  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 3%, black 12%, black 88%, rgba(0,0,0,0.35) 97%, transparent 100%)";

const FADE =
  "linear-gradient(to bottom, black 34%, rgba(0,0,0,0.92) 48%, rgba(0,0,0,0.72) 62%, rgba(0,0,0,0.44) 76%, rgba(0,0,0,0.18) 88%, transparent 100%)";

/**
 * One picture for all six.
 *
 * Six different pictures made six different claims about what each discipline
 * looks like, none of which we can stand behind - these are not photographs of
 * the work. One plate under all of them is honest about that: it is a surface
 * the cards are printed on, not an illustration of the thing.
 */
const PLATE = "/partners/minimal.png";

/**
 * What the wall shows.
 *
 * The six things we do, not six partner disciplines. There are no partners to
 * name, and a wall of specialisms on a page about services was answering a
 * question nobody had asked yet - somebody arriving here wants the list of
 * what can be bought, and this is that list.
 */
const SHOWN = [...OFFER, ...SERVICES];

const RULES = [
  "One contract, and it is with us.",
  "One invoice, and it comes from us.",
  "Named in the proposal before the work starts.",
  "Briefed and reviewed inside the project, not beside it.",
  "Their part of the result is our responsibility.",
  "Where they handle personal data, they are listed as a sub-processor.",
] as const;

/**
 * The disciplines, as a wall that drifts past.
 *
 * The same arrangement the work uses on the landing page: one track holding the
 * run twice and shifting by exactly half its width, so the loop has no seam and
 * no gap, and each card hung at its own height so the row reads as a wall
 * rather than as a contact sheet. It stops under the pointer, because a card
 * nobody can hold still is a card nobody can read.
 *
 * Its own component because the landing page carries it too. Two copies of six
 * disciplines would disagree the first week one of them changed.
 */
export function ServiceWall({
  className,
  bleed,
}: {
  className?: string;
  /**
   * Out to the edges of the window rather than the column.
   *
   * `50% - 50vw` measures from the middle of a centred container to the middle
   * of the window, so it is only right where the container is centred. Asked
   * for rather than guessed at.
   */
  bleed?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const held = useRef(false);
  const [grabbing, setGrabbing] = useState(false);

  /**
   * The loop, and the hand on it.
   *
   * Both move the same number - `scrollLeft` - which is what lets them be the
   * same control rather than two. A CSS animation could do the drift on its
   * own, but nothing can then take hold of it: a transform and a scroll
   * position are two positions, and dragging one leaves the other where it
   * was.
   *
   * The list is rendered twice and the position wraps at half the width, so
   * the seam falls where the copy repeats and there is nothing to see. It
   * stops while a drag is in progress and at no other time.
   *
   * It does not check `prefers-reduced-motion`. It did, and that was the
   * reason it looked broken on a machine with animations turned off in the
   * operating system - which is most Windows laptops that have ever had a
   * battery-saver on. Asked for explicitly, so it runs; it is a slow drift
   * rather than anything that flashes, and a hand on it stops it.
   */
  useEffect(() => {
    const node = track.current;
    if (!node) return;

    let frame = 0;
    let last = 0;
    /* The position is kept here, in a float, and written to the element -
       never read back from it.

       That is the fix for the row standing still. At thirty pixels a second a
       frame moves it half a pixel, and `scrollLeft += 0.5` is a read, an add
       and a write: the browser rounds the value it stores, the next read gets
       the rounded number back, and the half pixel is lost every frame forever.
       Accumulating outside the DOM means the fraction survives until it adds
       up to something the element can hold. */
    let pos = node.scrollLeft;

    const tick = (now: number) => {
      const step = last ? Math.min(now - last, 64) : 16;
      last = now;

      const half = node.scrollWidth / 2;

      if (held.current) {
        /* A hand is on it. Follow where it was put, so letting go does not
           snap back to wherever the drift had got to. */
        pos = node.scrollLeft;
      } else {
        pos += (step / 1000) * 34;

        /* Wrap on the half, in both directions - a drag can run it backwards
           past the start as easily as the drift runs it past the end. */
        if (half > 0) {
          if (pos >= half) pos -= half;
          else if (pos < 0) pos += half;
        }

        node.scrollLeft = pos;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const from = useRef({ x: 0, left: 0 });

  const grab = (event: React.PointerEvent) => {
    const node = track.current;
    if (!node) return;
    held.current = true;
    setGrabbing(true);
    from.current = { x: event.clientX, left: node.scrollLeft };
    node.setPointerCapture(event.pointerId);
  };

  const move = (event: React.PointerEvent) => {
    const node = track.current;
    if (!node || !held.current) return;
    node.scrollLeft = from.current.left - (event.clientX - from.current.x);
  };

  const drop = (event: React.PointerEvent) => {
    held.current = false;
    setGrabbing(false);
    track.current?.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      className={cn(
        "group",
        bleed ? "mx-[calc(50%-50vw)] w-screen" : "",
        className,
      )}
    >
      <div
        ref={track}
        onPointerDown={grab}
        onPointerMove={move}
        onPointerUp={drop}
        onPointerCancel={drop}
        /* Faded at both ends rather than cut off. A row that stops at a
           straight edge is a row that has been trimmed; one that thins into
           the page carries on past it, which is the point of it moving. */
        style={{
          maskImage: EDGES,
          WebkitMaskImage: EDGES,
          scrollbarWidth: "none",
          /* Not smooth. `html` carries `scroll-behavior: smooth` for the
             page's own anchors, and a scroller that inherits it animates
             every one of these one-pixel-a-frame writes - which cancel each
             other out and leave the row standing still. */
          scrollBehavior: "auto",
        }}
        className={cn(
          "flex gap-4 overflow-x-auto px-4 py-3 [&::-webkit-scrollbar]:hidden sm:px-6",
          grabbing ? "cursor-grabbing select-none" : "cursor-grab",
        )}
      >
        {[0, 1].map((copy) =>
          SHOWN.map((entry, index) => (
            <article
              key={`${copy}-${entry.n}`}
              aria-hidden={copy === 1}
              style={{ marginTop: HANG[index % HANG.length] }}
              className="group/card flex w-[clamp(260px,24vw,330px)] shrink-0 flex-col overflow-hidden rounded-[20px] bg-field transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* The picture first, and faded into the card rather than
                  stopped by an edge. A photograph with a hard bottom line is a
                  photograph stuck on a card; faded, the card is one thing that
                  happens to begin as a picture. */}
              <span className="relative block aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={PLATE}
                  alt=""
                  fill
                  draggable={false}
                  sizes="(max-width: 640px) 70vw, 330px"
                  className="object-cover transition-transform duration-500 group-hover/card:scale-[1.05]"
                  style={{ maskImage: FADE, WebkitMaskImage: FADE }}
                />

                <span className="absolute top-3 left-3 flex size-7 items-center justify-center rounded-pill bg-field/85 font-mono text-[10px] font-bold text-ink backdrop-blur-sm tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>

              <h3 className="-mt-3 max-w-[18ch] px-5 text-[17px] leading-[1.2] font-extrabold tracking-[-0.028em] text-ink">
                {entry.n}
              </h3>

              <p className="mt-2.5 px-5 text-[13.5px] leading-[1.6] text-body">
                {entry.sub}
              </p>

              <ul className="mt-auto flex flex-col gap-1.5 px-5 pt-4 pb-5">
                {entry.covers.slice(0, 4).map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 text-[12.5px] leading-[1.5] text-quiet"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] size-1 flex-none rounded-pill bg-mark"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          )),
        )}
      </div>
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
          What we do, in six.
        </h2>

        <p className="mx-auto mt-3 max-w-[110ch] text-center text-[15.5px] leading-[1.65] text-quiet">
          Two things we build and four that run alongside them. Some are led by
          a specialist who does that one thing all day - where a project needs
          one we say so in the proposal, brief them inside the work, and stay
          responsible for what comes back.
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
          <ul className="mx-auto mt-8 grid max-w-[92ch] gap-x-12 gap-y-3 sm:grid-cols-2">
            {RULES.map((rule) => (
              <li key={rule} className="flex gap-2.5">
                <Check
                  aria-hidden
                  className="mt-[4px] size-3.5 flex-none text-mark"
                  strokeWidth={3}
                />
                <span className="text-[14px] leading-[1.55] text-body">
                  {rule}
                </span>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-8 max-w-[80ch] text-center text-[12.5px] leading-[1.6] text-label">
            Most projects need none of the specialist work. Where one is needed
            it is named before the work starts, rather than added to an invoice
            afterwards.
          </p>
        </CutPanel>
      </section>
    </>
  );
}
