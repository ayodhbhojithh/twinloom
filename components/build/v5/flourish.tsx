import Image from "next/image";

/* ---------------------------------------------------------------------------
   The chooser's decoration: the mark watermarked into a card, and a dotted
   rule with a bead or two where the panel closes.

   All SVG and one PNG, and all of it `aria-hidden`. Nothing here carries any
   information.

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

/**
 * The mark inside a card, watermarked.
 *
 * Four per cent, which is the whole point of it: at any more it is a picture in
 * the corner of a card and the words have to work around it. Set high in the
 * strip rather than centred, so it sits above the words rather than behind
 * their middle.
 */
export function CardFlourish() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[30%] overflow-hidden lg:block"
    >
      <Image
        src="/assets/logo.png"
        alt=""
        width={320}
        height={320}
        draggable={false}
        sizes="320px"
        className="absolute top-[6%] -right-[18%] h-auto w-[78%] object-contain opacity-[0.05]"
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
