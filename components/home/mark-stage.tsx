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

export function MarkStage({ className }: { className?: string }) {
  return (
    /* The file's own shape, not a shape chosen for it.

       The one before this was square with the mark across its middle, so the box
       had to be shallower than the file and crop the empty white off the top and
       bottom. This one is already landscape and already filled, so the box is
       its ratio and nothing is thrown away. */
    <div className={cn("relative aspect-[1586/992] w-full", className)}>
      <Image
        src="/assets/home3.png"
        alt=""
        width={1586}
        height={992}
        aria-hidden
        draggable={false}
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
