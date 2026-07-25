/**
 * The counter that sits opposite a section label. One component so all four
 * sections count the same way, and so an empty section shows nothing at all
 * rather than a zero.
 *
 * A bare number rather than a pill: four pills down a narrow panel is four more
 * shapes for information that is two glyphs wide.
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
      className={
        "font-mono text-[9.5px] font-bold tracking-[0.06em] tabular-nums " +
        (atLimit ? "text-brand" : "text-faint/70")
      }
    >
      {limit === undefined ? value : `${value}/${limit}`}
    </span>
  );
}
