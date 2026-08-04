"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

import { outline, type Cuts } from "@/components/home/notched-card";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   A cut surface, for anything that is not a step.

   The landing card states the rule: one large surface, and anything you can
   press stands in a piece cut out of it rather than floating on top of it. The
   build screens follow it; this is the same shell for the parts of the site
   that are not the tool - the footer today, and whatever else wants the shape.

   The arcs are the landing card's, imported rather than copied, because two
   sets of these numbers would curve by different amounts within a week.

   The cut is on a layer of its own behind the content, and the slots that stand
   in the cuts sit above it. Clipping the card itself would clip the words in
   it, and content painted over the cuts swallows every press meant for the
   controls standing in them.
--------------------------------------------------------------------------- */

export function CutPanel({
  toolbar,
  aside,
  corner,
  foot,
  tone = "canvas",
  className,
  children,
}: {
  /** Stands in the notch at the top: what the surface is. */
  toolbar?: React.ReactNode;
  /** Stands in the bite at the bottom left. */
  aside?: React.ReactNode;
  /** Stands in the corner cut at the bottom right: the way on. */
  corner?: React.ReactNode;
  /**
   * The band along the bottom, between the two cuts. For the small print that
   * belongs on the same line as them rather than above an empty strip.
   */
  foot?: React.ReactNode;
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

  /* One flare and one radius, and every cut is built from them. A cut is at
     least two flares deep, because that is where its two arcs meet - any less
     and a straight wall appears between them.

     Everything is held inside what the surface can actually give: on a narrow
     screen a bar plus two flares can want more room than the top edge has, and
     a path that overruns its own box folds inside out. */
  const cut: Cuts = ((): Cuts => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    const radius = Math.max(20, Math.min(w * 0.02 + 14, 34));
    const flare = Math.max(20, Math.min(h * 0.035, 28));

    const barDepth = toolbar ? flare * 2 : 0.01;
    const barWidth = toolbar
      ? Math.min(
          Math.max(flare * 2 + 120, Math.min(w * 0.22, 260)),
          Math.max(flare * 2 + 60, w - 2 * (radius + flare) - 8),
        )
      : 0.01;

    /* One size for both bottom cuts. Two cuts of different sizes on one
       surface read as two decisions rather than one. */
    const nook = Math.max(flare * 2 + 20, Math.min(w * 0.07, 92));

    return {
      radius,
      barWidth,
      barDepth,
      barRadius: toolbar ? flare : 0.01,
      barFlare: toolbar ? flare : 0.01,
      biteWidth: aside ? nook : 0.01,
      biteHeight: aside ? nook : 0.01,
      biteRadius: aside ? flare : 0.01,
      biteFlare: aside ? flare : 0.01,
      dropWidth: corner ? nook : 0.01,
      dropHeight: corner ? nook : 0.01,
      dropRadius: corner ? flare : 0.01,
      dropFlare: corner ? flare : 0.01,
    };
  })();

  const path = size.w > 40 ? outline(size.w, size.h, cut) : "";
  const pad = Math.max(22, Math.min(size.w * 0.035, 56));

  /* Below this there is not enough width left between two cuts to put anything
     readable between them, so the band gives up and the foot goes back into
     the content above it. */
  const roomForBand = size.w >= 760;
  const band = foot && roomForBand;

  return (
    <div ref={box} className={cn("relative", className)}>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0",
          tone === "field" ? "bg-field" : "bg-canvas",
        )}
        style={{ clipPath: path ? `path("${path}")` : undefined }}
      />

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
          className="absolute bottom-0 left-0 z-20 flex items-center justify-center"
          style={{ width: cut.biteWidth, height: cut.biteHeight }}
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

      <div
        className="relative z-10"
        style={{
          paddingTop: (toolbar ? cut.barDepth : 0) + 28,
          paddingBottom: band
            ? 28
            : (aside || corner ? cut.biteHeight : 28) + 28,
          paddingLeft: pad,
          paddingRight: pad,
        }}
      >
        {children}

        {foot && !band ? <div className="mt-9">{foot}</div> : null}
      </div>

      {/* The bottom band. Inset by the width of each cut, so it runs between
          them rather than under them, and at least as tall as they are so the
          surface never ends above its own corners. */}
      {band ? (
        <div
          className="relative z-10 flex items-center"
          /* The band starts where the content starts. Insetting it by the
             width of a cut instead lines it up with nothing at all, and a
             second left edge a few pixels off the first is worse than no band.
             Only the side that actually holds a control is inset. */
          style={{
            minHeight: corner ? cut.dropHeight : 0,
            paddingLeft: aside ? cut.biteWidth + 12 : pad,
            paddingRight: corner ? cut.dropWidth + 12 : pad,
            paddingBottom: 10,
          }}
        >
          {foot}
        </div>
      ) : null}
    </div>
  );
}

/** The way back up, drawn as the landing card draws its arrows. */
export function TopDisc() {
  return (
    <button
      type="button"
      aria-label="Back to the top"
      title="Back to the top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }
      className="flex size-11 cursor-pointer items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
    >
      <ArrowUp className="size-[18px]" strokeWidth={2.2} />
    </button>
  );
}
