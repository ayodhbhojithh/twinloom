import { SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/**
 * The wordmark: a gradient tile, then the name with its middle syllable carrying
 * the same gradient. Manrope, extrabold, tight tracking.
 *
 * The tile is 2a's brand device: the accent set at full strength on a 135 degree
 * sweep, in one small place, so the rest of the page can stay quiet.
 *
 * Swap the tile for the real logo when brand assets land; nothing else on the
 * site sets the brand name or mark.
 */
export function BrandMark({
  size = "default",
  className,
}: {
  size?: "default" | "large";
  className?: string;
}) {
  const { head, accent, tail } = SITE.wordmark;
  const large = size === "large";

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "bg-brand-gradient-tilt shrink-0 rounded-[8px]",
          large ? "size-8" : "size-[26px]",
        )}
      />

      <span
        className={cn(
          "font-extrabold tracking-[-0.02em]",
          large ? "text-[21px]" : "text-[19px]",
        )}
      >
        {head}
        <span className="text-brand-gradient">{accent}</span>
        {tail}
      </span>
    </span>
  );
}
