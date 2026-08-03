import Link from "next/link";

import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Tally } from "@/lib/build/derive";

/**
 * The four numbers, and the line under them.
 *
 * It appears on the build screen and on the site screen, reading the same
 * answers, so the count somebody is watching change while they pick cannot
 * disagree with the count on the page that describes the result.
 *
 * The numbers are the loud part and the labels are quiet, because the labels do
 * not change and the numbers do. `tabular-nums` keeps the row from shuffling
 * sideways every time one of them ticks over.
 */
export function TallyStrip({
  tally,
  title,
  note,
  linkToSite,
  className,
}: {
  tally: Tally;
  title?: string;
  note: string;
  linkToSite?: boolean;
  className?: string;
}) {
  const cells = [
    { value: tally.groups, label: "groups of people" },
    { value: tally.things, label: "things to do" },
    { value: tally.pages, label: "pages, as it stands" },
    { value: tally.needs, label: "things we need from you" },
  ];

  return (
    <section
      className={cn(
        "max-w-measure overflow-hidden rounded-card bg-well",
        className,
      )}
    >
      {title ? (
        <div className="flex items-baseline justify-between gap-3.5 border-b border-border px-5 pt-4 pb-3.5 sm:px-7 sm:pt-5 sm:pb-4">
          <b className="text-[17px] font-normal text-ink sm:text-[19px]">
            {title}
          </b>
          <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-label uppercase">
            Live
          </span>
        </div>
      ) : null}

      {/* Four across when there is room, two by two when there is not. The
          dividers are worked out per cell rather than with a border on every
          edge, because which cell starts a row changes with the count. */}
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {cells.map((cell, at) => (
          <div
            key={cell.label}
            className={cn(
              "border-border px-5 py-5 sm:px-7 sm:py-7",
              at > 0 && "border-l",
              at >= 2 && "border-t sm:border-t-0",
              at === 2 && "border-l-0 sm:border-l",
            )}
          >
            <b className="block text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink tabular-nums sm:text-[40px]">
              {cell.value}
            </b>
            <span className="mt-2 block font-mono text-[10.5px] font-semibold tracking-[0.1em] text-quiet uppercase sm:text-[11px]">
              {cell.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-border px-5 py-4 sm:px-7 sm:py-[18px]">
        <p className="text-[14.5px] leading-[1.5] text-quiet sm:text-[15.5px]">
          {note}
        </p>

        {linkToSite ? (
          <Link
            href={ROUTES.site}
            className="shrink-0 text-[14.5px] font-semibold text-ink underline decoration-planned decoration-1 underline-offset-4 transition-colors hover:decoration-ink sm:text-[15.5px]"
          >
            See the full site description
          </Link>
        ) : null}
      </div>
    </section>
  );
}
