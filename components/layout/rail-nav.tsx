"use client";

import { useState } from "react";
import Link from "next/link";

import { RAIL_GROUPS, type RailGroup } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The grouped list of every page, shared by the docked rail and the menu.
 *
 * One component for both, because they are the same navigation seen at two widths.
 * When they were written twice the menu quietly lost the collapsing groups and the
 * indents, so a phone got forty eight flat rows where a laptop got ten groups.
 *
 * Which groups are open is local state. It is a property of looking at the nav
 * rather than of the site, and in the App Router the layout survives navigation, so
 * it holds while you move between pages and resets only on a reload, which is what
 * people expect of a disclosure.
 */
export function RailNav({
  pathname,
  onNavigate,
  size = "rail",
}: {
  pathname: string;
  /** The menu closes itself on the way out; the docked rail has nothing to do. */
  onNavigate?: () => void;
  size?: "rail" | "menu";
}) {
  const [closed, setClosed] = useState<ReadonlySet<string>>(new Set());

  const toggle = (title: string) =>
    setClosed((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  return (
    <>
      {RAIL_GROUPS.map((group) => (
        <RailSection
          key={group.title}
          group={group}
          open={!closed.has(group.title)}
          onToggle={() => toggle(group.title)}
          pathname={pathname}
          onNavigate={onNavigate}
          size={size}
        />
      ))}
    </>
  );
}

/** Expand and collapse everything, for a list this long. */
export function RailTools({
  onExpandAll,
  onCollapseAll,
  className,
}: {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-4", className)}>
      <button
        type="button"
        onClick={onExpandAll}
        className="font-mono text-[11px] font-semibold tracking-[0.08em] text-quiet uppercase hover:text-ink"
      >
        Expand all
      </button>
      <button
        type="button"
        onClick={onCollapseAll}
        className="font-mono text-[11px] font-semibold tracking-[0.08em] text-quiet uppercase hover:text-ink"
      >
        Collapse all
      </button>
    </div>
  );
}

function RailSection({
  group,
  open,
  onToggle,
  pathname,
  onNavigate,
  size,
}: {
  group: RailGroup;
  open: boolean;
  onToggle: () => void;
  pathname: string;
  onNavigate?: () => void;
  size: "rail" | "menu";
}) {
  const id = `nav-${group.title.replace(/\W+/g, "-").toLowerCase()}`;
  const menu = size === "menu";

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className={cn(
          "flex w-full items-center justify-between gap-2.5 text-left font-mono text-[11px] font-bold tracking-[0.14em] uppercase transition-colors",
          menu ? "px-1 pt-6 pb-2" : "px-6 pt-6 pb-2",
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
                <p
                  className={cn(
                    "pt-3.5 pb-1 font-mono text-[11px] font-semibold tracking-[0.02em] text-label",
                    menu ? "px-1" : "px-6",
                  )}
                >
                  {item.sub}
                </p>
              ) : null}

              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "block border-l-2 transition-colors",
                  menu
                    ? "py-2.5 pr-2 text-[15px] leading-[1.4]"
                    : "py-[6px] pr-5 text-[14.5px] leading-[1.4]",
                  item.level === 3
                    ? menu
                      ? "pl-9"
                      : "pl-[50px]"
                    : item.level === 2
                      ? menu
                        ? "pl-5"
                        : "pl-9"
                      : menu
                        ? "pl-3"
                        : "pl-6",
                  pathname === item.href
                    ? "border-active bg-well font-semibold text-active"
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
