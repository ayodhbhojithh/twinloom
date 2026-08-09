"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
} from "lucide-react";

import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

import { Ballpit } from "./ballpit";
import { GradientWaves } from "./gradient-waves";
import { ProjectPanel } from "./project-panel";
import { WaveDots } from "./wave-dots";
import { HERO_SLIDES } from "./hero-slides";
import { type Project } from "./projects";

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
/**
 * The bar in the notch, measured rather than guessed.
 *
 * Three 36px controls, the plate's own padding, and the air either side. The
 * notch is sized from this, so it can never come out narrower than the thing
 * standing in it - which is what put three arrows outside their own cut on a
 * phone.
 */
const TOOL = 36;
const BAR = TOOL * 3 + 2 * 2 + 6 * 2;

export function NotchedCard({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);

  /* No clock. The card turns when somebody turns it - the arrows, the thumbnail
     and the keyboard all do it - and nothing moves it on its own. A carousel
     that advances by itself takes the picture out from under whoever is looking
     at it, and the first slide here is a film, which is motion enough. */

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

  /* const shown = HERO_SLIDES[at];
     const next = HERO_SLIDES[(at + 1) % HERO_SLIDES.length]; */

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

    /* Except the notch, which takes its curve from what stands in it.

       A notch cannot be shallower than twice its own flare: that is where its
       two arcs meet, and any less leaves a straight wall between them. So depth
       and curve are one number, and taking the card's flare gave a notch
       sixty-eight deep on a tall screen to hold a bar forty high - twenty-eight
       pixels of nothing, cut out of the top of the picture.

       This is the same argument the width below already makes. The floor is the
       thing standing in it, measured, not a fraction of the card. Held under the
       card's own flare as well, so on a short screen where the two agree the
       notch is drawn with the same curve as the bite and the corner. */
    const barFlare = Math.min(flare, (TOOL + 12) / 2);
    const barDepth = barFlare * 2;

    /* Only as wide as the bar it holds, plus a little air. Wider and the notch
       stops being a place for something and becomes a shape in its own right.

       The floor is that bar, measured, not a fraction of the card: a fraction of
       a narrow card is narrower than the thing standing in it, and the bar ended
       up hanging over the card's own top edge on a phone. The cap is the other
       end of the same argument - a notch stops reading as one when there is no
       edge left either side of it. */

    const barWidth = Math.min(
      Math.max(BAR + 12, Math.min(w * 0.11, 178)),
      Math.max(flare * 2 + 60, w - 2 * (radius + flare) - 24),
    );

    /* The corner for the way on. Square, like the bite, and only as large as
       the control standing in it needs: `flare * 2` is the smallest a cut can
       be before its two arcs overlap, and the sixteen on top of it is the air
       around a 44px target. */
    const drop = Math.max(flare * 2 + 16, Math.min(w * 0.075, 96));

    /* The bite, sized to the thumbnail standing in it, with the same flare and
       the same corner as the notch above.

       Wider than it is tall, by a quarter. The height is what the card can give
       up out of its bottom edge, and that is the number to be careful with; the
       width has the whole run to the corner cut to play with, and every picture
       it holds is landscape. Square, the thumbnail was cropping a 16:9 frame to
       a 1:1 hole and throwing away the sides of the very thing it is previewing.

       Capped so it still leaves the corner cut at the other end and enough card
       between the two that they read as two cuts rather than one long one. */
    const bite = Math.max(96, Math.min(Math.min(w * 0.13, h * 0.26), 196));
    const biteWidth = Math.min(
      bite * 1.25,
      Math.max(bite, w - drop - 2 * (radius + flare) - 24),
    );

    return {
      radius,
      barWidth,
      barDepth,
      barRadius: barFlare,
      barFlare: barFlare,
      biteWidth,
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

  /* The card's own side inset, from its width rather than a breakpoint: this is
     a surface that fills the window, so what it can afford at the sides is a
     question about the surface and not about the class of device. */
  const pad = Math.max(22, Math.min(size.w * 0.045, 72));

  const shown = HERO_SLIDES[at];

  /* Which screens stand on the dotted surface. One of the three does, and it is
     asked once rather than the view name being repeated at each of the places
     that need to know it. */
  const onField = shown.view === "wave";
  const next = HERO_SLIDES[(at + 1) % HERO_SLIDES.length];

  /* The measurement that placed the name on the picture went with the name. It
     worked out whether the bottom edge had room for it beside the thumbnail, and
     with nothing set over the artwork there is nothing left to place. */

  return (
    <div ref={box} className={cn("relative", className)}>
      {/* The slide, cut to the card's outline, and the one before it still
          drawn underneath while they cross.

          Swapping the source under one element is a cut - the new picture simply
          replaces the old on the next frame. Two elements crossing over is a
          dissolve, and at nearly a second it reads as the card turning rather
          than as a slide changing.

          A slide with no picture draws its tone and nothing else. Two of the
          three are waiting for artwork, and `image` is empty on them rather than
          borrowed from elsewhere on the site - so the card has to be able to be
          a colour. Guarded rather than left to `next/image`, which is handed an
          empty `src` otherwise and throws. */}
      {/* The first screen: the wave.

          Drawn outside the slides rather than inside them.

          It was inside the layer keyed on the slide's id, so every press of an
          arrow unmounted the canvas and built another one: a WebGL-free redraw,
          but still a fresh context, a fresh lattice and a restarted clock. What
          that looked like was a flash and then the same picture - which is most
          of why pressing an arrow appeared to do nothing.

          Out here it persists, and the slide moves it instead. Each slide stands
          at a different place in the same swell, and the loop eases to it, so an
          arrow rolls the surface rather than swapping it. */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden bg-field"
        style={{ clipPath: path ? `path("${path}")` : undefined }}
      >
        {onField ? (
          <WaveDots className="absolute inset-0" phase={at * 1.9} />
        ) : null}

        {/* And the middle of it taken back for the type.

            The field runs across the whole card, and a headline set over moving
            dots is a headline read twice. This is the card's own white returning
            under the words - so the drawing is full width and the sentence is
            still on paper.

            It came in from the left while the words were left. They are centred
            now, so it is a radial out of the middle: a wash that starts at one
            edge and a block of type in the centre of the card are two different
            compositions arguing.

            Thinner than it was, and wider. The field now covers the whole card
            rather than sitting in the middle of it, so the wash is no longer
            allowed to be white - it never reaches opaque anywhere, and the dots
            run under the type instead of stopping at it. What it gives up in
            strength it takes back in reach: it has to cover a claim running
            most of the card, a lead under it and two buttons, so the ellipse is
            two thirds of the width rather than four tenths and its last stop is
            almost at the edge. A small hard wash leaves a hole in the picture; a
            large soft one is weather.

            Its middle is nearly white all the same. The field is dense enough
            now that a sentence set straight on it is a sentence read twice, and
            legibility is not the thing to trade for a few more dots - so the
            core holds and the fade does the work of putting them back.

            A gradient rather than a panel, either way: an edge here would be a
            box drawn round the words, and the whole point is that there is no
            box. */}
        {onField ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 68% 62% at 50% 48%, color-mix(in oklab, var(--color-field) 94%, transparent) 0%, color-mix(in oklab, var(--color-field) 84%, transparent) 32%, color-mix(in oklab, var(--color-field) 46%, transparent) 62%, transparent 88%)",
            }}
          />
        ) : null}

        {/* The second screen: the water, full bleed and nothing over it.

            No claim, no buttons, and no white gradient taking part of the card
            back. This screen is a picture rather than a page with a picture
            behind it, and a sentence set across the middle of it would make it a
            background. What the card is asking for is said on the first screen
            and again in the header. */}
        {shown.view === "waves" ? (
          <GradientWaves
            className="absolute inset-0"
            horizonColor="#00b4e3"
            waveColor="#0087ff"
            crestColor="#0098ff"
            speed={0.5}
            amplitude={2.05}
            waveScale={0.85}
            waveRatio={0.9}
            swell={35}
            turbulence={20.5}
            tilt={1.11}
            zoom={1}
            height={5.5}
            fogDepth={15}
            detail="medium"
            brightness={0.5}
            opacity={1}
            mouseInteraction
            parallaxStrength={0.5}
            grain
            grainIntensity={0.05}
          />
        ) : null}

        {/* The third screen: the pit, and nothing over it either.

            No gravity. With it, every ball ends up in a heap along the bottom
            edge within two seconds and the top two thirds of the card is white -
            which is a picture of a pile, and this is meant to be a picture of a
            field. At nought they bounce off all four walls instead and fill the
            card, and the cursor cuts a hole through them.

            Friction at one for the same reason: anything less and the whole
            field slows to a stop after half a minute, which is a screen that
            looks broken to the second person who arrives. It cannot run away
            either, because `maxVelocity` is a hard clamp and the walls take five
            per cent at every bounce.

            `followCursor` off, which does not mean the cursor does nothing. It
            only stops sphere zero being drawn. That sphere is still there in the
            physics, still pulled to wherever the pointer is, and still shoving
            everything out of its way - and it still carries the light, so the
            field brightens where the cursor is. What goes is the ball stuck to
            the pointer, which reads as a cursor somebody has decorated.

            Two colours, and both of them on every ball: the list is painted
            down the sphere the balls share - first at the foot, last at the
            crown - so each one carries the mark's blue running into its green
            rather than being flatly one or the other. A field of flat colours is
            a bag of sweets; a field of one gradient is a material.

            Then under a fifth of them on five gradients of their own - yellow,
            orange, red, a green that is not the mark's and a blue that is not
            either - taken in turn, so each is about a twenty-fifth of the field.
            The last two are the point of the other three: a red beside a field
            of blue-green is a warning light, and a red beside a red-orange-
            yellow-green-blue scattering is one of the colours. Gradients rather than flat
            colours, because a flat ball beside a graded one reads as a ball that
            has not finished loading. Few of them, because the point of an
            exception is to be one: enough to stop the field being a swatch, and
            not so many that the two colours that are ours stop being what the
            card is made of.

                        The point light takes the middle of the ramp, so the colour the
            cursor drags around the field is the one between the two rather than
            either end of them. */}
        {shown.view === "balls" ? (
          <Ballpit
            className="absolute inset-0"
            count={220}
            gravity={0}
            friction={1}
            wallBounce={0.95}
            followCursor={false}
            colors={[0x2a98fe, 0x06dbaf]}
            accents={[
              [0xf5c518, 0xffa41a],
              [0xff8a1a, 0xff4d1a],
              [0xff5a5a, 0xe11d38],
              [0x3ddc84, 0x0f9d58],
              [0x4aa8ff, 0x1663d6],
            ]}
            accentShare={0.18}
            ambientColor={0xffffff}
            ambientIntensity={1}
            lightIntensity={190}
            minSize={0.3}
            maxSize={0.7}
            size0={1.1}
            maxVelocity={0.05}
            maxZ={1.6}
          />
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key={shown.id}
          layoutId={`shot-${shown.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => setOpen(shown)}
          role="button"
          tabIndex={-1}
          aria-hidden
          /* `artwork` only where there is artwork.

             That class lays two things over whatever is inside it: an ink
             gradient graded from a third to nearly nine tenths, and a layer of
             grain. Both exist to hold a photograph down so type can sit on it.
             Over a white surface with no picture in it they do not soften
             anything - they simply paint the card dark grey and dust it. */
          className={cn(
            "absolute inset-0 cursor-pointer overflow-hidden",
            shown.image && "artwork",
          )}
          style={{
            /* Only where there is a picture to hold up.

               This layer is the crossfade: two of it exist while one slide
               replaces another, and its `tone` is the colour a picture arrives
               on. With no picture, that tone is white and it was an opaque sheet
               laid over the drawing - which is why the field vanished, and why
               pressing an arrow flashed it: the incoming sheet starts at nought
               opacity and rises, so for half a second the drawing showed through
               its own cover.

               The card's white now belongs to the layer underneath, which is
               where a card's ground belongs. */
            backgroundColor: shown.image ? shown.tone : undefined,
            clipPath: path ? `path("${path}")` : undefined,
          }}
        >
          {shown.image ? (
            <Image
              src={shown.image}
              alt={shown.alt}
              fill
              quality={100}
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* The bar, standing in the top of the cut. No plate behind it: the notch
          is already the outline, and a pill drawn inside it is a second shape
          inside the first. */}
      <div
        className="absolute top-0 left-1/2 z-10 flex -translate-x-1/2 justify-center"
        style={{ width: cut.barWidth, height: cut.barDepth, paddingTop: 4 }}
      >
        <div className="flex h-9 items-center gap-0.5 rounded-pill px-1.5">
          <Tool
            label="Previous project"
            onClick={() =>
              setAt(
                (was) => (was - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
              )
            }
          >
            <ArrowLeft className="size-4" />
          </Tool>
          <Tool label={`Open ${shown.name}`} onClick={() => setOpen(shown)}>
            <Maximize2 className="size-[15px]" />
          </Tool>
          <Tool
            label="Next project"
            onClick={() => setAt((was) => (was + 1) % HERO_SLIDES.length)}
          >
            <ArrowRight className="size-4" />
          </Tool>
        </div>
      </div>

      {/* Each screen is its own arrangement, not one arrangement with the
          contents changed. There is one so far - the wave, below - and the other
          two are white cards waiting for designs of their own. */}
      {/* What the card is for, inside the card.

          The words and the two ways in were a band above this, and the band is
          gone: a headline over a full height picture leaves two things half
          read, and the card is the page.

          Left, and only left. The field is the whole card rather than a panel
          beside them, so what the measure is doing is leaving the right of it
          clear - a sentence set across a moving surface is a sentence read
          twice.

          Held clear of all three cuts by the numbers that made them. The notch
          is in the top edge and the two cuts are in the bottom corners, so the
          top inset clears the bar and the bottom one clears whichever of the two
          is deeper - measured rather than picked, or a change to any cut leaves
          a line of type sitting in it. */}
      {onField ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          style={{
            paddingTop: cut.barDepth + 12,
            paddingBottom: Math.max(cut.biteHeight, cut.dropHeight) + 12,
            paddingLeft: pad,
            paddingRight: pad,
          }}
        >
          {/* Centred, and about half the card wide.

            The field runs under the whole surface either way; this only decides
            how much of it the words are allowed to cross. Wider than the block
            was when it stood on the left, because a centred measure is read from
            both ends and a narrow one in the middle of a wide card reads as a
            column somebody forgot to fill. */}
          <div className="w-full text-center">
            <div className="pointer-events-auto min-w-0">
              {/* The claim, and the half of it that is the offer set in the
                mark's own gradient. The same device the name in the header
                uses, for the same reason: it is one sentence, and the colour
                marks which part of it is the promise rather than adding a
                second idea. */}
              {/* The slide's own claim, not the card's.

                It was one sentence written into the markup, so the arrows moved
                the drawing and nothing else - the page said the same thing on
                all four screens, which is the fault. Each slide carries its own
                now, and each is a different way in to the same offer: a front
                door that argues four different things is four front doors.

                Keyed on the slide, so React replaces the words rather than
                editing them, and they arrive with the fade below.

                Seventeen characters.

                Fifteen was set for a card whose right half was a picture, and it
                was the thing breaking this into four lines rather than the
                column it sits in - a four line claim reads as a paragraph
                somebody has emboldened. Nineteen went the other way and left the
                type running most of the card. Seventeen is where it holds three
                lines without reaching for the field beside it. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={shown.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
                >
                  <h1 className="mx-auto max-w-[38ch] text-[clamp(36px,5.6vw,82px)] leading-[1.02] font-extrabold tracking-[-0.045em] text-ink">
                    {shown.claim?.[0]}
                    <span className="thread-text block">
                      {shown.claim?.[1]}
                    </span>
                  </h1>

                  <p className="mx-auto mt-5 max-w-[92ch] text-[16px] leading-[1.6] text-quiet sm:text-[17.5px]">
                    {shown.lead}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Two ways in, and they are the only two. The loud one carries the
                gradient; the quiet one is drawn as an outline rather than a
                second fill, so the pair reads as one choice with a default
                rather than as two buttons of equal weight. */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                <Link
                  href={ROUTES.build}
                  className="group/way thread-fill inline-flex items-center gap-2 rounded-pill px-5 py-3 text-[14.5px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
                >
                  Build your website
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5"
                    strokeWidth={2.4}
                  />
                </Link>

                <Link
                  href={ROUTES.book}
                  className="group/way inline-flex items-center gap-2 rounded-pill border border-hair bg-field/70 px-5 py-3 text-[14.5px] font-semibold whitespace-nowrap text-ink backdrop-blur-sm transition-colors hover:border-ink"
                >
                  Book a meeting
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5 group-hover/way:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* The next slide, standing in the bite.

          A pair of buttons stood here for a moment and they are gone again: the
          two ways into the site are already in the header, in the sheet behind
          it and at the foot of the page, and the one cut on this card with room
          for something is better spent showing what is coming than repeating
          them a fourth time. */}
      <button
        type="button"
        onClick={() => setAt((was) => (was + 1) % HERO_SLIDES.length)}
        aria-label={`Next: ${next.name}`}
        className="group absolute bottom-0 left-0 z-10 cursor-pointer rounded-[20px] p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-active"
        style={{ width: cut.biteWidth - 14, height: cut.biteHeight - 14 }}
      >
        <span
          /* No border. The bite around it is already the outline, and a second
             one a few pixels inside reads as a sticker on the card rather than
             as the thing the card was cut back for. */
          className={cn(
            "block size-full overflow-hidden rounded-[18px] transition-transform duration-300 group-hover:-translate-y-1",
            next.image && "artwork",
          )}
          style={{ backgroundColor: next.tone }}
        >
          {/* A slide with no artwork shows the colour it will arrive on. */}
          {next.image ? (
            <Image
              src={next.image}
              alt=""
              fill
              quality={100}
              sizes="200px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : null}
        </span>
      </button>

      {/* No caption on the picture.

          The project's name and its trade were set over the bottom right of the
          artwork, and they are gone from it. What they were doing was labelling
          a photograph that is already the whole page - and the panel that opens
          from the corner says the same two things properly, with the rest of the
          project under them. A line of type over an image is a caption; the same
          line inside the thing it describes is a title. */}

      <ProjectPanel project={open} onClose={() => setOpen(null)} />

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

/** One of the three controls that stand in the notch. */
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
