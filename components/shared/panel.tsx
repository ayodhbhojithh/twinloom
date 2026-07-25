import { cn } from "@/lib/utils";

/**
 * The artifacts' card: white on a hairline, with the faintest lift. `sm` is the
 * 12px radius the site pages use, the default is the 14px the landing uses.
 */
export function Panel({
  radius = "default",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { radius?: "default" | "sm" }) {
  return (
    <div
      className={cn(
        "border border-line bg-card",
        radius === "sm" ? "rounded-card-sm" : "rounded-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
