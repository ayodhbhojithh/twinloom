import Image from "next/image";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The mark, staged: haloes behind it and glass beads around it.

   All CSS and one PNG. There is a canvas version of this in the history of this
   project and it is not what should be here: nothing in the picture moves, and a
   still picture drawn sixty times a second is a still picture with a fan running.

   Three things make it, and each is one idea:

   - the haloes are a grid of dots masked to a ring, which is the same trick the
     fourth screen uses to cut the mark out of a grid;
   - the beads are a radial gradient with its light off centre and a shadow under
     it, which is what a rendered sphere is once you stop rendering it;
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

/* The beads, placed in per cent of the box and sized the same way.

   By hand rather than scattered: four of the six are holding a corner and the
   other two are stopping the four looking placed. The colours are the accents
   the pit uses, which is what keeps the two screens in the same box of paint. */
const BEADS = [
  { x: 74, y: 4, r: 4.6, ink: "#7c4dff" },
  { x: 96, y: 12, r: 3.8, ink: "#ff7a1a" },
  { x: 4, y: 56, r: 5.2, ink: "#10c996" },
  { x: 32, y: 74, r: 3.6, ink: "#2a98fe" },
  { x: 92, y: 78, r: 3.2, ink: "#ff4d5e" },
  { x: 58, y: 92, r: 2.6, ink: "#22bde8" },
] as const;

/** A bead, which is a gradient with its light off centre and a shadow under it. */
function Bead({ x, y, r, ink }: (typeof BEADS)[number]) {
  return (
    <span
      aria-hidden
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${r * 2}%`,
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
        backgroundImage: `radial-gradient(circle at 34% 28%, #ffffff 0%, color-mix(in oklab, ${ink} 34%, #ffffff) 14%, ${ink} 54%, color-mix(in oklab, ${ink} 62%, #0b1f38) 100%)`,
        boxShadow: `0 ${r * 0.45}% ${r * 0.9}% -${r * 0.3}% rgba(12,32,56,0.28)`,
      }}
    />
  );
}

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

      {BEADS.map((bead) => (
        <Bead key={`${bead.x}-${bead.y}`} {...bead} />
      ))}
    </div>
  );
}
