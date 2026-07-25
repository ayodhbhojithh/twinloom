import { SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/**
 * The wordmark. The gradient square is the prototype's brand device, tilted at
 * 135 degrees and running amber to pink to violet to emerald.
 *
 * Swap the square for the real logo once brand assets land; nothing else on the
 * page reads the brand name or mark directly.
 */
export function BrandMark({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "large";
}) {
  const large = size === "large";

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "bg-rainbow-tilt shrink-0 rounded-[8px]",
          large ? "size-8" : "size-[26px]",
        )}
      />
      <span
        className={cn(
          "font-extrabold tracking-[-0.01em]",
          large ? "text-[21px]" : "text-[19px]",
        )}
      >
        {SITE.name}
      </span>
    </span>
  );
}
