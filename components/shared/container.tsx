import { cn } from "@/lib/utils";

/**
 * The page's horizontal rhythm. Two widths, both from the artifacts: `landing`
 * is the narrow 820px column used by the scoping entry page, `page` is the
 * 1000px column every other page uses.
 */
export function Container({
  width = "page",
  className,
  children,
}: {
  width?: "page" | "landing";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-[22px]",
        width === "landing" ? "max-w-landing" : "max-w-page",
        className,
      )}
    >
      {children}
    </div>
  );
}
