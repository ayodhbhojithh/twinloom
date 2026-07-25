import { Brain } from "lucide-react";

import { SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/**
 * The wordmark: a brain glyph, then the name with its middle syllable carrying
 * the brand gradient. Manrope, extrabold, tight tracking.
 *
 * The glyph sits on nothing. With no tile behind it the gradient on `Core` is the
 * only place the accent set appears at full strength, which is how 2a spends it:
 * once per screen.
 *
 * Swap the glyph for the real logo when brand assets land; nothing else on the
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
    <span className={cn("flex items-center gap-2", className)}>
      <Brain
        aria-hidden
        strokeWidth={2.1}
        className={cn("shrink-0 text-brand", large ? "size-5" : "size-[18px]")}
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
