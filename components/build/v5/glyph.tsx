"use client";

import type { IconPart } from "@/lib/build/v5-rows";

/**
 * A row's picture, drawn from its shapes.
 *
 * One outline in `currentColor` at a common weight, so a row that goes dark
 * takes its picture with it and nothing has to be re-exported to restyle the
 * set. The prototype ships the same shapes inline in every row; here they are
 * drawn once from the data.
 */
export function Glyph({
  parts,
  className,
}: {
  parts: readonly IconPart[];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {parts.map((part, n) => {
        if (part.t === "rect") {
          return (
            <rect
              key={n}
              x={part.x}
              y={part.y}
              width={part.width}
              height={part.height}
              rx={part.rx}
            />
          );
        }
        if (part.t === "circle") {
          return <circle key={n} cx={part.cx} cy={part.cy} r={part.r} />;
        }
        return <path key={n} d={part.d} />;
      })}
    </svg>
  );
}
