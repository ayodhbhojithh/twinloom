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
