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
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] lg:block"
    >
      {/* Whole, rather than run off the edge and cut.

          It was 105 per cent of a strip that hid its own overflow, offset 22
          per cent to the right - so nearly a third of the mark was cut off by
          the strip before the card had any say, and what showed was a loop
          missing its far side. Sized to sit inside the strip and inset from
          it, the whole mark is there.

          No `overflow-hidden` here either, and none needed: the card itself
          hides its overflow, so the only thing that could ever clip this is
          the card's own rounded edge - which is the one edge it should be
          clipped by. */}
      <Image
        src="/assets/logo.png"
        alt=""
        width={320}
        height={320}
        draggable={false}
        sizes="320px"
        className="absolute top-[6%] right-[6%] h-auto w-[88%] object-contain opacity-[0.1]"
      />
    </span>
  );
}
