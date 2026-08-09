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

/** Where each bead sits along the curve, how big it is, and what colour. */
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

const CURVE =
  "M 0 104 C 120 104 180 74 300 70 S 470 96 600 74 S 800 60 900 84 S 1080 92 1200 66";

export function BeadTrail({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 130"
      className={cn("block h-auto w-full", className)}
    >
      <defs>
        <linearGradient id="trail-thread" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-thread-blue)" />
          <stop offset="100%" stopColor="var(--color-thread-teal)" />
        </linearGradient>

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
          longer is a dash pretending. */}
      <path
        d={CURVE}
        fill="none"
        stroke="url(#trail-thread)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="0.1 16"
        opacity="0.5"
      />

      {TRAIL.map((bead, n) => (
        <g key={n}>
          {/* Its shadow first, so the bead sits on the line rather than beside
              it. Flat and wide, because the light is high and in front. */}
          <ellipse
            cx={bead.x}
            cy={bead.y + bead.r * 1.05}
            rx={bead.r * 1.5}
            ry={bead.r * 0.34}
            fill="rgba(12,32,56,0.16)"
          />
          <circle cx={bead.x} cy={bead.y} r={bead.r} fill={`url(#bead-${n})`} />
        </g>
      ))}
    </svg>
  );
}
