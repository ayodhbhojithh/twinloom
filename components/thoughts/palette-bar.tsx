import type { PaletteColour } from "@/lib/thoughts/types";

/**
 * The palette as one bar, each colour taking its own share of the width.
 *
 * The weights exist to say how heavy each colour should be, and a number on a
 * slider does not show that. This does: the bar is the answer to the question
 * the weights are asking.
 */
export function PaletteBar({ colours }: { colours: PaletteColour[] }) {
  if (!colours.length) return null;

  return (
    <div
      aria-hidden
      className="flex h-2 overflow-hidden rounded-pill bg-panel-bg"
    >
      {colours.map((colour) => (
        <span
          key={colour.id}
          className="h-full transition-[width] duration-150"
          style={{ width: `${colour.weight}%`, background: colour.hex }}
        />
      ))}
    </div>
  );
}
