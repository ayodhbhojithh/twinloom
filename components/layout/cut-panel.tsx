"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import Image from "next/image";

import { outline, type Cuts } from "@/components/home/notched-card";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   A cut surface, for anything that is not a step.

   The landing card states the rule: one large surface, and anything you can
   press stands in a piece cut out of it rather than floating on top of it. The
   build screens follow it; this is the same shell for the parts of the site
   that are not the tool - the footer today, and whatever else wants the shape.

   The arcs are the landing card's, imported rather than copied, because two
   sets of these numbers would curve by different amounts within a week.

   The cut is on a layer of its own behind the content, and the slots that stand
   in the cuts sit above it. Clipping the card itself would clip the words in
   it, and content painted over the cuts swallows every press meant for the
   controls standing in them.
--------------------------------------------------------------------------- */

/**
 * How a picture stops being a picture and becomes part of the surface.
 *
 * Nine stops rather than three, and they follow a curve rather than a straight
 * line: a linear fade over a short distance reads as a band with an edge on
 * either side of it, which is the one thing a blend must not have. Whichever
 * edge the picture enters from, the other three are the card's own, and an edge
 * that is already the end of the card wants nothing on top of it.
 *
 * Over the first third of the picture, not most of it. It ran to eighty-six per
 * cent, which is a wash across nearly the whole thing - the picture only reached
 * full strength in the last sliver, so what was on screen was a faded picture
 * with a slightly less faded corner. That is defensible for a photograph the
 * words have to be read over and wrong for anything anybody is meant to look at.
 *
 * The join still has no edge, because the same nine stops are simply closer
 * together: transparent at the edge the picture enters from, full by a third,
 * and the two thirds after that are the picture as it was made.
 */
const fade = (to: string) =>
  `linear-gradient(to ${to}, transparent 0%, rgba(0,0,0,0.04) 4%, rgba(0,0,0,0.12) 8%, rgba(0,0,0,0.26) 12%, rgba(0,0,0,0.44) 16%, rgba(0,0,0,0.63) 21%, rgba(0,0,0,0.8) 26%, rgba(0,0,0,0.93) 30%, black 36%)`;

const MASK = { across: fade("right"), up: fade("bottom") } as const;

export function CutPanel({
  toolbar,
  aside,
  corner,
  foot,
  footIn = "band",
  bar = "auto",
  image,
  tone = "canvas",
  className,
  children,
}: {
  /** Stands in the notch at the top: what the surface is. */
  toolbar?: React.ReactNode;
  /** Stands in the bite at the bottom left. */
  aside?: React.ReactNode;
  /** Stands in the corner cut at the bottom right: the way on. */
  corner?: React.ReactNode;
  /**
   * The band along the bottom, between the two cuts. For the small print that
   * belongs on the same line as them rather than above an empty strip.
   */
  foot?: React.ReactNode;
  /**
   * Where the foot goes: along the bottom as a band, or standing in a notch cut
   * into the bottom edge.
   *
   * A band takes as many lines as it is given, which is what small print needs.
   * A notch is one line and no more - right for a label naming what the surface
   * is, wrong for a paragraph.
   */
  footIn?: "band" | "notch";
  /**
   * How much of the top edge the notch takes.
   *
   * `auto` is a label or a few discs. `wide` is for a notch that has to hold
   * a run of controls - a step rail, say - and it takes about half the edge
   * rather than a fifth of it. Still bounded by what the surface can give: a
   * cut wider than its own box folds the path inside out.
   */
  bar?: "auto" | "wide";
  /**
   * A picture for the whole surface, cut to the same outline.
   *
   * The landing card's arrangement: the image is not in the card, it is the
   * card. What keeps the words readable is a wash of the surface's own colour
   * running in from the left, so the two are one thing rather than a panel with
   * a photograph stuck to one side of it.
   */
  image?: string;
  tone?: "canvas" | "field";
  className?: string;
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

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

  /* Below this there is not enough width left between two cuts to put anything
     readable between them, so the foot gives up and goes back into the content
     above it. */
  const roomBelow = size.w >= 760;
  const notch = Boolean(foot) && footIn === "notch" && roomBelow;
  const band = Boolean(foot) && footIn === "band" && roomBelow;

  /* One flare and one radius, and every cut is built from them. A cut is
     exactly two flares deep, because that is where its two arcs meet - any less
     and a straight wall appears between them, any more and it is deeper than
     whatever stands in it needs.

     Everything is held inside what the surface can actually give: on a narrow
     screen a bar plus two flares can want more room than the top edge has, and
     a path that overruns its own box folds inside out. */
  const cut: Cuts = ((): Cuts => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    const radius = Math.max(20, Math.min(w * 0.02 + 14, 34));
    const flare = Math.max(20, Math.min(h * 0.035, 28));

    /* The notch draws its arcs tighter than the corners do.

       A cut is exactly as deep as its flare plus its corner radius, because
       that is where the two arcs meet, so the only way to make the notch
       shallower is to curve it harder. Simply taking depth off it would put a
       straight wall down each side instead.

       The bottom cuts keep the full flare: they hold a 44px disc and have the
       depth to spend on it. The notch holds a 40px plate and was being cut to
       fifty-six, so a third of it was empty surface under the words. */
    /* A wide notch is a deeper one.

       Depth is not a free number here: a cut is exactly as deep as its flare
       plus its corner, because that is where its two arcs meet, so the only
       way to make it deeper is to draw the arcs larger. Taking depth off any
       other way puts a straight wall down each side.

       It has to be deeper because what stands in a wide notch is a run of
       steps two lines tall - a mark and a name - and at 44px the names were
       finishing flush with the floor of the cut. */
    const barCurve =
      bar === "wide" ? Math.min(flare * 1.4, 30) : Math.min(flare, 22);

    const barDepth = toolbar ? barCurve * 2 : 0.01;
    const want =
      bar === "wide"
        ? Math.min(Math.max(w * 0.46, 440), 700)
        : Math.min(w * 0.22, 260);

    const barWidth = toolbar
      ? Math.min(
          Math.max(barCurve * 2 + 120, want),
          Math.max(barCurve * 2 + 60, w - 2 * (radius + barCurve) - 8),
        )
      : 0.01;

    /* One size for both bottom cuts. Two cuts of different sizes on one
       surface read as two decisions rather than one. */
    const nook = Math.max(flare * 2 + 20, Math.min(w * 0.07, 92));

    return {
      radius,
      barWidth,
      barDepth,
      barRadius: toolbar ? barCurve : 0.01,
      barFlare: toolbar ? barCurve : 0.01,
      biteWidth: aside ? nook : 0.01,
      biteHeight: aside ? nook : 0.01,
      biteRadius: aside ? flare : 0.01,
      biteFlare: aside ? flare : 0.01,
      dropWidth: corner ? nook : 0.01,
      dropHeight: corner ? nook : 0.01,
      dropRadius: corner ? flare : 0.01,
      dropFlare: corner ? flare : 0.01,
      footWidth: notch ? Math.min(Math.max(w * 0.24, 200), 320) : 0,
      footDepth: notch ? flare * 2 : 0,
      footRadius: notch ? flare : 0,
      footFlare: notch ? flare : 0,
    };
  })();

  const path = size.w > 40 ? outline(size.w, size.h, cut) : "";

  /* The room to the left of the notch.

     The bar is centred and narrow, so on a wide surface there is a column of
     empty top edge either side of it. The heading belongs in the left one -
     level with the notch rather than below it - and the only thing standing
     between the two is width. Below the floor there is not enough of it to
     hold a heading, and the content goes back under the bar instead. */
  const pad = Math.max(22, Math.min(size.w * 0.035, 56));
  const beside = Boolean(toolbar) && (size.w - cut.barWidth) / 2 - pad >= 240;
  const headRoom = beside
    ? `${Math.round((size.w - cut.barWidth) / 2 - pad - 16)}px`
    : "62ch";

  /* Below this there is not enough width left between two cuts to put anything
     readable between them, so the band gives up and the foot goes back into
     the content above it. */

  return (
    <div ref={box} className={cn("relative", className)}>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0",
          tone === "field" ? "bg-field" : "bg-canvas",
        )}
        style={{ clipPath: path ? `path("${path}")` : undefined }}
      />

      {image ? (
        /* Clipped to the surface's own outline, so whatever is inside it takes
           the notch and the corners with it. */
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: path ? `path("${path}")` : undefined }}
        >
          {/* The same picture, entering from whichever edge the card has room
              on. Two elements rather than one, because the difference is the
              direction the mask runs and a mask cannot be swapped by
              breakpoint.

              Below `lg` it comes up from the bottom. A card that narrow has no
              second column to give a picture - held to the right it would be a
              strip behind the words - so it fills the foot instead, where the
              text has already finished and the surface was empty. This is why
              the card had no picture at all on a phone: it was `lg:block` and a
              phone simply got the white.

              At `lg` the card is wide enough to hold words and a picture side
              by side, so it takes the right fifty five and fades in from its
              own left edge. Stretched across the whole width and hidden under a
              wash it was still a full width picture - the left of it was being
              paid for and then painted over. */}
          <div className="absolute inset-x-0 bottom-0 h-[54%] lg:hidden">
            <Image
              src={image}
              alt=""
              fill
              priority
              /* The plate is the largest thing on the surface and the only
                 thing anybody looks at rather than reads. 75 is right for a
                 photograph behind type; this is a drawing with flat colour and
                 fine linework in it, and JPEG artefacts on flat colour are
                 exactly what shows. */
              quality={100}
              sizes="(max-width: 1023px) 100vw, 0px"
              className="object-cover object-center"
              style={{
                maskImage: MASK.up,
                WebkitMaskImage: MASK.up,
              }}
            />
          </div>

          <div className="absolute inset-y-0 right-0 hidden w-[55%] lg:block">
            <Image
              src={image}
              alt=""
              fill
              priority
              /* The plate is the largest thing on the surface and the only
                 thing anybody looks at rather than reads. 75 is right for a
                 photograph behind type; this is a drawing with flat colour and
                 fine linework in it, and JPEG artefacts on flat colour are
                 exactly what shows. */
              quality={100}
              sizes="(min-width: 1024px) 55vw, 0px"
              className="object-cover object-center"
              style={{
                maskImage: MASK.across,
                WebkitMaskImage: MASK.across,
              }}
            />
          </div>

          {/* A wash of the surface's own white, over both picture layers.

              It has to come after them in the markup. Sat between the two it
              covered the one meant for a phone and was painted over by the one
              meant for a laptop, so the desktop card kept a full strength
              picture and only the phone got the wash.

              The mask already thins the photograph out towards the words; this
              puts what is left behind the page rather than on top of it, and
              costs nothing where the mask has taken the picture away. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-field/35"
          />
        </div>
      ) : null}

      {toolbar ? (
        <div
          className="absolute top-0 left-1/2 z-20 flex -translate-x-1/2 items-start justify-center"
          style={{ width: cut.barWidth, height: cut.barDepth, paddingTop: 2 }}
        >
          {toolbar}
        </div>
      ) : null}

      {aside ? (
        <div
          className="absolute bottom-0 left-0 z-20 flex items-center justify-center"
          style={{ width: cut.biteWidth, height: cut.biteHeight }}
        >
          {aside}
        </div>
      ) : null}

      {notch ? (
        <div
          className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center"
          style={{ width: cut.footWidth, height: cut.footDepth }}
        >
          {foot}
        </div>
      ) : null}

      {corner ? (
        <div
          className="absolute right-0 bottom-0 z-20 flex items-center justify-center"
          style={{ width: cut.dropWidth, height: cut.dropHeight }}
        >
          {corner}
        </div>
      ) : null}

      <div
        className="relative z-10"
        style={{
          /* Under the notch, not a whole band under it. The bar is only as
             deep as its own arcs, and on a wide surface it leaves most of the
             top edge free - so the heading starts where the cut ends rather
             than clearing the whole width of it. */
          /* Beside the notch, the top inset is the side inset: the heading is
             then the same distance from the top edge as it is from the left
             one, which is the only reading of "the corner" that holds at every
             width. Under the notch there is no choice - the bar owns that band
             - so it clears the bar and keeps a hair of air below it.
             With no notch at all there is nothing to clear and nothing to sit
             beside, so it is the side inset again. It used to fall through to
             the twelve meant for clearing a bar, which put the content of a
             plain surface a third of the way in from the sides and almost
             against the top. */
          paddingTop: toolbar ? (beside ? pad : cut.barDepth + 12) : pad,
          /* What the heading may take before it would run under the bar. */
          ["--notch-free" as string]: headRoom,
          /* How far the content is held off the edge, and how the edge turns.
             A picture that has to reach the side of the surface needs both, and
             neither is knowable from outside this component. */
          ["--panel-pad" as string]: `${Math.round(pad)}px`,
          ["--panel-radius" as string]: `${Math.round(cut.radius)}px`,
          paddingBottom: band
            ? 28
            : Math.max(
                notch ? (cut.footDepth ?? 0) + 6 : 0,
                aside ? cut.biteHeight : 0,
                corner ? cut.dropHeight : 0,
                28,
              ) + 28,
          paddingLeft: pad,
          paddingRight: pad,
        }}
      >
        {children}

        {/* Only where neither the band nor the notch took it. Without the
            second test the foot was rendered twice on a wide screen: once
            standing in the notch and once again in the content above it. */}
        {foot && !band && !notch ? <div className="mt-9">{foot}</div> : null}
      </div>

      {/* The bottom band. Inset by the width of each cut, so it runs between
          them rather than under them, and at least as tall as they are so the
          surface never ends above its own corners. */}
      {band ? (
        <div
          className="relative z-10 flex items-center"
          /* The band starts where the content starts. Insetting it by the
             width of a cut instead lines it up with nothing at all, and a
             second left edge a few pixels off the first is worse than no band.
             Only the side that actually holds a control is inset. */
          style={{
            minHeight: corner ? cut.dropHeight : 0,
            paddingLeft: aside ? cut.biteWidth + 20 : pad,
            paddingRight: corner ? cut.dropWidth + 20 : pad,
            paddingTop: 6,
            paddingBottom: 24,
          }}
        >
          {foot}
        </div>
      ) : null}
    </div>
  );
}

/** The way back up, drawn as the landing card draws its arrows. */
export function TopDisc() {
  return (
    <button
      type="button"
      aria-label="Back to the top"
      title="Back to the top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }
      className="flex size-11 cursor-pointer items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
    >
      <ArrowUp className="size-[18px]" strokeWidth={2.2} />
    </button>
  );
}
