"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { RAIL_GROUPS, SITE, type RailGroup } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The left rail: every page on the site, grouped and indented.
 *
 * The draft's own navigation, and the thing that makes this site legible. Forty
 * eight pages is more than a header can hold, so the header carries the seven a
 * visitor is most likely to want and the rail carries all of them, the way
 * documentation sites and admin tools do.
 *
 * Sticky and its own scroll container, so it stays put while a long legal page
 * runs past it. It keeps a scrollbar rather than hiding one: forty eight items do
 * not fit on a laptop screen and how far down the list you are is worth knowing.
 *
 * Groups collapse. Which ones are open is local state rather than anything
 * persisted: it is a property of looking at the nav, not of the site.
 */
export function SiteRail() {
  const pathname = usePathname();

  const [closed, setClosed] = useState<ReadonlySet<string>>(new Set());

  const toggle = (title: string) =>
    setClosed((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  return (
    <nav
      aria-label="All pages"
      className="sticky top-0 hidden h-screen w-[252px] shrink-0 xl:w-[290px] overflow-y-auto border-r border-border bg-field pt-[30px] pb-10 lg:block"
    >
      <p className="px-6 pb-1 text-[15px] font-bold tracking-[-0.012em] text-ink">
        {SITE.name}
      </p>
      <p className="px-6 pb-[22px] font-mono text-[11px] font-semibold tracking-[0.1em] text-quiet uppercase">
        Website
      </p>

      <div className="flex gap-4 px-6 pb-5">
        <button
          type="button"
          onClick={() => setClosed(new Set())}
          className="font-mono text-[11px] font-semibold tracking-[0.08em] text-quiet uppercase hover:text-ink"
        >
          Expand all
        </button>
        <button
          type="button"
          onClick={() =>
            setClosed(new Set(RAIL_GROUPS.map((group) => group.title)))
          }
          className="font-mono text-[11px] font-semibold tracking-[0.08em] text-quiet uppercase hover:text-ink"
        >
          Collapse all
        </button>
      </div>

      {RAIL_GROUPS.map((group) => (
        <RailSection
          key={group.title}
          group={group}
          open={!closed.has(group.title)}
          onToggle={() => toggle(group.title)}
          pathname={pathname}
        />
      ))}
    </nav>
  );
}

function RailSection({
  group,
  open,
  onToggle,
  pathname,
}: {
  group: RailGroup;
  open: boolean;
  onToggle: () => void;
  pathname: string;
}) {
  const id = `rail-${group.title.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className={cn(
          "flex w-full items-center justify-between gap-2.5 px-6 pt-6 pb-2 text-left font-mono text-[11px] font-bold tracking-[0.14em] uppercase transition-colors",
          group.highlight ? "text-active" : "text-ink hover:text-quiet",
        )}
      >
        <span>{group.title}</span>

        {/* A chevron drawn from two borders, as the draft draws it: no icon to
            load, and it rotates rather than swapping glyphs. */}
        <span aria-hidden className="relative size-3 shrink-0">
          <span
            className={cn(
              "absolute top-[3px] left-[2px] size-1.5 border-r-[1.5px] border-b-[1.5px] border-current transition-transform duration-150",
              open ? "-rotate-[135deg]" : "rotate-45",
            )}
          />
        </span>
      </button>

      {open ? (
        <div id={id}>
          {group.items.map((item) => (
            <div key={item.href}>
              {item.sub ? (
                <p className="px-6 pt-3.5 pb-1 font-mono text-[11px] font-semibold tracking-[0.02em] text-label">
                  {item.sub}
                </p>
              ) : null}

              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "block border-l-2 py-[6px] pr-5 text-[14.5px] leading-[1.4] transition-colors",
                  item.level === 3
                    ? "pl-[50px]"
                    : item.level === 2
                      ? "pl-9"
                      : "pl-6",
                  pathname === item.href
                    ? "border-active bg-well font-semibold text-ink"
                    : "border-transparent text-quiet hover:bg-well hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
