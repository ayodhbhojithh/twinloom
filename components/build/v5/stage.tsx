"use client";

import { useEffect, useRef, useState } from "react";

import { outline, type Cuts } from "@/components/home/notched-card";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The working surface, cut the way the landing card is cut.

   The home page states the rule this site is built on: one large surface, and
   anything you can press stands in a piece cut out of it rather than floating
   on top. This is that surface with a question inside it instead of a
   photograph - the notch at the top holds the way between steps, the bite at
   the bottom left holds what the answers add up to, and the corner cut holds
   the way on.

   The cut is on a layer of its own behind the content. Clipping the card
   itself would clip the words in it, and a step's answers cannot be allowed to
   disappear into a notch. So the ground is clipped and the content sits above
   it, held clear of the cuts by padding worked out from the same numbers.

   The geometry is the landing card's, imported rather than copied. Two copies
   of these arcs would curve by different amounts within a week, and the point
   is that the site is drawn by one hand.
--------------------------------------------------------------------------- */

export function Stage({
  toolbar,
  corner,
  aside,
  scrollKey,
  tone = "canvas",
  className,
  children,
}: {
  /** Stands in the notch at the top: the way between steps. */
  toolbar?: React.ReactNode;
  /** Stands in the corner cut at the bottom right: the way on. */
  corner?: React.ReactNode;
  /** Stands in the bite at the bottom left: what the answers add up to. */
  aside?: React.ReactNode;
  /**
   * What is on the surface. When it changes, the surface takes the reader to
   * its own top.
   */
  scrollKey?: string;
  /**
   * The ground. `canvas` is the warm paper the run-through sits on; `field` is
   * white, for a surface that opens over the page and has to separate itself
   * from the canvas behind it.
   */
  tone?: "canvas" | "field";
  className?: string;
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const node = box.current;
    if (!node) return;

    const measure = () =>
      setSize({ w: node.clientWidth, h: node.clientHeight });

    const watcher = new ResizeObserver(measure);
    watcher.observe(node);
    measure();

    return () => watcher.disconnect();
  }, []);

  /* Changing what the surface shows means the thing somebody just pressed is
     now a screen above them, and they are looking at the empty foot of a
     question they cannot see the top of. So the surface brings itself back up.

     Skipped on the first render, because arriving at the page is not a change
     and nobody wants to be scrolled the moment they land. */
  const landed = useRef(false);

  useEffect(() => {
    if (!landed.current) {
      landed.current = true;
      return;
    }

    const node = box.current;
    if (!node) return;

    const top = node.getBoundingClientRect().top + window.scrollY;
    const header =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--nav-height",
        ),
      ) || 53;

    if (window.scrollY <= top - header - 24) return;

    window.scrollTo({
      top: Math.max(0, top - header - 16),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [scrollKey]);

  /* One flare and one radius, and every cut is built from them, exactly as on
     the landing card. The notch is as deep as the flare plus the corner
     because that is where the two arcs meet; any other number leaves a
     straight wall between them.

     Everything is then held inside what the surface can actually give: on a
     narrow screen a bar plus two flares can want more room than the top edge
     has, and a path that overruns its own box folds inside out. */
  const cut: Cuts = ((): Cuts => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    const radius = Math.max(20, Math.min(w * 0.02 + 14, 32));
    const flare = Math.max(22, Math.min(h * 0.03, 28));

    /* Collapsed when nothing stands in it, exactly as the other two cuts are.
       A notch with nothing in it is not a quieter version of the toolbar - it
       is a bite taken out of the top edge for no reason, and it reads as a
       surface that has broken rather than one that was drawn. */
    const barDepth = toolbar ? flare * 2 : 0.01;
    /* The bar takes what it needs and no more. It held two fifths of the top
       edge, which on a middling screen left too little either side of it for
       the heading to stand beside it - so the heading dropped underneath and
       the whole left corner sat empty. */
    const barWidth = toolbar
      ? Math.min(
          Math.max(flare * 2 + 170, Math.min(w * 0.3, 380)),
          Math.max(flare * 2 + 60, w - 2 * (radius + flare) - 8),
        )
      : 0.01;

    /* One size for both cuts. The corner needs `flare * 2` before its arcs
       overlap, and the fourteen on top of that is the air round a 44px
       control. */
    const cut = Math.max(flare * 2 + 22, Math.min(w * 0.08, 96));
    const bite = cut;
    const drop = cut;

    return {
      radius,
      barWidth,
      barDepth,
      barRadius: toolbar ? flare : 0.01,
      barFlare: toolbar ? flare : 0.01,
      biteWidth: aside ? bite : 0.01,
      biteHeight: aside ? bite : 0.01,
      biteRadius: aside ? flare : 0.01,
      biteFlare: aside ? flare : 0.01,
      dropWidth: corner ? drop : 0.01,
      dropHeight: corner ? drop : 0.01,
      dropRadius: corner ? flare : 0.01,
      dropFlare: corner ? flare : 0.01,
    };
  })();

  const path = size.w > 40 ? outline(size.w, size.h, cut) : "";

  /* The room to the left of the notch.

     The bar is centred and narrow, so on a wide surface there is a column of
     empty top edge either side of it. The heading belongs in the left one -
     level with the notch rather than below it - and the only thing standing
     between the two is width. Below the floor there is not enough of it to
     hold a heading, and the content goes back under the bar instead. */
  const pad = Math.max(20, Math.min(size.w * 0.032, 34));
  const beside = Boolean(toolbar) && (size.w - cut.barWidth) / 2 - pad >= 240;
  const headRoom = beside
    ? `${Math.round((size.w - cut.barWidth) / 2 - pad - 16)}px`
    : "62ch";

  return (
    <div ref={box} className={cn("relative", className)}>
      {/* The ground. Nothing but a shape: it carries no content, so clipping
          it costs nothing and the words above it stay whole. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0",
          tone === "field" ? "bg-field" : "bg-canvas",
        )}
        style={{ clipPath: path ? `path("${path}")` : undefined }}
      />

      {/* The three slots sit above the content, not behind it. They are
          absolute and the content is in normal flow after them, so without a
          stacking order of their own the content painted over the cuts and
          swallowed every press meant for the controls standing in them. */}
      {toolbar ? (
        <div
          className="absolute top-0 left-1/2 z-20 flex -translate-x-1/2 items-start justify-center"
          style={{ width: cut.barWidth, height: cut.barDepth, paddingTop: 2 }}
        >
          {toolbar}
        </div>
      ) : null}

      {aside ? (
        <div
          className="absolute bottom-0 left-0 z-20 flex items-end"
          style={{ width: cut.biteWidth - 12, height: cut.biteHeight - 12 }}
        >
          {aside}
        </div>
      ) : null}

      {corner ? (
        <div
          className="absolute right-0 bottom-0 z-20 flex items-center justify-center"
          style={{ width: cut.dropWidth, height: cut.dropHeight }}
        >
          {corner}
        </div>
      ) : null}

      {/* The content, held clear of every cut by the numbers that made them. */}
      <div
        className="relative z-10"
        style={{
          /* Under the notch, not a whole band under it. The bar is only as
             deep as its own arcs, and on a wide surface it leaves most of the
             top edge free - so the heading starts where the cut ends rather
             than clearing the whole width of it. */
          /* Beside the notch, the top inset is the side inset: the heading is
             then the same distance from the top edge as it is from the left
             one, which is the only reading of "the corner" that holds at every
             width. Under the notch there is no choice - the bar owns that band
             - so it clears the bar and keeps a hair of air below it. */
          paddingTop: beside ? pad : (toolbar ? cut.barDepth : 0) + 12,
          /* What the heading may take before it would run under the bar. */
          ["--notch-free" as string]: headRoom,
          /* Clear of the bite and then some. The content only has to miss the
             cut to be legal, and a last line that stops exactly where the
             corner starts reads as though it were trimmed by it. */
          /* Clear of whichever bottom cut is actually there, and then some.
             The content only has to miss the cut to be legal, and a last line
             that stops exactly where a corner starts reads as though it were
             trimmed by it. */
          paddingBottom:
            Math.max(
              aside ? cut.biteHeight : 0,
              corner ? cut.dropHeight : 0,
              26,
            ) + 34,
          paddingLeft: pad,
          paddingRight: pad,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** The plate that stands in a cut: white, pill, and nothing drawn round it. */
export function Plate({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-10 max-w-full items-center gap-0.5 rounded-pill bg-field px-1.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A round control, as the landing card's arrows are drawn. */
export function Disc({
  label,
  onClick,
  tone = "quiet",
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: "quiet" | "ink";
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-9 flex-none cursor-pointer items-center justify-center rounded-pill transition-colors",
        tone === "ink"
          ? "bg-ink text-white hover:opacity-85"
          : "text-quiet hover:bg-well hover:text-ink",
        disabled && "cursor-default text-planned hover:bg-transparent hover:text-planned",
      )}
    >
      {children}
    </button>
  );
}
