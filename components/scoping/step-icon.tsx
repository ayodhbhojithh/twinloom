import {
  Boxes,
  CalendarClock,
  Compass,
  LayoutGrid,
  Palette,
  PenLine,
  Search,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

import type { ScopeIcon } from "@/lib/scoping";
import { cn } from "@/lib/utils";

const ICONS: Record<ScopeIcon, LucideIcon> = {
  Compass,
  Boxes,
  LayoutGrid,
  ShoppingBag,
  Search,
  Palette,
  CalendarClock,
  PenLine,
};

/**
 * The tile tint, rotating by position so consecutive sections never share one.
 * Derived from the index rather than stored per step: it is a presentation
 * decision, and putting it in the data would only let the two drift apart.
 */
const TONES = [
  "bg-[#fce7f3] text-[#db2777]",
  "bg-[#ede9fe] text-[#7c3aed]",
  "bg-[#dbeafe] text-[#2563eb]",
  "bg-[#d1fae5] text-[#059669]",
  "bg-[#fef3c7] text-[#d97706]",
] as const;

/**
 * The section's glyph on a tinted tile, in the same treatment as the process
 * ledger on the home page.
 *
 * It gives each of the eight a face. Moving between sections then reads as
 * arriving somewhere rather than as text being swapped out, which is most of what
 * makes a long form feel like a journey.
 */
export function StepIcon({
  icon,
  at,
  className,
}: {
  icon: ScopeIcon;
  at: number;
  className?: string;
}) {
  const Glyph = ICONS[icon];

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-[38px] shrink-0 items-center justify-center rounded-tile transition-colors duration-500",
        TONES[at % TONES.length],
        className,
      )}
    >
      <Glyph className="size-[19px]" strokeWidth={2} />
    </span>
  );
}
