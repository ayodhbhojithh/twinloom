import Image from "next/image";

/* ---------------------------------------------------------------------------
   The chooser's decoration: the mark, watermarked into a card.

   One PNG, `aria-hidden`, carrying no information. What else stood here - a
   pair of dotted sweeps in the panel's top corners, a bead trail through each
   card, a dotted rule with beads across the foot - has all come off, and the
   file is what is left rather than what it was: on a screen whose whole job
   is one choice between two, everything that is not the choice is something
   to read past.

   Deterministic. Its position is written down rather than scattered, because
   a decoration that lands somewhere new on each render is a decoration nobody
   can place a card against.
--------------------------------------------------------------------------- */

/**
 * The mark inside a card, watermarked.
 *
 * Set high in the strip rather than centred, so it sits above the words
 * rather than behind their middle.
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
        className="absolute top-[2%] -right-[22%] h-auto w-[105%] object-contain opacity-[0.1]"
      />
    </span>
  );
}
