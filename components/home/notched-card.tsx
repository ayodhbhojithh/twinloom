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
   corner is an arc, and which side of the arc its centre falls on decides
   whether the surface curves in or out.
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
 * Two kinds of turn, and telling them apart is the whole job.
 *
 * A cut's own corners curve the way any rounded box curves: the centre of the
 * arc sits inside the cut. Those are the notch's two bottom corners and the
 * bite's inner corner, and they take sweep `0`.
 *
 * A flare is where a cut meets the card's edge, and it curves the other way: the
 * centre of the arc sits in the card, so the edge sweeps outward and the cut is
 * wider at the mouth than at its floor. Those take sweep `1`, the same as the
 * card's own corners.
 *
 * Getting that backwards does not produce a subtle error. It puts the centre of
 * each flare on the wrong side, which turns the gentle sweep into a full
 * quarter-disc bitten out beside the notch, and the card grows two ears.
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
    /* Top edge, then the flare down into the notch. */
    `L ${left - bf} 0`,
    `A ${bf} ${bf} 0 0 1 ${left} ${bf}`,
    `L ${left} ${bd - br}`,
    `A ${br} ${br} 0 0 0 ${left + br} ${bd}`,
    `L ${right - br} ${bd}`,
    `A ${br} ${br} 0 0 0 ${right} ${bd - br}`,
    `L ${right} ${bf}`,
    `A ${bf} ${bf} 0 0 1 ${right + bf} 0`,
    /* On to the top right corner and down the right side. */
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    /* Bottom edge, leftward, then the flare up into the bite. */
    `L ${cw + cf} ${h}`,
    `A ${cf} ${cf} 0 0 1 ${cw} ${h - cf}`,
    `L ${cw} ${h - ch + cr}`,
    `A ${cr} ${cr} 0 0 0 ${cw - cr} ${h - ch}`,
    `L ${cf} ${h - ch}`,
    `A ${cf} ${cf} 0 0 1 0 ${h - ch - cf}`,
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

  /**
   * The four numbers that decide whether this looks drawn or assembled.
   *
   * The flare is the outward curve where a cut meets the card's edge, and it has
   * to be about as large as the cut is deep. Smaller than that and the edge drops
   * into the notch rather than sweeping into it, which is the difference between
   * a shape and a hole. The bar's own corners are half its depth, which makes it
   * a pill rather than a rounded box.
   *
   * Everything scales with the card and is then held inside what the card can
   * actually give: on a narrow screen a bar plus two flares can want more room
   * than the top edge has, and a path that overruns its own box folds inside out.
   */
  const cut: Cuts = ((): Cuts => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    const radius = Math.max(22, Math.min(w * 0.03 + 20, 48));

    /* One notch, not two.
       
       The flare sweeps down from the top edge and the notch's own corner rounds
       in at the bottom. If those two arcs do not meet, a straight wall runs
       between them and the cut reads as a shallow shelf with a deeper notch
       inside it. Making each exactly half the depth means they meet exactly, and
       the profile becomes a single unbroken curve from the top edge to the floor
       of the cut. */
    const barDepth = Math.max(58, Math.min(h * 0.095, 78));
    const barFlare = barDepth / 2;
    const barRadius = barDepth / 2;

    /* Wide enough that the two corner arcs do not meet in the middle and turn
       the floor of the notch into a point. */
    const barWidth = Math.max(barRadius * 2 + 96, Math.min(w * 0.17, 250));

    const biteWidth = Math.max(108, Math.min(w * 0.12, 168));
    const biteHeight = Math.max(116, Math.min(h * 0.225, 180));
    const biteRadius = Math.max(18, Math.min(biteWidth * 0.2, 32));
    /* The same rule on the bite: the flare and the inner corner together make up
       the whole depth, so there is no straight run between them either. */
    const biteFlare = Math.max(16, Math.min(biteHeight - biteRadius, 46));

    return {
      radius,
      barWidth,
      barDepth,
      barRadius,
      barFlare,
      biteWidth,
      biteHeight,
      biteRadius,
      biteFlare,
    };
  })();

  const path = size.w > 40 ? outline(size.w, size.h, cut) : "";

  return (
    <div ref={box} className={cn("relative", className)}>
      {/* The picture. Grey until there is one, and cut to the outline. */}
      <motion.div
        key={shown.id}
        layoutId={`shot-${shown.id}`}
        className="absolute inset-0"
        /* Graded rather than flat. White bites cut into a flat grey block on a
           white page are nearly invisible: without a gradient there is no edge
           for the eye to follow round the shape, and the whole point of the
           outline is the shape. */
        style={{
          backgroundImage: `linear-gradient(155deg, #f4f5f7 0%, ${shown.tone} 46%, #dcdfe4 100%)`,
          clipPath: path ? `path("${path}")` : undefined,
        }}
      />

      {/* The bar, standing in the top of the cut. No border on it: the cut is
          already the outline, and a second one drawn a few pixels inside reads
          as a badge stuck over the notch rather than as the thing the notch was
          made for. */}
      <div
        className="absolute top-0 left-1/2 flex -translate-x-1/2 justify-center"
        style={{ width: cut.barWidth, height: cut.barDepth, paddingTop: 5 }}
      >
        <div className="flex h-10 items-center gap-0.5 rounded-pill bg-field px-1.5">
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
      </div>

      {/* What is coming next, standing in the bite. */}
      <button
        type="button"
        onClick={() => setAt((was) => (was + 1) % PROJECTS.length)}
        aria-label={`Next: ${next.name}`}
        className="group absolute bottom-0 left-0 cursor-pointer rounded-[20px] p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-active"
        style={{ width: cut.biteWidth - 16, height: cut.biteHeight - 16 }}
      >
        <span
          className="block size-full rounded-[18px] border border-border transition-transform duration-300 group-hover:-translate-y-1"
          style={{
            backgroundImage: `linear-gradient(155deg, #f6f7f8 0%, ${next.tone} 55%, #dcdfe4 100%)`,
          }}
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
