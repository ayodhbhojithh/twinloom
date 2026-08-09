import Image from "next/image";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The mark, staged: dotted haloes behind it, and nothing else in the air.

   All CSS and one PNG. There is a canvas version of this in the history of this
   project and it is not what should be here: nothing in the picture moves, and a
   still picture drawn sixty times a second is a still picture with a fan running.

   Two things make it, and each is one idea:

   - the haloes are a grid of dots masked to a ring, which is the same trick the
     fourth screen uses to cut the mark out of a grid;
   - the mark is the file the header uses.

   Everything is placed in per cent of this box rather than in pixels, so the
   whole arrangement scales as one thing and nothing has to be re-placed at a
   breakpoint.
--------------------------------------------------------------------------- */

/** A halo: how wide, how fine its dots, and how far round the ring it runs. */
const HALOES = [
  { at: 74, dot: 1.5, gap: 11, share: 46, from: 40, to: 52 },
  { at: 88, dot: 1.2, gap: 13, share: 34, from: 42, to: 50 },
  { at: 104, dot: 1, gap: 15, share: 24, from: 44, to: 49 },
] as const;

/* The beads that stood around the mark are gone.

   Six of them floated at the corners of this box, and they broke the one thing
   the box is for. The mark is the object here and the haloes are the air round
   it; six more objects in that air made it a group photograph. At the size this
   runs on a wide card they also came out larger than the mark's own dots, so the
   picture had two scales arguing.

   They are not lost. The trail below is made of them, and there they have
   somewhere to be - resting on a line, which is what a bead is for. */

/**
 * The whole arrangement.
 *
 * Square, because the mark is and the haloes are - a box of another shape would
 * make the rings ellipses, and a ring drawn round something is only convincing
 * while it is a ring.
 */
export function MarkStage({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square w-full", className)}>
      {HALOES.map((halo) => (
        <span
          key={halo.at}
          aria-hidden
          className="absolute top-1/2 left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: `${halo.at}%`,
            backgroundImage: `radial-gradient(circle, color-mix(in oklab, var(--color-thread-blue) ${halo.share}%, transparent) ${halo.dot}px, transparent ${halo.dot + 0.7}px)`,
            backgroundSize: `${halo.gap}px ${halo.gap}px`,
            /* A ring rather than a disc, and soft at both of its edges: a hard
               inner edge is a hole and a hard outer one is a coin. */
            maskImage: `radial-gradient(circle, transparent ${halo.from}%, black ${halo.to}%, transparent 50%)`,
            WebkitMaskImage: `radial-gradient(circle, transparent ${halo.from}%, black ${halo.to}%, transparent 50%)`,
          }}
        />
      ))}

      {/* The glow. The mark is flat artwork and this is what stops it reading as
          a sticker: a wash of its own two colours behind it, wider than it and
          fading to nothing well before the box ends. */}
      <span
        aria-hidden
        className="absolute inset-[8%] rounded-full"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in oklab, var(--color-thread-blue) 16%, transparent) 0%, color-mix(in oklab, var(--color-thread-teal) 10%, transparent) 42%, transparent 72%)",
        }}
      />

      <Image
        src="/assets/logo.png"
        alt=""
        width={1200}
        height={1200}
        aria-hidden
        draggable={false}
        sizes="(max-width: 1024px) 70vw, 46vw"
        className="absolute inset-[10%] h-auto w-[80%] object-contain"
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The trail: beads resting on a dotted path.

   SVG rather than CSS, and for once that is the cheaper answer. The path is one
   curve and the dots along it are a dash pattern with round caps - a border
   cannot be a curve and a background cannot follow one, so doing this in CSS
   would mean placing every dot by hand and placing them again the day the curve
   changes.

   One `viewBox` and `preserveAspectRatio="none"` on nothing: the whole thing
   scales with the box and the beads keep their shape because they are circles in
   the same coordinate space as the curve.
--------------------------------------------------------------------------- */

/* The box the trail is drawn in, and the wave that runs through it.

   One sine rather than a hand-drawn curve, and that is what makes the thing
   balanced: every bead's height is read off the same function its path is drawn
   from, so no bead can be a little above or below the line it is supposed to be
   resting on. Placing them by eye is how the first version came out with beads
   hovering.

   A hand and a half of wave across the width, so it rises, falls and rises
   again - a single hump reads as a hill and two full cycles reads as a pattern.
*/
const TRAIL_W = 1200;
const TRAIL_H = 140;
const RIDE = (x: number) =>
  76 + 26 * Math.sin((x / TRAIL_W) * Math.PI * 3 + 0.5);

/* The beads: eleven, evenly spaced, and sized to a rhythm rather than at random.

   Large, small, largest, middle, large, small - a repeating figure with two
   accents in it. Random sizes at these counts always clump, and a row of eleven
   equal circles is a rule with lumps in it. The colours run the spectrum the pit
   uses and come back round, so no two neighbours are the same and the row reads
   as one set.

   Held a bead's width in from both ends, so nothing is ever cut by the edge of
   the box. */
const SIZES = [15, 9, 21, 12, 17, 9, 22, 11, 16, 9, 14];
const INKS = [
  "#2a98fe",
  "#10c996",
  "#7c4dff",
  "#ff7a1a",
  "#22bde8",
  "#ff4d5e",
  "#10c996",
  "#2a98fe",
  "#7c4dff",
  "#ff7a1a",
  "#22bde8",
];

const TRAIL = SIZES.map((r, n) => {
  const x = 64 + (n * (TRAIL_W - 128)) / (SIZES.length - 1);
  return { x, y: RIDE(x), r, ink: INKS[n] };
});

/* The path, as a hundred straight steps through the same wave. A cubic would be
   fewer numbers and a different curve, and then the beads would be sitting on
   one line while resting at heights taken from another. */
const CURVE = Array.from({ length: 101 }, (_unused, n) => {
  const x = (n / 100) * TRAIL_W;
  return `${n === 0 ? "M" : "L"} ${x.toFixed(1)} ${RIDE(x).toFixed(1)}`;
}).join(" ");

export function BeadTrail({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${TRAIL_W} ${TRAIL_H}`}
      className={cn("block h-auto w-full", className)}
    >
      <defs>
        <linearGradient id="trail-thread" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-thread-blue)" />
          <stop offset="100%" stopColor="var(--color-thread-teal)" />
        </linearGradient>

        {/* One blur for every shadow. The first version filled a flat grey
            ellipse under each bead, which is not a shadow - it is a stone. */}
        <filter
          id="trail-shadow"
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="4" />
        </filter>

        {TRAIL.map((bead, n) => (
          <radialGradient key={n} id={`bead-${n}`} cx="34%" cy="27%" r="80%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop
              offset="15%"
              stopColor={`color-mix(in oklab, ${bead.ink} 36%, #ffffff)`}
            />
            <stop offset="55%" stopColor={bead.ink} />
            <stop
              offset="100%"
              stopColor={`color-mix(in oklab, ${bead.ink} 58%, #0b1f38)`}
            />
          </radialGradient>
        ))}
      </defs>

      {/* The path, as dots. Round caps on a dash of almost nothing is a dot;
          anything longer is a dash pretending to be one. */}
      <path
        d={CURVE}
        fill="none"
        stroke="url(#trail-thread)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeDasharray="0.1 15"
        opacity="0.55"
      />

      {TRAIL.map((bead, n) => (
        <g key={n}>
          <ellipse
            cx={bead.x}
            cy={bead.y + bead.r * 0.98}
            rx={bead.r * 1.15}
            ry={bead.r * 0.3}
            fill="rgba(12,32,56,0.22)"
            filter="url(#trail-shadow)"
          />
          <circle cx={bead.x} cy={bead.y} r={bead.r} fill={`url(#bead-${n})`} />
        </g>
      ))}
    </svg>
  );
}
