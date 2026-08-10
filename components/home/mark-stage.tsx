import Image from "next/image";

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
 * The beads, and where each one sits on the line.
 *
 * Ten of them, and every number here is placed rather than generated: the
 * sizes run small, medium, large and back in no repeating order, and the
 * colours never put two of the same next to each other. A row of evenly
 * spaced, evenly sized beads is a progress bar; this is a handful of things
 * that happen to be on the same thread.
 *
 * `y` is not derived from `CURVE`. Reading a point off a path costs a DOM
 * measurement per bead and gains nothing - these were placed against the
 * curve by eye, which is the only test that matters for whether a bead looks
 * like it is sitting on a line.
 */
const TRAIL = [
  { x: 60, y: 96, r: 9, ink: "#2a98fe" },
  { x: 175, y: 78, r: 15, ink: "#10c996" },
  { x: 318, y: 62, r: 20, ink: "#7c4dff" },
  { x: 432, y: 84, r: 8, ink: "#ff7a1a" },
  { x: 545, y: 66, r: 16, ink: "#2a98fe" },
  { x: 690, y: 62, r: 19, ink: "#10c996" },
  { x: 800, y: 90, r: 9, ink: "#7c4dff" },
  { x: 878, y: 86, r: 8, ink: "#22bde8" },
  { x: 960, y: 84, r: 12, ink: "#ff7a1a" },
  { x: 1060, y: 74, r: 11, ink: "#ff4d5e" },
] as const;

/** The line they sit on: one long shallow S, never crossing its own middle
    twice in the same direction. */
const CURVE =
  "M 0 104 C 120 104 180 74 300 70 S 470 96 600 74 S 800 60 900 84 S 1080 92 1200 66";

/**
 * A dotted thread with glass beads along it.
 *
 * Every bead is one radial gradient and one ellipse: the gradient puts the
 * highlight off centre at a third across and a quarter down, which is where a
 * light high and in front would put it, and runs out to a mix of the bead's
 * own colour and the ink blue rather than to black - a sphere's dark side is
 * still its colour, and a black edge reads as a hole.
 *
 * The shadow is drawn before the bead and is flat and wide for the same
 * reason: the light is high, so the shadow is a squashed ellipse under the
 * bead rather than a circle behind it. Without it the beads float beside the
 * line instead of resting on it.
 */
export function BeadTrail({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 130"
      className={cn("block h-auto w-full overflow-visible", className)}
    >
      <defs>
        <linearGradient id="trail-thread" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-thread-blue)" />
          <stop offset="100%" stopColor="var(--color-thread-teal)" />
        </linearGradient>

        {/* The shadow, as light that runs out rather than as a grey shape.

            It was a flat ellipse at sixteen per cent, and a flat fill has an
            edge - so what sat under each ball was a small hard disc with a rim,
            which is a sticker rather than a shadow. Real contact shadows are
            darkest where the ball nearly touches and gone a ball's width away,
            which is a radial that fades to nothing.

            One gradient for all ten, because it is drawn in the ellipse's own
            box: `objectBoundingBox` is the default, so each one is stretched to
            whatever ellipse uses it. */}
        <radialGradient id="trail-shade-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0c2038" stopOpacity="0.2" />
          <stop offset="45%" stopColor="#0c2038" stopOpacity="0.13" />
          <stop offset="75%" stopColor="#0c2038" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#0c2038" stopOpacity="0" />
        </radialGradient>

        {TRAIL.map((bead, n) => (
          <radialGradient key={n} id={`bead-${n}`} cx="34%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop
              offset="16%"
              stopColor={`color-mix(in oklab, ${bead.ink} 34%, #ffffff)`}
            />
            <stop offset="56%" stopColor={bead.ink} />
            <stop
              offset="100%"
              stopColor={`color-mix(in oklab, ${bead.ink} 60%, #0b1f38)`}
            />
          </radialGradient>
        ))}
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
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="0.1 16"
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
          thread. A tenth of a second between them: enough that they land one
          after another rather than as a shower.

          They start a second in, after the words above them rather than under
          them. Twenty SVG elements moving at once is not free, and it was
          costing frames from the one thing on this screen the eye is actually
          on - and even if it were free, a headline arriving while ten balls
          rain past it is two performances at once and neither gets watched. Every value is written here rather than
          in the stylesheet because it is per bead, and a stylesheet cannot hold
          ten of them without ten classes. */}
      {TRAIL.map((bead, n) => (
        <g key={n}>
          {/* Its shadow first, so the bead sits on the line rather than beside
              it. Flat and wide, because the light is high and in front. */}
          <ellipse
            className="trail-shade"
            style={{ animationDelay: `${1 + n * 0.1}s` }}
            cx={bead.x}
            cy={bead.y + bead.r * 1.02}
            /* Wider and taller than the flat one it replaces, because most of
               the extra is the fade. A gradient shadow measured to the same
               size as a flat one reads smaller than it. */
            rx={bead.r * 1.9}
            ry={bead.r * 0.52}
            fill="url(#trail-shade-fill)"
          />
          <circle
            className="trail-bead"
            style={{ animationDelay: `${1 + n * 0.1}s` }}
            cx={bead.x}
            cy={bead.y}
            r={bead.r}
            fill={`url(#bead-${n})`}
          />
        </g>
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
