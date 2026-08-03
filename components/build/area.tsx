"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * One of the two questions, as a row on the ladder.
 *
 * The header carries four things at once: what the question is, how far through
 * it you are as a bar, the same thing as a count, and whether the area is real
 * or still being written. The bar and the state label are the first to go on a
 * narrow screen, because they are the two that repeat something already said.
 *
 * Layer one has a fixed number of answers so its bar is segmented, one segment
 * per group. Layer two has a total that changes as groups are named, so a
 * segmented bar there would redraw itself every time somebody ticked a card; it
 * gets a proportional bar instead.
 */
export function Area({
  open,
  onToggle,
  title,
  sub,
  caption,
  got,
  total,
  bar,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  title: string;
  sub: string;
  caption: string;
  got: number;
  total: number;
  bar: "segments" | "proportion";
  children: React.ReactNode;
}) {
  const id = `area-${title.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <section className="border-b border-hair last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full cursor-pointer items-center gap-[13px] py-[15px] text-left"
      >
        <span
          aria-hidden
          className="flex size-[23px] flex-none items-center justify-center rounded-[6px] bg-well text-quiet transition-colors"
        >
          {open ? (
            <Minus className="size-3" strokeWidth={2.5} />
          ) : (
            <Plus className="size-3" strokeWidth={2.5} />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[16px] leading-[1.3] font-bold text-ink">
            {title}
          </span>
          <span className="mt-px block text-[13.5px] leading-[1.4] text-quiet">
            {sub}
          </span>
        </span>

        <span aria-hidden className="hidden w-[104px] flex-none lg:block">
          {bar === "segments" ? (
            <span className="flex gap-[2px]">
              {Array.from({ length: total }, (_, at) => (
                <span
                  key={at}
                  className={cn(
                    "h-[9px] flex-1 rounded-[2px] transition-colors",
                    at < got ? "bg-ink" : "bg-planned",
                  )}
                />
              ))}
            </span>
          ) : (
            <span className="block h-[9px] overflow-hidden rounded-[2px] bg-planned">
              <span
                className="block h-[9px] rounded-[2px] bg-ink transition-[width]"
                style={{ width: `${total ? Math.round((got / total) * 100) : 0}%` }}
              />
            </span>
          )}
        </span>

        <span className="w-[58px] flex-none text-right font-mono text-[11.5px] font-semibold text-quiet tabular-nums">
          {got} of {total}
        </span>

        <span className="hidden w-[86px] flex-none text-right font-mono text-[10.5px] font-bold tracking-[0.08em] text-label uppercase lg:block">
          Built
        </span>
      </button>

      {open ? (
        <div id={id} className="pb-[18px] lg:pl-9">
          <p className="pt-0.5 pb-2.5 font-mono text-[10.5px] font-bold tracking-[0.14em] text-label uppercase">
            {caption}
          </p>
          {children}
        </div>
      ) : null}
    </section>
  );
}
