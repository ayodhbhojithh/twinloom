import type { PageZone } from "@/lib/build/derive";
import { cn } from "@/lib/utils";

/**
 * The derived site, grouped by what put each page there.
 *
 * It is not a sitemap. It is an argument: every page carries the number of its
 * place in the site and, where a group asked for it, who asked. A client reading
 * this should be able to point at any line and find their own answer behind it.
 *
 * `compact` is the same map at panel width, which is where it sits beside the
 * questions while they are being answered.
 */
export function SiteMap({
  zones,
  compact,
  className,
}: {
  zones: readonly PageZone[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-border",
        compact ? "w-full" : "max-w-measure",
        className,
      )}
    >
      {zones.map((zone) => (
        <div
          key={zone.key}
          className={cn(
            "border-t border-hair first:border-t-0",
            compact ? "px-[15px] pt-[13px] pb-[11px]" : "px-[18px] pt-[15px] pb-[13px]",
          )}
        >
          <div className="mb-0.5 flex items-baseline gap-2.5">
            <h4 className="font-mono text-[10.5px] font-bold tracking-[0.12em] text-ink uppercase">
              {zone.title}
            </h4>
            <span className="font-mono text-[10px] text-idx tabular-nums">
              {zone.pages.length} {zone.pages.length === 1 ? "page" : "pages"}
            </span>
          </div>

          <p
            className={cn(
              "mb-2 leading-[1.45] text-quiet",
              compact ? "text-[12.5px]" : "text-[13px]",
            )}
          >
            {zone.sub}
          </p>

          {zone.pages.map((page) => (
            <div
              key={`${zone.key}-${page.index}`}
              className="flex items-baseline gap-2.5 py-[3px]"
            >
              <span className="min-w-[18px] flex-none font-mono text-[10px] text-idx tabular-nums">
                {page.index}
              </span>

              <span
                className={cn(
                  "font-medium text-ink",
                  compact ? "text-[13.5px] leading-[1.35]" : "text-[14px]",
                )}
              >
                {page.name}
              </span>

              {page.who ? (
                <span className="font-mono text-[9.5px] font-semibold tracking-[0.07em] text-quiet uppercase">
                  for {page.who}
                </span>
              ) : null}

              {page.flag ? (
                <span className="font-mono text-[9.5px] font-semibold tracking-[0.07em] text-label uppercase">
                  {page.flag}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
