import { SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/**
 * The wordmark: one word, extrabold, with the middle syllable in the brand
 * blue. Set in Manrope with tight tracking, inherited from the nav.
 *
 * No logo mark. Swap this for the real logo when brand assets land; nothing else
 * on the site sets the brand name.
 */
export function BrandMark({
  size = "default",
  className,
}: {
  size?: "default" | "large";
  className?: string;
}) {
  const { head, accent, tail } = SITE.wordmark;

  return (
    <span
      className={cn(
        "font-extrabold tracking-[-0.02em]",
        size === "large" ? "text-lg" : "text-base",
        className,
      )}
    >
      {head}
      <span className="text-brand">{accent}</span>
      {tail}
    </span>
  );
}
