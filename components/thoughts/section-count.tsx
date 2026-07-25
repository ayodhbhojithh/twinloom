import { cn } from "@/lib/utils";

/**
 * The counter that sits opposite a section label. One component so all four
 * sections count the same way, and so an empty section shows nothing at all
 * rather than a zero.
 */
export function SectionCount({
  value,
  limit,
}: {
  value: number;
  limit?: number;
}) {
  if (!value && limit === undefined) return undefined;

  const atLimit = limit !== undefined && value >= limit;

  return (
    <span
      className={cn(
        "rounded-pill px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums",
        atLimit ? "bg-brand/10 text-brand" : "bg-panel-bg text-faint",
      )}
    >
      {limit === undefined ? value : `${value}/${limit}`}
    </span>
  );
}
