"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The derived sitemap, drawn rather than listed.
 *
 * TCT_Scope_Spec.md §3 asks for a wireframe of the derived pages. This is the small
 * version of it: one glyph per page, each a suggestion of a layout rather than a
 * mock-up of one, and each labelled with the page it stands for.
 *
 * It matters more than a list does. A client reading "Basket and checkout" in a
 * bulleted list is reading admin; the same words under a shape that looks like a
 * page make it a site they can picture. It is also the one picture on an otherwise
 * typographic page, which is what stops the Blueprint reading as a spreadsheet.
 *
 * Every glyph is the same two tints as the rest of the page, so nothing new is
 * introduced to draw it: a header bar in brand, content lines in the hairline grey.
 */

/** Line widths per glyph, so no two pages look identical. */
const SHAPES = [
  [88, 62, 74],
  [74, 88, 56],
  [62, 78, 88],
  [88, 74, 62],
  [56, 88, 70],
];

export function PageGlyph({
  name,
  at,
}: {
  name: string;
  at: number;
}) {
  const reduced = useReducedMotion();
  const lines = SHAPES[at % SHAPES.length];

  return (
    <motion.li
      className="min-w-0"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.5,
        delay: Math.min(at * 0.045, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        aria-hidden
        className="flex aspect-[4/3] flex-col gap-[5px] rounded-[7px] bg-panel-bg p-2"
      >
        <span className="h-[3px] w-1/2 rounded-pill bg-brand/70" />
        {lines.map((width, line) => (
          <span
            key={line}
            style={{ width: `${width}%` }}
            className="h-[2px] rounded-pill bg-faint/25"
          />
        ))}
      </div>

      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="font-mono text-[9px] font-bold text-faint/70 tabular-nums">
          {String(at + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1 text-[11.5px] leading-tight font-semibold">
          {name}
        </span>
      </p>
    </motion.li>
  );
}
