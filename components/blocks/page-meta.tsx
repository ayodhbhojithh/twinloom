import { cn } from "@/lib/utils";

export interface PageMetaValues {
  /** The SEO title. Absolute: it is not appended to. */
  title: string;
  description: string;
  /** Stated only where it is not the default. The draft says so on error pages. */
  indexing?: string;
}

/**
 * The draft's `.seom`: the page's own metadata, shown on the page.
 *
 * It is drafting information rather than copy, and the draft labels it as such,
 * but that is exactly why it is here: this site is being written and reviewed, and
 * an SEO title nobody can see is an SEO title nobody checks. It sits at the foot of
 * the page, in the well tint, in mono, so it reads as an annotation on the page
 * rather than as part of it.
 *
 * The same values are passed to the route's `metadata` export, from one object per
 * page, so what is shown here and what a crawler receives cannot disagree.
 *
 * `aria-hidden`, and out of the tab order. A screen reader announcing the meta
 * description after the content would be reading the page a second time in
 * summary, which is not useful to anyone.
 */
export function PageMeta({
  values,
  className,
}: {
  values: PageMetaValues;
  className?: string;
}) {
  const rows = [
    { key: "SEO title", value: values.title },
    { key: "Meta description", value: values.description },
    ...(values.indexing
      ? [{ key: "Indexing", value: values.indexing }]
      : []),
  ];

  return (
    <aside
      aria-hidden
      className={cn(
        "mt-12 max-w-measure rounded-card bg-well px-5 py-4",
        className,
      )}
    >
      <p className="mb-2.5 font-mono text-[11px] font-semibold tracking-[0.1em] text-label uppercase">
        Page metadata, not shown on the page
      </p>

      <dl>
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex flex-col gap-0.5 py-1 text-[14px] sm:flex-row sm:gap-3.5"
          >
            <dt className="shrink-0 pt-[3px] font-mono text-[11px] font-semibold tracking-[0.06em] text-quiet uppercase sm:w-[132px]">
              {row.key}
            </dt>
            <dd className="min-w-0 flex-1 text-quiet">{row.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
