import Image from "next/image";

/* ---------------------------------------------------------------------------
   The chooser's decoration: glass beads, a dotted curve, and the mark behind it.

   All SVG and one PNG, and all of it `aria-hidden`. Nothing here carries any
   information - it is the same argument the rest of this site makes with dots,
   made once more around a panel that is otherwise two boxes and a button.

   A bead is a radial gradient with its light off centre and a shadow under it,
   which is what a rendered sphere is once you stop rendering one. The
   watermark is the logo the header uses, at four per cent.

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

/**
 * The line at the foot: a dotted rule with a bead or two sitting on it.
 *
 * The beads are in pixels, and that is the whole of the note. They were a share
 * of the box, which for a strip twelve pixels tall and half a panel wide meant a
 * radius written as a speck came out as a dome the height of the rule, clipped
 * flat by it. A decoration inside a thin box has to be measured against
 * something that is not the box.
 *
 * Drawn either side of the words rather than under them, so the sentence stays a
 * sentence and the rule stays a rule.
 */
const FOOT_BEADS = {
  left: [
    { at: 16, size: 9, ink: "green" },
    { at: 54, size: 6, ink: "blue" },
  ],
  right: [
    { at: 44, size: 6, ink: "violet" },
    { at: 80, size: 9, ink: "orange" },
  ],
} as const satisfies Record<
  "left" | "right",
  readonly { at: number; size: number; ink: Ink }[]
>;

export function FootFlourish({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className="relative hidden h-3 min-w-[70px] flex-1 items-center sm:flex"
    >
      <svg
        viewBox="0 0 120 12"
        preserveAspectRatio="none"
        className="h-3 w-full"
      >
        <line
          x1="0"
          y1="6"
          x2="120"
          y2="6"
          stroke="var(--color-thread-blue)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="0.1 6"
          strokeOpacity="0.45"
        />
      </svg>

      {FOOT_BEADS[side].map((bead) => (
        <span
          key={bead.at}
          className="absolute top-1/2 rounded-full"
          style={{
            left: `${bead.at}%`,
            width: bead.size,
            height: bead.size,
            transform: "translate(-50%, -50%)",
            backgroundImage: `radial-gradient(circle at 33% 27%, #ffffff 0%, color-mix(in oklab, ${INKS[bead.ink]} 32%, #ffffff) 15%, ${INKS[bead.ink]} 55%, color-mix(in oklab, ${INKS[bead.ink]} 58%, #0b1f38) 100%)`,
          }}
        />
      ))}
    </span>
  );
}
