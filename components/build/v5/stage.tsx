"use client";

import { useEffect, useRef, useState } from "react";

import { outline, type Cuts } from "@/components/home/notched-card";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The working surface, cut the way the landing card is cut.

   The home page states the rule this whole site is built on: one large surface,
   and anything you can press stands in a piece cut out of it rather than
   floating on top. This is that surface with a question inside it instead of a
   photograph.

   The cut is on a layer of its own behind the content. Clipping the card itself
   would clip the words in it, and a step's answers cannot be allowed to
   disappear into a notch. So the ground is clipped and the content sits above
   it, kept clear of the cuts by padding worked out from the same numbers.

   The geometry is the landing card's, imported rather than copied. Two cards
   with their own copies of these arcs would curve by different amounts within a
   week, and the whole point is that the site is drawn by one hand.
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

  /* One flare and one radius, and every cut on the surface is built from them,
     exactly as on the landing card. The notch is as deep as the flare plus the
     corner because that is where the two arcs meet; any other number leaves a
     straight wall between them. */
  const cut: Cuts = ((): Cuts => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    const radius = Math.max(20, Math.min(w * 0.02 + 16, 34));
    const flare = Math.max(18, Math.min(h * 0.03, 26));
    const barDepth = flare * 2;
    const barWidth = Math.max(flare * 2 + 200, Math.min(w * 0.42, 460));
    const bite = Math.max(96, Math.min(Math.min(w * 0.16, h * 0.2), 150));
    const drop = Math.max(flare * 2 + 16, Math.min(w * 0.07, 84));

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

  return (
    <div ref={box} className={cn("relative", className)}>
      {/* The ground. Nothing but a shape: it carries no content, so clipping it
          costs nothing and the words above it stay whole. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-well"
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

      {/* The content, held clear of every cut by the same numbers that made
          them. */}
      <div
        className="quiet-scroll relative h-full overflow-y-auto"
        style={{
          paddingTop: cut.barDepth + 20,
          paddingBottom: (aside ? cut.biteHeight : 40) + 12,
          paddingLeft: 28,
          paddingRight: 28,
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
        "flex h-11 items-center gap-1 rounded-pill bg-field px-1.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A round control, as the landing card's arrow is drawn. */
export function Disc({
  label,
  onClick,
  tone = "quiet",
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: "quiet" | "ink";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "flex size-11 cursor-pointer items-center justify-center rounded-pill transition-colors",
        tone === "ink"
          ? "bg-ink text-white hover:opacity-85"
          : "text-quiet hover:bg-well hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
