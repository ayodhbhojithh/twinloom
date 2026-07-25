import { cn } from "@/lib/utils";

/**
 * The prototype's card: 18px radius, one hairline border, white surface. Used
 * anywhere a block of content needs to read as a panel rather than as page.
 */
export function Panel({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-card border border-hairline bg-surface",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
