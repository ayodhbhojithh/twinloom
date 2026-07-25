import { SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/**
 * Wordmark placeholder. Swap the glyph for the real logo once brand assets land;
 * nothing else on the page reads the brand name directly.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-ink font-mono text-[13px] font-semibold text-white"
      >
        T
      </span>
      <span className="text-[15px] font-extrabold tracking-[-0.01em]">
        {SITE.name}
      </span>
    </span>
  );
}
