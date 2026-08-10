"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The mark, staged. Which is now one image and nothing else.

   It used to be built here: three rings of dots masked into haloes, a wash of
   the brand's two colours behind them, and the flat logo in the middle. All of
   that was standing in for artwork that did not exist - the mark this screen
   wants is a rendered one, glossy and lit, with its own halftone drifting round
   it, and none of that is a thing CSS should be asked to fake.

   `home3.png` is that artwork - the mark rendered glossy and lit, with its own
   halftone drifting round it in arcs and the dotted thread through the middle. So the haloes are gone, the wash is gone, and what is left is the
   file. It carries its own light and its own scatter, and a set of CSS dots
   drawn underneath would be two textures at two scales arguing.

   What is left to do here is the joining: the file is opaque and its ground is
   not quite the card's white, so it is multiplied into the card and faded out at
   its own edges. A picture set on a surface with a visible box round it is a
   picture somebody has pasted on.

   The component stays rather than the screen calling `next/image` itself, and
   for one reason: the day this becomes a video, a canvas, or three files at
   three breakpoints, that is an edit here and not an edit inside a card that has
   five screens in it.
--------------------------------------------------------------------------- */

/**
 * Where the beads stand, and how far apart.
 *
 * One line, and everything on it the same size at the same spacing. It was a
 * shallow S with ten beads of six different radii placed along it by eye, and
 * the case for that was that evenly spaced, evenly sized beads are a progress
 * bar. They are not - a progress bar is a bar with a filled part and an empty
 * part, and this has neither. What the wandering version actually was is ten
 * separate decisions the eye has to take in one at a time, laid across the foot
 * of the screen the whole page opens on.
 *
 * Set as a rule rather than a table for the same reason. Ten hand-placed rows
 * are ten numbers to keep in step every time the strip changes height; a step
 * and a radius are two numbers that cannot disagree with each other.
 */
const WIDE = 1200;
const BASE = 84;
const RADIUS = 5;

/**
 * How far the row stands off each end of the strip.
 *
 * It had none. The first bead sat fifty-four units in and the last sixty-six
 * from the other end, because the positions were a start plus a fixed step and
 * whatever was left over at the far end was left over - so the row was neither
 * padded nor centred, it was packed from the left and stopped when it ran out
 * of beads. On a card whose bottom corners curve in, the ends were also running
 * into the curve.
 *
 * Which is why the step is worked out from this rather than the other way
 * round: with the two ends given, the gap between beads is whatever divides the
 * space between them evenly. Equal margins and equal spacing then hold at any
 * count - add a colour to `INKS` and the row closes up rather than growing out
 * of the card.
 *
 * Set so the row comes out a little inside the line of type under it.
 *
 * It matched that line exactly for a while, on the argument that two objects on
 * the same axis at two different widths read as scenery with a caption parked in
 * the middle of it. That held while there were eleven beads on it. At seven the
 * step is whatever divides the span between the two ends, so the same width gave
 * a row with more gap in it than dots - and a row of dots spaced further apart
 * than they are wide stops being a row and becomes seven separate marks.
 *
 * Narrower is the only lever, because the count is the colours and the colours
 * are not repeating. Close enough to the line below that the two still read as
 * one block, and tight enough that the dots read as a run.
 *
 * A share of the viewBox rather than a measurement of that line. This strip is
 * drawn at the full width of the card, so the two track each other as the card
 * grows: the type is the same type at every width above `md`, and this is the
 * share of the card it takes at the widths this screen is drawn for. Measuring
 * the line and feeding its width back here is the exact answer and costs an
 * observer, a re-render and a layout read on a decorative row.
 */
const PAD = 462;

/**
 * The colours, in the order they run.
 *
 * Seven, each used once. Eleven distinct colours is a spectrum, and a spectrum
 * across the foot of a page is a chart of something - the eye starts looking for
 * what the eleventh is that the first is not. Seven is a handful: enough that no
 * colour comes back, few enough that the row reads as a few coloured dots rather
 * than as a scale.
 *
 * The count is also what sets the gaps. Once the two ends are fixed the step is
 * whatever divides the span between them, so taking four out opens the row
 * rather than shortening it.
 *
 * Ours first and the plain rest after, with no two neighbours in the same
 * family: blue, green, violet, orange, cyan, red, amber.
 */
const INKS = [
  "#2a98fe",
  "#10c996",
  "#7c4dff",
  "#ff7a1a",
  "#22bde8",
  "#ff4d5e",
  "#ffc53d",
] as const;

const STEP = (WIDE - PAD * 2) / (INKS.length - 1);

const TRAIL = INKS.map((ink, n) => ({
  x: PAD + n * STEP,
  y: BASE,
  r: RADIUS,
  ink,
}));

/** The line they sit on, which is now a line, and stops where they stop. */
const CURVE = `M ${PAD} ${BASE} L ${WIDE - PAD} ${BASE}`;

/**
 * A dotted thread with glass beads along it.
 *
 * Every bead is one flat disc. They were shaded spheres - a radial gradient
 * putting a highlight off centre at a third across and a quarter down, running
 * out to a mix of the bead's own colour and the ink blue - and eleven lit
 * spheres in a row is eleven small pictures. At this size the shading is a
 * smudge of white on one side rather than a light anybody reads, and what it
 * costs is the colour: a graded ball is never quite the colour it is, so eleven
 * of them are eleven approximations. Flat, each one is exactly its own.
 *
 * The shadow stays, and is the one thing still doing depth. It is drawn before
 * the bead, flat and wide because the light is high, and it is what the drop
 * and the hop are measured against - without it the beads float beside the line
 * rather than resting on it.
 */
export function BeadTrail({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDE} 130`}
      className={cn("block h-auto w-full overflow-visible", className)}
    >
      <defs>
        <linearGradient id="trail-thread" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-thread-blue)" />
          <stop offset="100%" stopColor="var(--color-thread-teal)" />
        </linearGradient>
      </defs>

      {/* The path, as dots. Round caps on a one-unit dash is a dot; anything
          longer is a dash pretending.

          It arrives first and on its own, because the beads land on it: a bead
          resting on a line that is not there yet is resting on nothing. */}
      <path
        className="trail-line"
        d={CURVE}
        fill="none"
        stroke="url(#trail-thread)"
        /* Thinner than the beads by a good margin. The thread and the things
           on it were within a few units of each other in weight, which makes a
           string of beads read as one dotted line with some fat dots in it -
           and the line is meant to be what they are standing on rather than
           another thing in the row. */
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray="0.1 14"
      />

      {/* Dropped in, one after another from the left.

          Each one falls the height of the card and bounces three times on the
          thread, and its shadow is a separate animation rather than a
          passenger: a shadow that fell with the ball would be glued to it,
          where one that opens as the ball lands and shrinks again as it comes
          back up is the gap between the two. That pair is the whole trick - a
          ball with a shadow that never changes is a sticker.

          `overflow-visible` on the surface above, because they start well
          above the strip - and the card's own outline clips them, so they fall
          into the picture out of the top of it rather than out of nowhere.

          One duration and one delay for the ball and its shadow. They were set
          a beat apart, on the argument that a shadow still arriving as the ball
          touches reads as the gap closing - which was right for a single drop
          and is wrong for a bounce, where the two have to meet three times.
          Sharing the clock is what keeps them meeting.

          The delay is the index, so the run reads left to right along the
          thread. Three quarters of a tenth of a second between them: enough that
          they land one after another rather than as a shower, short enough that
          the seven of them are a run rather than a queue.

          They start almost at once. They were held back a full second, so that
          twenty SVG elements moving at their own transforms would not cost
          frames from the words arriving above them - and at the time they would
          have, because the texture behind them was redrawing at a denser buffer
          and the mark was recompositing a blend group every frame. Neither is
          true now. What the delay bought was a screen that loaded, settled, and
          then started doing something a second later, which reads as the page
          being slow rather than as a sequence. Every value is written here rather than
          in the stylesheet because it is per bead, and a stylesheet cannot hold
          ten of them without ten classes. */}
      {TRAIL.map((bead, n) => (
        <Bead key={n} bead={bead} n={n} />
      ))}
    </svg>
  );
}

export function MarkStage({ className }: { className?: string }) {
  return (
    /* Shallower than the file, because the file is square and the mark is not.

       The artwork sits across the middle of a square with a good deal of white
       above it and below, so a square box would hold that white as well and the
       mark would come out two thirds the size it could be. Seven by five,
       covered, keeps the mark and throws the margins away. */
    <div className={cn("relative aspect-[7/5] w-full", className)}>
      <Image
        src="/assets/home4.png"
        alt=""
        width={1254}
        height={1254}
        aria-hidden
        draggable={false}
        /* Loaded straight away rather than lazily.

           This is the first screen of the landing card and the largest thing on
           it, which makes it the Largest Contentful Paint - and the default is
           `lazy`, so the browser was waiting to discover it in the body before
           starting. `eager` is the right one of the three here rather than
           `preload`: the docs say to prefer it, and a `<link>` in the head would
           be preloading an image that four other screens of this card do not
           show.

           Not `priority`, which Next 16 has deprecated in favour of saying which
           of these two behaviours you actually meant. */
        loading="eager"
        fetchPriority="high"
        sizes="(max-width: 1024px) 70vw, 52vw"
        /* Multiplied, not laid on.

           The file has no transparency and its ground is 253 grey - against a
           card that is pure white, that is a faint square with the artwork
           inside it, which is exactly what "just dropped in" looks like.
           `multiply` makes any near-white pixel indistinguishable from the card
           under it and leaves every coloured one alone, so the ribbons and the
           spray keep their weight and the box disappears.

           It works because the card behind it is white. On a coloured screen
           this would darken rather than blend, and the honest fix there would be
           a file with an alpha channel rather than a different blend mode. */
        /* Still, and it has to be.

           It carried a slow float for a while, and that float is what made the
           whole first screen stutter. This image is `mix-blend-multiply` with a
           mask over it: the browser composites the blend group and re-applies
           the mask every time the element moves, and at half a window wide that
           is a full-size recomposite sixty times a second, for ever, on the
           same thread as the entrance run and the canvas behind it.

           There is no cheap version of it either. Move it and the blend group
           moves; put the transform on a parent and the group is cut and the
           file's white ground comes back as a square. So the movement on this
           screen belongs to the things that can afford it - the words arriving,
           the beads dropping, the texture behind - and the mark is the still
           point they are arranged around. */
        className="relative h-full w-full object-cover mix-blend-multiply"
        style={{
          /* And the edges given away. Even multiplied, the file's outer corners
             carry enough noise to draw a rectangle in the right light; faded to
             nothing well before the box ends, there is no edge left to see. The
             outermost spray goes with them, which is the trade - a picture that
             stops is worse than a picture with less in it. */
          maskImage:
            "radial-gradient(ellipse 66% 74% at 50% 50%, black 0%, black 54%, transparent 88%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 66% 74% at 50% 50%, black 0%, black 54%, transparent 88%)",
        }}
      />
    </div>
  );
}

/**
 * One bead, and the hop it does when the pointer arrives.
 *
 * The hop is state rather than `:hover`, and that is the whole of this
 * component. A hover animation only exists while the pointer is over the thing:
 * take the pointer away halfway through and the rule stops matching, the
 * animation is thrown away, and the bead is back on the thread on the next
 * frame - which is the drop. Nothing in CSS lets an animation outlive the
 * condition that started it.
 *
 * So the pointer arriving is an event rather than a state. It sets a flag, the
 * flag runs the animation, and the animation ending clears the flag. Where the
 * pointer is while that happens does not come into it, which means the bounce
 * always runs to its end and always ends where the bead lives.
 *
 * It also gives the rule about repeating for nothing. `pointerenter` fires on
 * arrival and not while resting, and the flag is already set for as long as the
 * hop lasts - so a bead does one hop per arrival, and the next one needs the
 * pointer to leave and come back.
 */
function Bead({
  bead,
  n,
}: {
  bead: { x: number; y: number; r: number; ink: string };
  n: number;
}) {
  const [hop, setHop] = useState(false);

  return (
    <g>
      {/* The bead sits in a group of its own, and the group is what hops.

          The circle already carries an animation - the drop - and a second
          `animation` on the same element replaces it rather than adding to it,
          so a bead hopped while it was still falling would have had its fall
          cancelled. One element, one animation. */}
      <g
        className={cn("trail-hop", hop && "trail-hopping")}
        onAnimationEnd={() => setHop(false)}
      >
        <circle
          className="trail-bead"
          style={{ animationDelay: `${0.28 + n * 0.075}s` }}
          cx={bead.x}
          cy={bead.y}
          r={bead.r}
          fill={bead.ink}
        />
      </g>

      {/* And the thing the pointer actually meets, which does not move.

          This is why the hop stopped flickering. The bead was its own target:
          hovering it lifted it, the lift took it out from under the pointer, the
          hover ended, it dropped back under the pointer and was hovered again -
          a bead stuck in a loop of being picked up and put down.

          A target that never moves cannot lose the pointer. It is drawn over the
          bead and the room above it, tall enough to cover the whole hop, and it
          is invisible - the stylesheet hit-tests it whether it is painted or
          not. Its width stops short of the step between beads, so no two ever
          overlap. */}
      <rect
        className="trail-hit"
        x={bead.x - 17}
        y={bead.y - 26}
        width={34}
        height={40}
        fill="transparent"
        onPointerEnter={() => setHop(true)}
      />
    </g>
  );
}
