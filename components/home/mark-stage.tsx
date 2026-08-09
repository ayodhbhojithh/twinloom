import Image from "next/image";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The mark, staged. Which is now one image and nothing else.

   It used to be built here: three rings of dots masked into haloes, a wash of
   the brand's two colours behind them, and the flat logo in the middle. All of
   that was standing in for artwork that did not exist - the mark this screen
   wants is a rendered one, glossy and lit, with its own halftone drifting round
   it, and none of that is a thing CSS should be asked to fake.

   `home.png` is that artwork. So the haloes are gone, the wash is gone, and what
   is left is the file: the picture carries its own light and its own dots, and a
   second set drawn underneath would be two halftones at two scales arguing.

   The component stays rather than the screen calling `next/image` itself, and
   for one reason: the day this becomes a video, a canvas, or three files at
   three breakpoints, that is an edit here and not an edit inside a card that has
   five screens in it.
--------------------------------------------------------------------------- */

export function MarkStage({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square w-full", className)}>
      <Image
        src="/assets/home.png"
        alt=""
        width={1240}
        height={1240}
        aria-hidden
        draggable={false}
        sizes="(max-width: 1024px) 70vw, 46vw"
        className="h-auto w-full object-contain"
      />
    </div>
  );
}
