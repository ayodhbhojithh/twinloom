import { cn } from "@/lib/utils";

/**
 * The small uppercase mono label the prototype uses to caption everything. Kept
 * as a component because the tracking and size are easy to get subtly wrong.
 */
export function MonoLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-5 uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
