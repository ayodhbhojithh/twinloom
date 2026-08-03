"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { ProjectPanel } from "./project-panel";
import { PROJECTS, type Project } from "./projects";

/* ---------------------------------------------------------------------------
   A card with pieces taken out of it.

   Two things sit against the card rather than on it: a bar of controls at the
   top and the next project at the bottom left. The card is cut back around both,
   and the cuts curve outward where they meet the edge, so the shape reads as one
   continuous surface with bites out of it rather than as three rectangles
   overlapping.

   Those outward curves are the whole job. `border-radius` only ever bends a
   corner inward, and a mask made of gradients gets the straight edges right and
   the corners visibly wrong. The outline is written as a path instead: every
   corner is an arc, and the direction each one turns decides whether the surface
   curves in or out.
--------------------------------------------------------------------------- */

interface Cuts {
  /** The card's own corners. */
  radius: number;
  /** The bar at the top: width, depth, its own corners, and the outward curve. */
  barWidth: number;
  barDepth: number;
  barRadius: number;
  barFlare: number;
  /** The bite at the bottom left, the same four numbers. */
  biteWidth: number;
  biteHeight: number;
  biteRadius: number;
  biteFlare: number;
}

/**
 * The outline, clockwise from just after the top left corner.
 *
 * Every turn is an arc of the same radius as the corner it rounds, and the sweep
 * flag is the entire trick: `1` turns the way a rectangle's corner turns, which
 * curves the surface in; `0` turns the other way, which curves it out. The
 * outward turns are the four places the card wraps around something.
 */
function outline(w: number, h: number, cut: Cuts): string {
  const {
    radius: r,
    barWidth: bw,
    barDepth: bd,
    barRadius: br,
    barFlare: bf,
    biteWidth: cw,
    biteHeight: ch,
    biteRadius: cr,
    biteFlare: cf,
  } = cut;

  /* The bar is centred, so the top edge is cut from here to here. */
  const left = (w - bw) / 2;
  const right = left + bw;

  return [
    `M ${r} 0`,
    /* Top edge, up to where the bar begins. */
    `L ${left - bf} 0`,
    `A ${bf} ${bf} 0 0 0 ${left} ${bf}`,
    `L ${left} ${bd - br}`,
    `A ${br} ${br} 0 0 0 ${left + br} ${bd}`,
    `L ${right - br} ${bd}`,
    `A ${br} ${br} 0 0 0 ${right} ${bd - br}`,
    `L ${right} ${bf}`,
    `A ${bf} ${bf} 0 0 0 ${right + bf} 0`,
    /* On to the top right corner and down the right side. */
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    /* Bottom edge, leftward, up to the bite. */
    `L ${cw + cf} ${h}`,
    `A ${cf} ${cf} 0 0 0 ${cw} ${h - cf}`,
    `L ${cw} ${h - ch + cr}`,
    `A ${cr} ${cr} 0 0 0 ${cw - cr} ${h - ch}`,
    `L ${cf} ${h - ch}`,
    `A ${cf} ${cf} 0 0 0 0 ${h - ch - cf}`,
    /* Up the left side to where we started. */
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    "Z",
  ].join(" ");
}

export function NotchedCard({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);

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

  const shown = PROJECTS[at];
  const next = PROJECTS[(at + 1) % PROJECTS.length];

  /* Scaled to the card rather than fixed, so the bar stays a bar on a phone
     instead of a lid, and the bite stays a corner instead of half the picture. */
  const cut: Cuts = {
    radius: Math.min(34, size.w * 0.04 + 14),
    barWidth: Math.max(148, Math.min(size.w * 0.24, 240)),
    barDepth: Math.max(46, Math.min(size.h * 0.09, 62)),
    barRadius: 24,
    barFlare: 22,
    biteWidth: Math.max(104, Math.min(size.w * 0.13, 158)),
    biteHeight: Math.max(104, Math.min(size.h * 0.24, 172)),
    biteRadius: 22,
    biteFlare: 22,
  };

  const path = size.w > 40 ? outline(size.w, size.h, cut) : "";

  return (
    <div ref={box} className={cn("relative", className)}>
      {/* The picture. Grey until there is one, and cut to the outline. */}
      <motion.div
        key={shown.id}
        layoutId={`shot-${shown.id}`}
        className="absolute inset-0 rounded-[34px]"
        style={{
          backgroundColor: shown.tone,
          clipPath: path ? `path("${path}")` : undefined,
        }}
      />

      {/* The bar, standing in the cut rather than on top of the picture. */}
      <div
        className="absolute top-0 left-1/2 flex -translate-x-1/2 items-center justify-center gap-1"
        style={{ width: cut.barWidth, height: cut.barDepth }}
      >
        <Tool
          label="Previous project"
          onClick={() =>
            setAt((was) => (was - 1 + PROJECTS.length) % PROJECTS.length)
          }
        >
          <ArrowLeft className="size-[17px]" />
        </Tool>
        <Tool label={`Open ${shown.name}`} onClick={() => setOpen(shown)}>
          <Maximize2 className="size-[16px]" />
        </Tool>
        <Tool
          label="Next project"
          onClick={() => setAt((was) => (was + 1) % PROJECTS.length)}
        >
          <ArrowRight className="size-[17px]" />
        </Tool>
      </div>

      {/* What is coming next, standing in the bite. */}
      <button
        type="button"
        onClick={() => setAt((was) => (was + 1) % PROJECTS.length)}
        aria-label={`Next: ${next.name}`}
        className="group absolute bottom-0 left-0 cursor-pointer rounded-[22px] p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-active"
        style={{ width: cut.biteWidth - 14, height: cut.biteHeight - 14 }}
      >
        <span
          className="block size-full rounded-[20px] border border-border transition-transform duration-300 group-hover:-translate-y-1"
          style={{ backgroundColor: next.tone }}
        />
      </button>

      {/* Which project this is, said in words rather than left to the picture. */}
      <p className="absolute right-6 bottom-6 text-right">
        <span className="block text-[15px] font-bold text-ink">
          {shown.name}
        </span>
        <span className="mt-0.5 block font-mono text-[9.5px] font-bold tracking-[0.14em] text-label uppercase">
          {shown.kind} / {shown.year}
        </span>
      </p>

      <ProjectPanel project={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function Tool({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-9 cursor-pointer items-center justify-center rounded-pill text-quiet transition-colors hover:bg-well hover:text-ink"
    >
      {children}
    </button>
  );
}
