"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { ProjectPanel } from "./project-panel";
import { PROJECTS, type Project } from "./projects";

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
const TOOL = 36;
const BAR = TOOL * 3 + 2 * 2 + 6 * 2;

export function NotchedCard({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);
  /* Paused while somebody is on the card, or while a project is open. */
  const [held, setHeld] = useState(false);

  /* The card turns itself over.

     Five projects behind one arrow is five presses nobody makes, so it moves on
     its own - slowly enough to be read rather than watched. It stops the moment
     a pointer is on the card, because moving a picture out from under somebody
     looking at it is the one thing an auto carousel must not do, and it stops
     entirely where reduced motion is asked for. */
  useEffect(() => {
    if (held || open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const turn = window.setInterval(
      () => setAt((was) => (was + 1) % PROJECTS.length),
      5000,
    );

    return () => window.clearInterval(turn);
  }, [held, open]);

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

  const shown = PROJECTS[at];
  const next = PROJECTS[(at + 1) % PROJECTS.length];

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

    const barDepth = flare * 2;

    /* Only as wide as the bar it holds, plus a little air. Wider and the notch
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
       either side of it. This keeps a flat run past both corner arcs. */
    const barWidth = Math.min(
      Math.max(BAR + 12, Math.min(w * 0.11, 178)),
      Math.max(flare * 2 + 60, w - 2 * (radius + flare) - 24),
    );

    /* The bite is square-ish and sized to the thumbnail standing in it, with the
       same flare and the same corner as the notch above.

       The floor was 124, which is a fixed number on a card that is not: it
       dominated every width below about nine hundred, so a 280px phone card gave
       up nearly half its bottom edge to a thumbnail and left nothing beside it
       for the name. Ninety-six still holds a thumbnail worth looking at and
       leaves the rest of the edge to the words. */
    const bite = Math.max(96, Math.min(Math.min(w * 0.13, h * 0.26), 196));

    /* The corner for the way on. Square, like the bite, and only as large as
       the control standing in it needs: `flare * 2` is the smallest a cut can
       be before its two arcs overlap, and the sixteen on top of it is the air
       around a 44px target. */
    const drop = Math.max(flare * 2 + 16, Math.min(w * 0.075, 96));

    return {
      radius,
      barWidth,
      barDepth,
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

  /* Whether the bottom edge has room for the name beside the thumbnail.
     Measured off the card rather than off the window, because this card is not
     always the width of the window: with the rail docked it is a good deal
     narrower, and a media query would have called a squeezed card roomy. */
  const tight = size.w > 40 && size.w - cut.biteWidth - cut.dropWidth < 210;

  return (
    <div
      ref={box}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
      className={cn("relative", className)}
    >
      {/* The picture, and the one before it, crossing over.

          Swapping the source under one element is a cut: the new picture simply
          replaces the old one on the next frame, which is the pulse. Two
          elements, the leaving one still drawn underneath while the arriving one
          comes up over it, is a dissolve - and at nearly a second it reads as
          the card turning rather than as a slide changing. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={shown.id}
          layoutId={`shot-${shown.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          /* The picture opens it too. The control in the notch says the card
             can be opened; the card itself is what somebody actually presses,
             and a picture that fills the screen and does nothing when pressed
             reads as broken rather than as decoration. */
          onClick={() => setOpen(shown)}
          role="button"
          tabIndex={-1}
          aria-hidden
          className="artwork absolute inset-0 cursor-pointer overflow-hidden"
          style={{
            backgroundColor: shown.tone,
            clipPath: path ? `path("${path}")` : undefined,
          }}
        >
        {/* `preload` rather than the deprecated `priority`: this is the largest
            thing on the landing page and must not be lazy loaded. The clip is on
            the parent, so the picture is cut to the notches without knowing they
            exist. */}
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

      {/* The bar, standing in the top of the cut. No border on it: the cut is
          already the outline, and a second one drawn a few pixels inside reads
          as a badge stuck over the notch rather than as the thing the notch was
          made for. */}
      <div
        className="absolute top-0 left-1/2 flex -translate-x-1/2 justify-center"
        style={{ width: cut.barWidth, height: cut.barDepth, paddingTop: 4 }}
      >
        {/* Nothing behind it. The notch is already a shape cut out of the
            card, so the controls standing in it need no ground of their own -
            a pill drawn there as well is a second shape inside the first. */}
        <div className="flex h-9 items-center gap-0.5 rounded-pill px-1.5">
        <Tool
          label="Previous project"
          onClick={() =>
            setAt((was) => (was - 1 + PROJECTS.length) % PROJECTS.length)
          }
        >
          <ArrowLeft className="size-4" />
        </Tool>
        <Tool label={`Open ${shown.name}`} onClick={() => setOpen(shown)}>
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

      {/* What is coming next, standing in the bite. */}
      <button
        type="button"
        onClick={() => setAt((was) => (was + 1) % PROJECTS.length)}
        aria-label={`Next: ${next.name}`}
        className="group absolute bottom-0 left-0 cursor-pointer rounded-[20px] p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-active"
        style={{ width: cut.biteWidth - 14, height: cut.biteHeight - 14 }}
      >
        <span
          /* No border. The bite around it is already the outline, and a second
             one a few pixels inside reads as a sticker on the card rather than
             as the thing the card was cut back for. */
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

      {/* Which project this is, said in words rather than left to the picture.

          Bounded on both sides, which it was not: set from the right edge alone
          with nothing holding its left, a long name simply ran on until it was
          underneath the thumbnail - two things reading as one and neither
          legible. Now it is penned between the two cuts and wraps instead.

          On a narrow card there is no room between them worth having, so it
          moves above the bite and takes the width. Squeezed into the strip
          beside a thumbnail on a phone, four words become six lines. */}
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

      {/* The way on, standing in the corner the card gives up for it.
          On the page rather than on the picture, which is the rule the toolbar
          and the thumbnail already follow: nothing floats over the artwork, and
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

      <ProjectPanel project={open} onClose={() => setOpen(null)} />
    </div>
  );
}

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
