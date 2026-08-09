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
  CalendarDays,
  Code2,
  LayoutGrid,
  Maximize2,
  PencilLine,
} from "lucide-react";

import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

import { Ballpit } from "./ballpit";
import { MarkStage } from "./mark-stage";
import { GradientWaves } from "./gradient-waves";
import { ProjectPanel } from "./project-panel";
import { SiteHeader } from "@/components/layout/site-header";

import { WaveDots } from "./wave-dots";
import { HERO_SLIDES } from "./hero-slides";
import { type Project } from "./projects";

/* ---------------------------------------------------------------------------
   A card with pieces taken out of it.

   Two things sit against the card rather than on it: a bar of controls at the
   top, and the way on at the bottom right. The card is cut back around each, and
   the cuts curve outward where they meet the edge, so the shape reads as one
   continuous surface with bites out of it rather than as rectangles overlapping.

   There were three. A thumbnail of the next slide stood in a third cut at the
   bottom left, and it went with its cut - a cut is a hole, so a cut with nothing
   in it shows the page through the corner.

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

/**
 * The header's own height, as the stylesheet sets it.
 *
 * A copy of `--nav-height`, and the only honest way to have one: this card lays
 * its screens out in JavaScript from measured pixels, and a CSS variable is not
 * a number until the browser has one. Kept beside the other measurements so the
 * day the bar changes height, both places are one screen apart.
 */
const NAV_HEIGHT = 53;

/** The other company's name, so the paragraph and the link cannot disagree. */
const SISTER = "TwinCoreTech";

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

  /* Which slide is showing, read before the geometry rather than after it.

     It used to come later, because the cuts were the same on every screen and
     the shape had no reason to know what was standing on it. The notch changed
     that: the picture screens do not cut one, so `outline` needs the view. */
  const shown = HERO_SLIDES[at];

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
  const onField = shown.view === "wave";

  const cut: Cuts = ((): Cuts => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    /* Down from a floor of twenty two and a ceiling of forty eight.

       The card fills the window now, and a corner is read against what is left
       of the page around it - there used to be a good deal of that and there is
       almost none. At forty eight the card looked like a phone in a case; at
       thirty four the edge is still soft and the shape is still a card. */
    const radius = Math.max(18, Math.min(w * 0.018 + 14, 34));

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

    return {
      radius,
      barWidth,
      barDepth,
      barRadius: barFlare,
      barFlare: barFlare,
      /* Nought, which `outline` reads as no cut at all - and the bottom left
         corner comes back as an ordinary rounded one. The numbers above are
         still worked out because the day something stands there again, what it
         has to fit inside is the argument, not a fraction of the card. */
      biteWidth: 0,
      biteHeight: 0,
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
     question about the surface and not about the class of device.

     Down from a twentieth of the width to a thirty-fifth, and capped at
     forty-four rather than seventy-two. The header inside the card sets the line
     everything else is read against - it has the page gutter and no more - and a
     screen indented twice as far as the wordmark above it reads as a second
     page inside the first. */
  const pad = Math.max(16, Math.min(size.w * 0.028, 44));

  /* How far down the card anything can start.

     The header, and nothing else. It used to be the notch plus the header,
     because the bar sat below the cut; it is level with it now and split around
     it, so the notch takes no height of its own. Every pixel here is one the
     words below move down by, and the screens are centred in what is left. */
  const head = NAV_HEIGHT + 15;

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

        {/* The fourth screen's ground. Inside the clipped layer with the other
            three drawings, so the card's outline cuts it like everything else on
            it. */}
        {shown.view === "blank" ? <DotGround /> : null}

        {/* No ground under the fifth screen.

            It had the same dot grid the fourth uses, at a third of the weight,
            and the artwork that stands on it now brings its own halftone. Two
            grids at two scales in one picture is a moire, not a texture. */}

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

        {/* And a deepening under the words.

            The mirror of the first screen's wash and it works the same way: a
            radial, no edge, and it never reaches full strength. What differs is
            which way it goes. The water is a strong blue, so bleaching a white
            hole in it to carry dark type would take a hole you could see the
            shape of - and would leave the card's two picture screens looking
            like the same screen. Deepening it instead gives white type a ground
            without taking the picture away: the swell still runs under every
            word, a shade darker where the words are. */}
        {shown.view === "waves" ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 70% 64% at 50% 48%, color-mix(in oklab, #04223d 68%, transparent) 0%, color-mix(in oklab, #04223d 52%, transparent) 34%, color-mix(in oklab, #04223d 24%, transparent) 64%, transparent 88%)",
            }}
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

        {/* And the middle taken back for the type, the way the first screen
            does it. Light ground, dark words, white wash - the pit is a field of
            pale glass and the one thing it is not is a surface you can read
            small type off. */}
        {shown.view === "balls" ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 68% 62% at 50% 48%, color-mix(in oklab, var(--color-field) 94%, transparent) 0%, color-mix(in oklab, var(--color-field) 84%, transparent) 32%, color-mix(in oklab, var(--color-field) 46%, transparent) 62%, transparent 88%)",
            }}
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

      {/* The site's header, inside the card.

          Everywhere else it is a bar across the top of the window with the page
          under it. Here the card is the window, so a bar above it would be a bar
          above the page rather than part of it - `SiteShell` renders nothing on
          this route and this renders it instead, bare: no sticky, no white
          ground of its own, no fade under it. It is standing on the card's white
          already.

          Held clear of the notch, which is centred in the same edge. The notch
          is measured, so this is measured from it rather than guessed at - a
          number here would be a number to fix the day the bar in the notch
          changes size. */}
      {/* `pointer-events-none` on the box, not on the bar inside it.

          The box runs the whole width of the top edge, and the notch with the
          three arrows in it is in the middle of that same edge. Sitting above
          them, it took every click meant for an arrow and the card stopped
          turning. The box is only here to place the bar, so it takes no clicks;
          the bar takes its own. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20"
        style={{
          /* The header's own side padding, set to the card's.

             It reads `--page-gutter`, which is the page's number and not this
             card's - so the wordmark sat nearer the edge than every line of type
             under it. Overriding it here puts the name, the claim and the
             paragraph on one left edge, which is the only alignment on this
             screen anybody will notice. */
          ["--page-gutter" as string]: `${pad}px`,
          /* And a little air above it. Level with the notch is right; touching
             the top edge of the card is not - the arrows in the cut have the
             cut's own depth around them and the bar either side of it had
             nothing. */
          paddingTop: 7,
        }}
      >
        <SiteHeader bare />
      </div>

      {/* The bar, standing in the top of the cut. No plate behind it: the notch
          is already the outline, and a pill drawn inside it is a second shape
          inside the first.

          The notch is cut on every screen, including the two that are pictures.
          It was taken off those for a while, because the notch is the one cut
          with nothing standing in it - the bite holds the thumbnail and the
          corner holds the way on, so what shows through those is that thing,
          while what shows through the notch is the page. On a white card nobody
          can tell; on the water it is a lighter rectangle in the top edge. That
          is what a cut in a card looks like, and the card is the same card on
          all three screens: worth keeping over a top edge that changes shape
          depending on what is drawn under it. */}
      <div
        className="absolute top-0 left-1/2 z-30 flex -translate-x-1/2 justify-center"
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
            paddingTop: head,
            /* The same at the foot as at the head, so the block sits in the
               middle of the card rather than in the middle of what is left after
               the cuts. It cleared whichever bottom cut was deeper, which is
               right for words on the left - they run down into the bite. These
               are centred, and both bottom cuts are in the corners, so all that
               clearance was doing was pushing a centred block above centre. */
            paddingBottom: cut.barDepth + 12,
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

      {/* The second screen's words: centred, and set light on a dark ground.

          The same arrangement as the first screen and the opposite polarity. It
          takes one way on rather than two, because the pair belongs to the
          screen making the offer and a front door that asks three times is a
          door people stop reading.

          `pointer-events-none` on everything but the link. The water answers to
          the pointer, and a block of type laid over it is a rectangle in the
          middle of the card where the swell stops moving. */}
      {shown.view === "waves" ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          style={{
            paddingTop: head,
            /* The same at the foot as at the head, so the block sits in the
               middle of the card rather than in the middle of what is left after
               the cuts. It cleared whichever bottom cut was deeper, which is
               right for words on the left - they run down into the bite. These
               are centred, and both bottom cuts are in the corners, so all that
               clearance was doing was pushing a centred block above centre. */
            paddingBottom: cut.barDepth + 12,
            paddingLeft: pad,
            paddingRight: pad,
          }}
        >
          <div className="w-full text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={shown.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
              >
                <h1 className="mx-auto max-w-[19ch] text-[clamp(40px,6.2vw,92px)] leading-[1.0] font-extrabold tracking-[-0.048em] text-white">
                  {shown.claim?.[0]}
                  <span className="thread-light block">{shown.claim?.[1]}</span>
                </h1>

                <p className="mx-auto mt-6 max-w-[60ch] text-[16.5px] leading-[1.6] text-white/85 sm:text-[19px]">
                  {shown.lead}
                </p>

                <div className="mt-7 flex justify-center">
                  {/* Solid white, because everything around it is blue. An
                      outline in white on this ground is a button you have to
                      look for. */}
                  <Link
                    href={ROUTES.services}
                    className="group/way pointer-events-auto inline-flex items-center gap-2.5 rounded-pill bg-field px-6 py-3.5 text-[16px] font-semibold whitespace-nowrap text-ink transition-opacity hover:opacity-90"
                  >
                    What we do
                    <ArrowUpRight
                      aria-hidden
                      className="size-[18px] shrink-0 transition-transform group-hover/way:translate-x-0.5 group-hover/way:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : null}

      {/* The third screen's words: centred, dark, and one way on.

          The same block as the second screen at the same sizes, set the other
          way up because the ground is the other way up. Written out rather than
          shared with it: they are two screens and not one screen with two
          pictures, and the day either wants its own measure or a second way on,
          that is an edit here rather than a condition threaded through a block
          serving both. */}
      {shown.view === "balls" ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          style={{
            paddingTop: head,
            paddingBottom: cut.barDepth + 12,
            paddingLeft: pad,
            paddingRight: pad,
          }}
        >
          <div className="w-full text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={shown.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
              >
                <h1 className="mx-auto max-w-[20ch] text-[clamp(32px,4.6vw,64px)] leading-[1.04] font-extrabold tracking-[-0.042em] text-ink">
                  {shown.claim?.[0]}
                  <span className="thread-text block">{shown.claim?.[1]}</span>
                </h1>

                <p className="mx-auto mt-5 max-w-[56ch] text-[15px] leading-[1.62] text-quiet sm:text-[16.5px]">
                  {shown.lead}
                </p>

                <div className="mt-7 flex justify-center">
                  {/* Solid ink, because everything around it is pale. The
                      outline the first screen uses for its second way in is a
                      button you have to look for on a ground like this. */}
                  <Link
                    href={ROUTES.how}
                    className="group/way pointer-events-auto inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-3 text-[14.5px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90"
                  >
                    How we work
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5 group-hover/way:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : null}

      {/* The fourth screen's words: centred on nothing at all.

          The same block again, and the only one with no drawing under it and no
          wash over it - there is nothing to take the card back from. Which is
          why this is the screen the ask goes on: it is the only one where the
          words are not competing with anything. */}
      {shown.view === "blank" ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          style={{
            paddingTop: head,
            paddingBottom: cut.barDepth + 12,
            paddingLeft: pad,
            paddingRight: pad,
          }}
        >
          <div className="w-full text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={shown.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* No logo above the claim. There is one behind it, at eight
                    times the size and made of dots, and the same mark twice on
                    one screen is the screen saying the name and then saying it
                    again in case. */}

                <h1 className="mx-auto max-w-[20ch] text-[clamp(32px,4.6vw,64px)] leading-[1.04] font-extrabold tracking-[-0.042em] text-ink">
                  {shown.claim?.[0]}
                  <span className="thread-text block">{shown.claim?.[1]}</span>
                </h1>

                <p className="mx-auto mt-5 max-w-[56ch] text-[15px] leading-[1.62] text-quiet sm:text-[16.5px]">
                  {shown.lead}
                </p>

                <div className="mt-7 flex justify-center">
                  <Link
                    href={ROUTES.build}
                    className="group/way thread-fill pointer-events-auto inline-flex items-center gap-2 rounded-pill px-5 py-3 text-[14.5px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
                  >
                    Start yours
                    <ArrowRight
                      aria-hidden
                      className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5"
                      strokeWidth={2.4}
                    />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : null}

      {/* The fifth screen: the mark staged, with the whole offer beside it.

          The long version, and the only screen here that is. The four before it
          each make one argument and open one door - right for a card that turns,
          wrong for the one somebody might not turn past. This one names the
          trades, makes the claim, says the line under it, gives the paragraph
          and puts all four ways in on the same row.

          Two columns on a wide card and one on a narrow one, and the artwork
          leads on the narrow one: a picture at the top of a phone screen says
          which company this is before the first line of type does. `order` moves
          it, so the reading order and the composition stay separate decisions.

          The buttons wrap rather than scroll. Four of them across a phone is
          four rows, which is fine - a row that scrolls sideways hides doors. */}
      {shown.view === "mark" ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center"
          style={{
            paddingTop: head,
            paddingBottom: cut.barDepth + 12,
            paddingLeft: pad,
            paddingRight: pad,
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={shown.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
              /* One rhythm down the screen, and it is worth naming because it
                 was five arbitrary numbers before: 4 between the trades and the
                 claim, 5 between the claim and the line under it, 4 again
                 between that and the paragraph, 7 before the buttons, 7 again
                 before the sister company. Tight where two things are one thing,
                 wide where one thing ends. */
              className="flex w-full flex-col gap-7"
            >
              <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
                <MarkStage className="w-[72%] max-w-[300px] shrink-0 lg:order-2 lg:w-[52%] lg:max-w-none" />

                <div className="min-w-0 text-center lg:order-1 lg:flex-1 lg:text-left">
                  {/* The trades, as a list rather than a sentence. Dots between
                    them, because a comma would make it a sentence and it is a
                    label. */}
                  <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] font-bold tracking-[0.15em] text-idx uppercase lg:justify-start">
                    {shown.kicker?.map((trade, n) => (
                      <li key={trade} className="flex items-center gap-2.5">
                        {n > 0 ? (
                          <span
                            aria-hidden
                            className="size-1 rounded-pill bg-mark"
                          />
                        ) : null}
                        {trade}
                      </li>
                    ))}
                  </ul>

                  <h1 className="mx-auto mt-4 max-w-[19ch] text-[clamp(32px,4.2vw,62px)] leading-[1.04] font-extrabold tracking-[-0.042em] text-ink lg:mx-0">
                    {shown.claim?.[0]}
                    <span className="thread-text block">
                      {shown.claim?.[1]}
                    </span>
                  </h1>

                  <p className="mx-auto mt-5 max-w-[36ch] text-[clamp(17px,1.6vw,24px)] leading-[1.36] font-bold tracking-[-0.022em] text-ink lg:mx-0">
                    {shown.lead}
                  </p>

                  {/* The paragraph, with the other company's name as a link.

                      Split on the name rather than kept as three fields: the
                      sentence is a sentence, and cutting it into pieces in the
                      data so the middle one can be blue is a sentence that can no
                      longer be rewritten without touching the markup. */}
                  <p className="pointer-events-auto mx-auto mt-4 max-w-[56ch] text-[15px] leading-[1.65] text-quiet sm:text-[16px] lg:mx-0">
                    {shown.note?.split(SISTER).map((part, n) => (
                      <span key={n}>
                        {n > 0 ? (
                          <Link
                            href={ROUTES.services}
                            className="font-semibold text-mark hover:underline"
                          >
                            {SISTER}
                          </Link>
                        ) : null}
                        {part}
                      </span>
                    ))}
                  </p>

                  {/* Four doors, one row, and the first one filled. Where they all
                    look the same there is no first choice, and a row of four
                    equal buttons is four decisions rather than one. */}
                  <div className="pointer-events-auto mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                    <Link
                      href={ROUTES.build}
                      className="group/way thread-fill inline-flex items-center gap-2 rounded-pill px-5.5 py-3.5 text-[15px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
                    >
                      <PencilLine
                        aria-hidden
                        className="size-[18px] shrink-0"
                      />
                      Scope your website
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5"
                        strokeWidth={2.4}
                      />
                    </Link>

                    {[
                      {
                        at: ROUTES.services,
                        icon: LayoutGrid,
                        say: "View our services",
                      },
                      {
                        at: ROUTES.book,
                        icon: CalendarDays,
                        say: "Book a meeting",
                      },
                      {
                        at: ROUTES.services,
                        icon: Code2,
                        say: "Custom software",
                      },
                    ].map((way) => (
                      <Link
                        key={way.say}
                        href={way.at}
                        className="group/way inline-flex items-center gap-2 rounded-pill border border-hair bg-field px-5.5 py-3.5 text-[15px] font-semibold whitespace-nowrap text-ink transition-colors hover:border-ink"
                      >
                        <way.icon
                          aria-hidden
                          className="size-4 shrink-0 text-idx"
                        />
                        {way.say}
                        <ArrowRight
                          aria-hidden
                          className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* No trail under the buttons.

                  A row of beads on a dotted line ran here, and it is one picture
                  too many: the mark is already the picture on this screen, and a
                  second one below the doors puts the eye past them rather than
                  on them. The sister company stays - that is a fact about who
                  builds what, not decoration. */}

              <div className="hidden items-center justify-center gap-4 md:flex">
                <Image
                  src="/assets/logo.png"
                  alt=""
                  width={64}
                  height={64}
                  aria-hidden
                  draggable={false}
                  sizes="64px"
                  className="size-8 flex-none object-contain"
                />
                <span className="text-[15.5px] font-bold tracking-[-0.02em] text-ink">
                  TwinCoreTech
                </span>
                {/* A rule between them, not a bullet. The two are a name and a
                    description of it, which is a caption - and a caption is set
                    off by a line. */}
                <span aria-hidden className="h-6 w-px flex-none bg-hair" />
                {/* Wide enough for the whole sentence on one line where there
                    is room for one. At forty-six characters it broke after
                    "more than", which puts "a website." alone on a second line -
                    a two word orphan under a caption that is one sentence long.
                    Seventy-six is the sentence. */}
                <span className="max-w-[76ch] text-[13.5px] leading-[1.5] text-quiet">
                  Custom software development for businesses that need more than
                  a website.
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}

      {/* Nothing stands in the bottom left any more.

          A thumbnail of the next slide did, and the card was cut back for it.
          Both are gone together, and they had to go together: the cut is a hole
          in the card, so a cut with nothing in it shows the page through the
          bottom left corner - which is the fault the notch has and gets away
          with because it is small and holds three arrows.

          What it cost is the way on to the next screen, and that was already in
          the arrows. What it bought is a card with one fewer thing on it, on a
          screen that now carries a headline, a paragraph and four doors. */}

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
/* The fourth screen's ground: the mark, in dots, too big for the card.

   The obvious version of this screen was a logo above a headline over a field of
   dots, and it is the version every card like this already is. This is the same
   two things arranged so that neither is decoration: the dots are the mark, and
   the mark is far larger than the card, so what shows is a piece of it - the
   crossing in the middle and both loops running off the sides.

   How it is made is the whole trick, and it is two lines of CSS. A grid of dots
   is a repeating radial gradient; the logo is a PNG with a real alpha channel;
   so the logo masks the grid, and what is left is dots in the shape of the mark.
   No canvas, no SVG path, no second copy of the artwork to keep in step with the
   one in the header - the file the header uses is the file that cuts this.

   Standing still is the point of it. Three screens of this card are drawing every
   frame; the fourth is the one that stops, and a static pattern is not a cheaper
   animation - it is the quiet at the end. */
const GRID = (tint: string, share: number, dot: number, gap: number) => ({
  backgroundImage: `radial-gradient(circle, color-mix(in oklab, var(${tint}) ${share}%, transparent) ${dot}px, transparent ${dot + 0.7}px)`,
  backgroundSize: `${gap}px ${gap}px`,
});

function DotGround() {
  return (
    <span aria-hidden className="absolute inset-0 overflow-hidden">
      {/* The card's own weather: a fine grid across all of it, thinned only out
          of the middle so the mark has somewhere to be read against.

          It used to fade out again before the edges, and what that left was a
          band of dots with white either side of it - the card looked as though
          the pattern had been cut to fit rather than as though it carried on.
          It runs to the corners now, and the only thing shaping it is the hole
          in the middle where the words are. */}
      <span
        className="absolute inset-0"
        style={{
          ...GRID("--color-thread-blue", 58, 1.2, 17),
          maskImage:
            "radial-gradient(circle at 50% 50%, transparent 14%, black 52%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, transparent 14%, black 52%)",
        }}
      />

      {/* And the mark, in the mark's own two colours.

          Which needed the whole thing turning inside out. It was a grid of teal
          dots with the logo cutting a shape out of it - and a background can
          only be one gradient, so a grid of dots that runs blue into green is
          not a thing a background can be.

          So the colour is the background and both the shape and the dots are the
          mask. Two mask layers, the logo and the dot grid, composited to their
          intersection: what survives is the part of the sheet that is inside the
          mark and inside a dot. The gradient underneath never has to know it is
          being drawn as dots. */}
      <span
        className="absolute top-1/2 left-1/2 aspect-square w-[104%] -translate-x-1/2 -translate-y-1/2"
        style={{
          backgroundImage:
            "linear-gradient(100deg, color-mix(in oklab, var(--color-thread-blue) 72%, transparent), color-mix(in oklab, var(--color-thread-teal) 72%, transparent))",
          maskImage:
            "url(/assets/logo.png), radial-gradient(circle, #000 2.1px, transparent 2.8px)",
          maskSize: "contain, 15px 15px",
          maskPosition: "center, center",
          maskRepeat: "no-repeat, repeat",
          maskComposite: "intersect",
          WebkitMaskImage:
            "url(/assets/logo.png), radial-gradient(circle, #000 2.1px, transparent 2.8px)",
          WebkitMaskSize: "contain, 15px 15px",
          WebkitMaskPosition: "center, center",
          WebkitMaskRepeat: "no-repeat, repeat",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* The card's white, back in the middle. The mark is a picture and the
          words are the point, and the one thing a halftone must not do is make a
          sentence work for it. */}
      <span
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 62% 56% at 50% 50%, color-mix(in oklab, var(--color-field) 92%, transparent) 0%, color-mix(in oklab, var(--color-field) 78%, transparent) 38%, color-mix(in oklab, var(--color-field) 36%, transparent) 66%, transparent 88%)",
        }}
      />
    </span>
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
