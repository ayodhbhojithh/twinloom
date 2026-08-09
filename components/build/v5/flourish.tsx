import Image from "next/image";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The chooser's decoration: dotted sweeps, glass beads, and the mark behind it.

   All SVG and one PNG, and all of it `aria-hidden`. Nothing here carries any
   information - it is the same argument the rest of this site makes with dots,
   made once more around a panel that is otherwise two boxes and a button.

   Three pieces, and each is one idea:

   - a sweep is a run of dotted arcs sharing a centre, so it reads as something
     turning rather than as lines drawn side by side;
   - a bead is a radial gradient with its light off centre and a shadow under
     it, which is what a rendered sphere is once you stop rendering one;
   - the watermark is the logo the header uses, at four per cent.

   Deterministic throughout. Every position is written down rather than
   scattered, because a decoration that lands somewhere new on each render is a
   decoration nobody can place a card against.
--------------------------------------------------------------------------- */

/** The palette the beads are drawn from, and it is the pit's. */
const INKS = {
  blue: "#2a98fe",
  deep: "#1663d6",
  green: "#10c996",
  orange: "#ff7a1a",
  violet: "#7c4dff",
} as const;

type Ink = keyof typeof INKS;

interface Bead {
  /** In per cent of the box, so the whole arrangement scales as one thing. */
  x: number;
  y: number;
  r: number;
  ink: Ink;
}

/** A bead: gradient, rim, and a soft shadow under it. */
function Beads({ list }: { list: readonly Bead[] }) {
  return (
    <>
      {list.map((bead, n) => (
        <span
          key={n}
          className="absolute rounded-full"
          style={{
            left: `${bead.x}%`,
            top: `${bead.y}%`,
            width: `${bead.r * 2}%`,
            aspectRatio: "1 / 1",
            transform: "translate(-50%, -50%)",
            backgroundImage: `radial-gradient(circle at 33% 27%, #ffffff 0%, color-mix(in oklab, ${INKS[bead.ink]} 32%, #ffffff) 15%, ${INKS[bead.ink]} 55%, color-mix(in oklab, ${INKS[bead.ink]} 58%, #0b1f38) 100%)`,
            boxShadow: `0 ${bead.r * 0.5}% ${bead.r}% -${bead.r * 0.3}% rgba(12,32,56,0.3)`,
          }}
        />
      ))}
    </>
  );
}

/**
 * A sweep of dotted arcs, sharing one centre.
 *
 * Dashes of almost nothing with round caps, which is a dot; anything longer is
 * a dash pretending. Each arc is fainter and finer than the one inside it, so
 * the sweep fades outward rather than stopping.
 */
function Sweep({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("absolute", className)}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <defs>
        <linearGradient
          id={`sweep-${flip ? "r" : "l"}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="var(--color-thread-blue)" />
          <stop offset="100%" stopColor="var(--color-thread-teal)" />
        </linearGradient>
      </defs>

      {[
        { r: 52, w: 2.6, o: 0.5 },
        { r: 66, w: 2.2, o: 0.38 },
        { r: 80, w: 1.8, o: 0.28 },
        { r: 94, w: 1.5, o: 0.2 },
        { r: 108, w: 1.2, o: 0.13 },
      ].map((arc) => (
        <circle
          key={arc.r}
          cx="20"
          cy="30"
          r={arc.r}
          fill="none"
          stroke={`url(#sweep-${flip ? "r" : "l"})`}
          strokeWidth={arc.w}
          strokeLinecap="round"
          strokeDasharray="0.1 9"
          strokeOpacity={arc.o}
        />
      ))}
    </svg>
  );
}

/**
 * What stands behind the whole panel: a sweep and some beads in each top
 * corner, mirrored.
 *
 * `overflow-hidden` on whatever holds this, or the sweeps run out into the
 * page - they are drawn larger than the corner they sit in on purpose, so what
 * shows is a piece of something bigger rather than a motif placed in a box.
 */
export function ChooserFlourish() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {/* Hard into the corners and half outside them.

          They used to be inset, which put a motif in the middle of the panel's
          top edge on a wide screen with the heading between them - two things
          the eye has to hold apart. Pushed past the corner and clipped by it,
          each reads as the edge of something the panel is standing on. */}
      <Sweep className="-top-[22%] -left-[10%] h-[92%] w-[30%]" />
      <Sweep className="-top-[22%] -right-[10%] h-[92%] w-[30%]" flip />

      {/* Beads to the outside of the sweeps, never inside them. The middle of
          this edge belongs to the wordmark. */}
      <Beads
        list={[
          { x: 4.5, y: 7, r: 1.1, ink: "blue" },
          { x: 9, y: 13, r: 0.55, ink: "orange" },
          { x: 2.6, y: 17, r: 0.62, ink: "green" },
          { x: 7.5, y: 20, r: 0.5, ink: "violet" },
          { x: 95.5, y: 6.5, r: 0.6, ink: "orange" },
          { x: 92, y: 14, r: 1, ink: "green" },
          { x: 97, y: 19, r: 0.5, ink: "blue" },
        ]}
      />
    </span>
  );
}

/**
 * The mark inside a card, with a thread of beads running past it.
 *
 * Four per cent, which is the whole point of it: at any more it is a picture in
 * the corner of a card and the words have to work around it. The dotted curve
 * is the same idea the wave upstairs is - one thread, going somewhere.
 */
export function CardFlourish({ tone }: { tone: "blue" | "green" }) {
  const blue = tone === "blue";

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[30%] overflow-hidden lg:block"
    >
      {/* A third of the card at most, and only where there is no type.

          It was nearly half, which put beads on top of two paragraphs and a
          dotted curve through a sentence. The words have a measure and this has
          what is left of the card beyond it: decoration that a reader has to
          read around is not decoration. */}
      <Image
        src="/assets/logo.png"
        alt=""
        width={320}
        height={320}
        draggable={false}
        sizes="320px"
        className="absolute top-1/2 -right-[18%] h-auto w-[78%] -translate-y-1/2 object-contain opacity-[0.05]"
      />

      <svg
        viewBox="0 0 100 200"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M -10 168 C 34 168 40 118 62 92 S 92 46 118 12"
          fill="none"
          stroke={
            blue ? "var(--color-thread-blue)" : "var(--color-thread-teal)"
          }
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="0.1 6"
          strokeOpacity="0.45"
        />
      </svg>

      <Beads
        list={
          blue
            ? [
                { x: 62, y: 18, r: 3.4, ink: "green" },
                { x: 88, y: 52, r: 2.6, ink: "blue" },
                { x: 70, y: 82, r: 3.8, ink: "violet" },
              ]
            : [
                { x: 74, y: 14, r: 3.2, ink: "green" },
                { x: 58, y: 44, r: 3.6, ink: "violet" },
                { x: 86, y: 64, r: 2.6, ink: "blue" },
                { x: 68, y: 88, r: 3, ink: "orange" },
              ]
        }
      />
    </span>
  );
}
