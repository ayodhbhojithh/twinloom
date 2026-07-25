import { cn } from "@/lib/utils";

/**
 * The small uppercase label above a heading. The artifacts carry two versions:
 *
 * - `brand`  landing pages: 12px, .12em, brand colour, in the body font
 * - `faint`  site pages: 11px, .14em, faint, in the mono font
 */
export function Eyebrow({
  tone = "brand",
  className,
  children,
}: {
  tone?: "brand" | "faint";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "block uppercase",
        tone === "brand"
          ? "text-xs font-bold tracking-[0.12em] text-brand"
          : "font-mono text-[11px] font-extrabold tracking-[0.14em] text-faint",
        className,
      )}
    >
      {children}
    </span>
  );
}
