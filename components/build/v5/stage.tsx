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
  className,
  children,
}: {
  /** Stands in the notch at the top: the way between steps. */
  toolbar?: React.ReactNode;
  /** Stands in the corner cut at the bottom right: the way on. */
  corner?: React.ReactNode;
  /** Stands in the bite at the bottom left: what the answers add up to. */
  aside?: React.ReactNode;
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

    const barDepth = flare * 2;
    const barWidth = Math.min(
      Math.max(flare * 2 + 190, Math.min(w * 0.4, 430)),
      Math.max(flare * 2 + 60, w - 2 * (radius + flare) - 8),
    );

    const bite = Math.max(92, Math.min(Math.min(w * 0.15, h * 0.18), 140));
    const drop = Math.max(flare * 2 + 14, Math.min(w * 0.07, 82));

    return {
      radius,
      barWidth,
      barDepth,
      barRadius: flare,
      barFlare: flare,
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
  const pad = Math.max(20, Math.min(size.w * 0.032, 34));

  return (
    <div ref={box} className={cn("relative", className)}>
      {/* The ground. Nothing but a shape: it carries no content, so clipping
          it costs nothing and the words above it stay whole. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-canvas"
        style={{ clipPath: path ? `path("${path}")` : undefined }}
      />

      {toolbar ? (
        <div
          className="absolute top-0 left-1/2 flex -translate-x-1/2 items-start justify-center"
          style={{ width: cut.barWidth, height: cut.barDepth, paddingTop: 2 }}
        >
          {toolbar}
        </div>
      ) : null}

      {aside ? (
        <div
          className="absolute bottom-0 left-0 flex items-end"
          style={{ width: cut.biteWidth - 12, height: cut.biteHeight - 12 }}
        >
          {aside}
        </div>
      ) : null}

      {corner ? (
        <div
          className="absolute right-0 bottom-0 flex items-center justify-center"
          style={{ width: cut.dropWidth, height: cut.dropHeight }}
        >
          {corner}
        </div>
      ) : null}

      {/* The content, held clear of every cut by the numbers that made them. */}
      <div
        className="relative"
        style={{
          paddingTop: (toolbar ? cut.barDepth : 0) + 22,
          paddingBottom: (aside ? cut.biteHeight : 26) + 14,
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
