"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { PROJECTS } from "./projects";

/* The carousel's own imports, held with it.
   import { AnimatePresence, motion } from "motion/react";
   import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
   import { ProjectPanel } from "./project-panel";
   import { type Project } from "./projects"; */

/**
 * What the card plays.
 *
 * One file, named here rather than at the point of use, because the card is the
 * only thing that shows it and the next one to arrive should be a one-line
 * change in a place somebody can find.
 */
const FILM = "/videos/1.mp4";

/* ---------------------------------------------------------------------------
   A card with pieces taken out of it.

   Three things sit against the card rather than on it: a bar of controls at the
   top, the next project at the bottom left, and the way on at the bottom right.
   The card is cut back around each, and the cuts curve outward where they meet
   the edge, so the shape reads as one continuous surface with bites out of it
   rather than as four rectangles overlapping.

   Those outward curves are the whole job. `border-radius` only ever bends a
   corner inward, and a mask made of gradients gets the straight edges right and
   the corners visibly wrong. The outline is written as a path instead: every
   corner is an arc, and which side of the arc its centre falls on decides
   whether the surface curves in or out.
--------------------------------------------------------------------------- */

export interface Cuts {
  /** The card's own corners. */
  radius: number;
  /** The bar at the top: width, depth, its own corners, and the outward curve. */
  barWidth: number;
  barDepth: number;
  barRadius: number;
  barFlare: number;
  /** The bite at the bottom left, the same four numbers. */
  biteWidth: number;
  biteHeight: number;
  biteRadius: number;
  biteFlare: number;
  /** The corner taken out at the bottom right, for the way on. */
  dropWidth: number;
  dropHeight: number;
  dropRadius: number;
  dropFlare: number;
  /**
   * A second bar, in the bottom edge. Optional: a surface that wants nothing
   * standing there leaves these out and the bottom edge runs straight.
   */
  footWidth?: number;
  footDepth?: number;
  footRadius?: number;
  footFlare?: number;
}

/**
 * The outline, clockwise from just after the top left corner.
 *
 * Two kinds of turn, and telling them apart is the whole job.
 *
 * A cut's own corners curve the way any rounded box curves: the centre of the
 * arc sits inside the cut. Those are the notch's two bottom corners and the
 * bite's inner corner, and they take sweep `0`.
 *
 * A flare is where a cut meets the card's edge, and it curves the other way: the
 * centre of the arc sits in the card, so the edge sweeps outward and the cut is
 * wider at the mouth than at its floor. Those take sweep `1`, the same as the
 * card's own corners.
 *
 * Getting that backwards does not produce a subtle error. It puts the centre of
 * each flare on the wrong side, which turns the gentle sweep into a full
 * quarter-disc bitten out beside the notch, and the card grows two ears.
 */
export function outline(w: number, h: number, cut: Cuts): string {
  const {
    radius: r,
    barWidth: bw,
    barDepth: bd,
    barRadius: br,
    barFlare: bf,
    biteWidth: cw,
    biteHeight: ch,
    biteRadius: cr,
    biteFlare: cf,
    dropWidth: dw,
    dropHeight: dh,
    dropRadius: dr,
    dropFlare: df,
    footWidth: fw = 0,
    footDepth: fd = 0,
    footRadius: fr = 0,
    footFlare: ff = 0,
  } = cut;

  /* The bar is centred, so the top edge is cut from here to here. */
  const left = (w - bw) / 2;
  const right = left + bw;

  /* A cut asked for at nothing is not a tiny cut - it is no cut, and the corner
     it would have eaten has to come back as an ordinary rounded corner.
     Collapsing the numbers instead leaves a square corner where every other one
     on the card is round, which reads as a surface that has broken rather than
     one that was drawn. */
  const off = (a: number, b: number) => a < 1 || b < 1;

  const bite = off(cw, ch)
    ? [`L ${r} ${h}`, `A ${r} ${r} 0 0 1 0 ${h - r}`]
    : [
        `L ${cw + cf} ${h}`,
        `A ${cf} ${cf} 0 0 1 ${cw} ${h - cf}`,
        `L ${cw} ${h - ch + cr}`,
        `A ${cr} ${cr} 0 0 0 ${cw - cr} ${h - ch}`,
        `L ${cf} ${h - ch}`,
        `A ${cf} ${cf} 0 0 1 0 ${h - ch - cf}`,
      ];

  const drop = off(dw, dh)
    ? [`L ${w} ${h - r}`, `A ${r} ${r} 0 0 1 ${w - r} ${h}`]
    : [
        `L ${w} ${h - dh - df}`,
        `A ${df} ${df} 0 0 1 ${w - df} ${h - dh}`,
        `L ${w - dw + dr} ${h - dh}`,
        `A ${dr} ${dr} 0 0 0 ${w - dw} ${h - dh + dr}`,
        `L ${w - dw} ${h - df}`,
        `A ${df} ${df} 0 0 1 ${w - dw - df} ${h}`,
      ];

  /* The bottom bar, travelling right to left along the bottom edge - which is
     why every sweep in it is the mirror of the one at the top. The flares still
     curve outward from the card and take sweep 1; the notch's own corners curve
     the other way and take sweep 0. */
  const footLeft = (w - fw) / 2;
  const footRight = footLeft + fw;

  const footBar = off(fw, fd)
    ? []
    : [
        `L ${footRight + ff} ${h}`,
        `A ${ff} ${ff} 0 0 1 ${footRight} ${h - ff}`,
        `L ${footRight} ${h - fd + fr}`,
        `A ${fr} ${fr} 0 0 0 ${footRight - fr} ${h - fd}`,
        `L ${footLeft + fr} ${h - fd}`,
        `A ${fr} ${fr} 0 0 0 ${footLeft} ${h - fd + fr}`,
        `L ${footLeft} ${h - ff}`,
        `A ${ff} ${ff} 0 0 1 ${footLeft - ff} ${h}`,
      ];

  const bar = off(bw, bd)
    ? []
    : [
        `L ${left - bf} 0`,
        `A ${bf} ${bf} 0 0 1 ${left} ${bf}`,
        `L ${left} ${bd - br}`,
        `A ${br} ${br} 0 0 0 ${left + br} ${bd}`,
        `L ${right - br} ${bd}`,
        `A ${br} ${br} 0 0 0 ${right} ${bd - br}`,
        `L ${right} ${bf}`,
        `A ${bf} ${bf} 0 0 1 ${right + bf} 0`,
      ];

  return [
    `M ${r} 0`,
    /* Top edge, and the notch in it where there is one. */
    ...bar,
    /* On to the top right corner and down the right side. */
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    /* The bottom right corner, given up to the cut where there is one. */
    ...drop,
    /* Bottom edge, leftward: the notch in it where there is one, then the bite
       at the other end. */
    ...footBar,
    ...bite,
    /* Up the left side to where we started. */
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    "Z",
  ].join(" ");
}

/**
 * What stands in the notch, measured rather than estimated.
 *
 * Three 36px controls, a 2px gap between each pair, and 6px of padding at each
 * end of the pill holding them. Written from the same numbers the markup below
 * uses, because the notch is sized to hold this and a notch sized to hold a
 * guess is a notch the bar hangs out of.
 */
/* Held with the notch these sized.
   const TOOL = 36;
   const BAR = TOOL * 3 + 2 * 2 + 6 * 2; */

export function NotchedCard({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  /* Which picture the card in the bottom left is showing. */
  const [at, setAt] = useState(0);

  /* The small card keeps turning through the work.

     It is the carousel's clock, kept, on the one piece of the carousel that
     stayed. Nothing drives it now - there are no arrows and it is not a button -
     so it turns on its own or it shows one picture forever, and one picture
     forever in a cut made for a changing one is a slot with something stuck in
     it. Slower than the old five seconds: it is a thumbnail beside a film now
     rather than the thing being looked at, and at five it competed.

     Off entirely where reduced motion is asked for, same as the film. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const turn = window.setInterval(
      () => setAt((was) => (was + 1) % PROJECTS.length),
      7000,
    );

    return () => window.clearInterval(turn);
  }, []);

  /* The carousel's own state and its clock, held with it.
     const [at, setAt] = useState(0);
     const [open, setOpen] = useState<Project | null>(null);
     const [held, setHeld] = useState(false);

     useEffect(() => {
       if (held || open) return;
       if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

       const turn = window.setInterval(
         () => setAt((was) => (was + 1) % PROJECTS.length),
         5000,
       );

       return () => window.clearInterval(turn);
     }, [held, open]); */

  /* Reduced motion is a request about the page, and a film that plays itself is
     the loudest motion on it. `autoplay` alone cannot be asked this question in
     markup, so it is asked here and the film is held on its first frame instead
     of being taken away: the card keeps its picture, it just stops moving.

     Watched rather than read once. Somebody can turn the preference on while the
     page is open, and a card that only checked at mount would carry on playing
     at them until they reloaded. */
  useEffect(() => {
    const node = film.current;
    if (!node) return;

    const ask = window.matchMedia("(prefers-reduced-motion: reduce)");

    const settle = () => {
      if (ask.matches) node.pause();
      else void node.play().catch(() => {});
    };

    settle();
    ask.addEventListener("change", settle);

    return () => ask.removeEventListener("change", settle);
  }, []);

  useEffect(() => {
    const node = box.current;
    if (!node) return;

    const measure = () =>
      setSize({ w: node.clientWidth, h: node.clientHeight });

    const watcher = new ResizeObserver(measure);
    watcher.observe(node);
    measure();

    return () => watcher.disconnect();
  }, []);

  /* const shown = PROJECTS[at];
     const next = PROJECTS[(at + 1) % PROJECTS.length]; */

  /**
   * The four numbers that decide whether this looks drawn or assembled.
   *
   * The flare is the outward curve where a cut meets the card's edge, and it has
   * to be about as large as the cut is deep. Smaller than that and the edge drops
   * into the notch rather than sweeping into it, which is the difference between
   * a shape and a hole. The bar's own corners are half its depth, which makes it
   * a pill rather than a rounded box.
   *
   * Everything scales with the card and is then held inside what the card can
   * actually give: on a narrow screen a bar plus two flares can want more room
   * than the top edge has, and a path that overruns its own box folds inside out.
   */
  /**
   * Both cuts, from one set of numbers.
   *
   * There is one flare and one corner radius on this card, and the top notch and
   * the bottom bite are both built from them. Given two of each they drift, and a
   * card whose two cuts curve by different amounts looks like two decisions
   * rather than one.
   *
   * The depth of the notch is not chosen at all: it is the flare plus the corner,
   * which is exactly where those two arcs meet. Any other number puts a straight
   * wall between them, and the cut reads as a shallow shelf with a deeper notch
   * inside it rather than as one unbroken curve.
   */
  const cut: Cuts = ((): Cuts => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    const radius = Math.max(22, Math.min(w * 0.03 + 20, 48));

    /* The one curve every cut on this card is made of. */
    const flare = Math.max(22, Math.min(h * 0.04, 34));

    /* The notch and the bite, held with the carousel they were cut for. Both
       are set to nothing below, and `outline` gives their corners back as
       ordinary rounded ones.

    const barDepth = flare * 2;

       Only as wide as the bar it holds, plus a little air. Wider and the notch
       stops being a place for something and becomes a shape in its own right,
       which is one shape too many.

       The floor is that bar, measured, not a fraction of the card. A fraction
       of a narrow card is narrower than the thing standing in it: on a phone
       `w * 0.11` came out at thirty pixels, the old floor lifted it to
       eighty-four, and the hundred-and-twenty-four pixel bar sat twenty pixels
       out over the card's top edge on each side - three arrows outside their
       own notch. Sized from the bar, the notch cannot be too small for it at
       any width, and on a desktop the fraction is the larger number anyway, so
       nothing there moves.

       The cap is the other end of the same argument: a notch is a piece taken
       out of an edge, and it stops reading as one when there is no edge left
       either side of it. This keeps a flat run past both corner arcs.

    const barWidth = Math.min(
      Math.max(BAR + 12, Math.min(w * 0.11, 178)),
      Math.max(flare * 2 + 60, w - 2 * (radius + flare) - 24),
    );

       The bite is square-ish and sized to the thumbnail standing in it, with the
       same flare and the same corner as the notch above.

       The floor was 124, which is a fixed number on a card that is not: it
       dominated every width below about nine hundred, so a 280px phone card gave
       up nearly half its bottom edge to a thumbnail and left nothing beside it
       for the name. Ninety-six still holds a thumbnail worth looking at and
       leaves the rest of the edge to the words.
    */

    /* The bite stays. It is the one part of the bottom edge that was not the
       carousel: a piece cut out for a card to stand in, and the card standing in
       it is still there. It can be square again now, because the name that used
       to share the bottom edge with it went with the carousel. */
    const bite = Math.max(96, Math.min(Math.min(w * 0.13, h * 0.26), 196));

    /* The corner for the way on. Square, like the bite, and only as large as
       the control standing in it needs: `flare * 2` is the smallest a cut can
       be before its two arcs overlap, and the sixteen on top of it is the air
       around a 44px target. */
    const drop = Math.max(flare * 2 + 16, Math.min(w * 0.075, 96));

    /* The notch and the bite are closed while the film is what the card holds.

       A cut is a piece taken out of an edge for something to stand in, and both
       of those were cut for parts of the carousel - the arrows in the top, the
       next project in the bottom left. With those commented out the card would
       carry two holes with nothing in them, which reads as damage rather than as
       a shape. `outline` already knows what to do with a cut asked for at
       nothing: it gives the corner back as an ordinary rounded one.

       The bite and the drop stay: the card in the bottom left and the way on
       down the page are both still standing in theirs.

       To put the carousel back: swap the two zeroes for `barWidth`/`barDepth`
       and uncomment the blocks below. */
    return {
      radius,
      barWidth: 0, // barWidth,
      barDepth: 0, // barDepth,
      barRadius: flare,
      barFlare: flare,
      biteWidth: bite,
      biteHeight: bite,
      biteRadius: flare,
      biteFlare: flare,
      dropWidth: drop,
      dropHeight: drop,
      dropRadius: flare,
      dropFlare: flare,
    };
  })();

  const path = size.w > 40 ? outline(size.w, size.h, cut) : "";

  /* const tight = size.w > 40 && size.w - cut.biteWidth - cut.dropWidth < 210; */

  return (
    <div ref={box} className={cn("relative", className)}>
      {/* The film, cut to the card's outline.

          The clip is on the wrapper, exactly as it was for the picture, so what
          is playing does not have to know the card has pieces taken out of it.

          Four attributes, and every one of them is load-bearing. `muted` is not
          a preference here: a browser will refuse to autoplay anything that can
          make a noise, so without it the card shows a still frame and a play
          button. `playsInline` keeps it in the card on an iPhone rather than
          throwing it into the system fullscreen player. `loop` is what makes it
          a surface rather than a clip that ends.

          No controls, and it is hidden from anything reading the page out:
          there is nothing in it to hear, nothing in it to pause for, and nothing
          said in it that is not said in words elsewhere on the page. A silent
          decorative loop announced to a screen reader is noise. */}
      <div
        aria-hidden
        className="artwork absolute inset-0 overflow-hidden bg-canvas"
        style={{ clipPath: path ? `path("${path}")` : undefined }}
      >
        <video
          ref={film}
          src={FILM}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="size-full object-cover"
        />
      </div>

      {/* The card in the bottom left, standing in the bite.

          A picture rather than a button now. It advanced the carousel before,
          and a control that still looks pressable while the thing it drove is
          commented out is worse than no control - so it keeps the pictures and
          gives up the press.

          The plate underneath is the project's own tone, so the shape is there
          in the right colour before the file arrives. */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0"
        style={{ width: cut.biteWidth - 14, height: cut.biteHeight - 14 }}
      >
        <span
          /* No border. The bite around it is already the outline, and a second
             one a few pixels inside reads as a sticker on the card rather than
             as the thing the card was cut back for. */
          className="artwork relative block size-full overflow-hidden rounded-[18px]"
          style={{ backgroundColor: PROJECTS[at].tone }}
        >
          <Image
            key={PROJECTS[at].id}
            src={PROJECTS[at].image}
            alt=""
            fill
            quality={100}
            sizes="240px"
            className="object-cover"
          />
        </span>
      </div>

      {/* ----------------------------------------------------------------
          The carousel, kept.

          Everything below is the card as it was before the film: the two
          pictures crossing over, the arrows in the notch, the next project in
          the bite, and the name across the bottom edge. It is commented rather
          than deleted so putting it back is uncommenting rather than rewriting -
          along with its imports at the top of this file, its state and clock
          above, and the two zeroes in the cut.

      <AnimatePresence initial={false}>
        <motion.div
          key={shown.id}
          layoutId={"shot-" + shown.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => setOpen(shown)}
          role="button"
          tabIndex={-1}
          aria-hidden
          className="artwork absolute inset-0 cursor-pointer overflow-hidden"
          style={{
            backgroundColor: shown.tone,
            clipPath: path ? "path(...)" : undefined,
          }}
        >
          <Image
            src={shown.image}
            alt={shown.alt}
            fill
            quality={100}
            preload
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute top-0 left-1/2 flex -translate-x-1/2 justify-center"
        style={{ width: cut.barWidth, height: cut.barDepth, paddingTop: 4 }}
      >
        <div className="flex h-9 items-center gap-0.5 rounded-pill px-1.5">
          <Tool
            label="Previous project"
            onClick={() =>
              setAt((was) => (was - 1 + PROJECTS.length) % PROJECTS.length)
            }
          >
            <ArrowLeft className="size-4" />
          </Tool>
          <Tool label={"Open " + shown.name} onClick={() => setOpen(shown)}>
            <Maximize2 className="size-[15px]" />
          </Tool>
          <Tool
            label="Next project"
            onClick={() => setAt((was) => (was + 1) % PROJECTS.length)}
          >
            <ArrowRight className="size-4" />
          </Tool>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAt((was) => (was + 1) % PROJECTS.length)}
        aria-label={"Next: " + next.name}
        className="group absolute bottom-0 left-0 cursor-pointer rounded-[20px] p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-active"
        style={{ width: cut.biteWidth - 14, height: cut.biteHeight - 14 }}
      >
        <span
          className="artwork block size-full overflow-hidden rounded-[18px] transition-transform duration-300 group-hover:-translate-y-1"
          style={{ backgroundColor: next.tone }}
        >
          <Image
            src={next.image}
            alt=""
            fill
            quality={100}
            sizes="200px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </span>
      </button>

      <p
        className="absolute"
        style={
          tight
            ? {
                left: 14,
                right: cut.dropWidth + 12,
                bottom: cut.biteHeight + 10,
              }
            : {
                left: cut.biteWidth + 14,
                right: cut.dropWidth + 14,
                bottom: 26,
                textAlign: "right",
              }
        }
      >
        <span className="block text-[15px] font-bold text-white sm:text-[18px]">
          {shown.name}
        </span>
        <span className="mt-1 block font-mono text-[9.5px] font-bold tracking-[0.16em] text-white/65 uppercase">
          {shown.kind} / {shown.year}
        </span>
      </p>

      <ProjectPanel project={open} onClose={() => setOpen(null)} />

      ---------------------------------------------------------------- */}

      {/* The way on, standing in the corner the card gives up for it.
          On the page rather than on the picture, which is the rule the rest of
          this card already followed: nothing floats over the artwork, and
          anything you can press has a piece cut out for it to stand in.

          An anchor rather than a scroll handler. It works before the JavaScript
          arrives, it can be opened in a new tab or copied, and the smooth part
          is the browser's job through `scroll-behavior`. */}
      <div
        className="absolute right-0 bottom-0 flex items-center justify-center"
        style={{ width: cut.dropWidth, height: cut.dropHeight }}
      >
        <a
          href="#build"
          aria-label="Go to Build your website"
          className="group/down relative flex size-11 cursor-pointer items-center justify-center overflow-hidden rounded-pill bg-ink text-white transition-opacity hover:opacity-90 hover:[--drip:1s]"
        >
          {/* The column above the arrowhead. One class, three indexes: `--i`
              both places a dot and delays it, so the cascade always runs top to
              bottom at the spacing it is drawn at. Hidden from anything reading
              the page out, because it is the button's rhythm and not part of
              what the button says. */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden
              className="drip"
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}

          <ArrowDown
            className="relative size-[18px] transition-transform duration-300 group-hover/down:translate-y-0.5"
            strokeWidth={2.2}
          />
        </a>
      </div>

    </div>
  );
}

/* One of the three controls that stood in the notch. Held with the rest of the
   carousel.

function Tool({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-9 cursor-pointer items-center justify-center rounded-pill text-quiet transition-colors hover:bg-well hover:text-ink"
    >
      {children}
    </button>
  );
}
*/
