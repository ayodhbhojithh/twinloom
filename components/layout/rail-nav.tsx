"use client";

import { useState } from "react";
import Link from "next/link";

import { RAIL_GROUPS, type RailGroup, type RailItem } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Where everything in the nav lines up.
 *
 * One table rather than a ternary at each use. Every row in the list, at either
 * size, gets its left offset from here, so a group heading, a sub label and a
 * third level link cannot drift apart as any of them is adjusted.
 *
 * The indents are additive: a level two item is its container's gutter plus 14, a
 * level three is plus 28. Half steps, because the nesting is shallow and a full
 * 24px per level would walk a third level page halfway across a 252px rail.
 */
const GUTTER = { rail: 24, menu: 4 } as const;
const INDENT = { 1: 0, 2: 14, 3: 28 } as const;

const offset = (size: keyof typeof GUTTER, level: RailItem["level"]) =>
  GUTTER[size] + INDENT[level ?? 1];

/**
 * The grouped list of every page, shared by the docked rail and the menu.
 *
 * One component for both, because they are the same navigation seen at two widths.
 * Written twice, the menu quietly lost the collapsing groups and the indents, so a
 * phone got forty eight flat rows where a laptop got ten groups.
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
  closed,
  onToggle,
}: {
  pathname: string;
  /** The menu closes itself on the way out; the docked rail has nothing to do. */
  onNavigate?: () => void;
  size?: keyof typeof GUTTER;
  closed: ReadonlySet<string>;
  onToggle: (title: string) => void;
}) {
  return (
    <>
      {RAIL_GROUPS.map((group) => (
        <RailSection
          key={group.title}
          group={group}
          open={!closed.has(group.title)}
          onToggle={() => onToggle(group.title)}
          pathname={pathname}
          onNavigate={onNavigate}
          size={size}
        />
      ))}
    </>
  );
}

/** Holds which groups are shut, and the two ways of shutting all of them. */
export function useRailGroups() {
  const [closed, setClosed] = useState<ReadonlySet<string>>(new Set());

  return {
    closed,
    toggle: (title: string) =>
      setClosed((current) => {
        const next = new Set(current);
        if (next.has(title)) next.delete(title);
        else next.add(title);
        return next;
      }),
    expandAll: () => setClosed(new Set()),
    collapseAll: () =>
      setClosed(new Set(RAIL_GROUPS.map((group) => group.title))),
  };
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
  size: keyof typeof GUTTER;
}) {
  const id = `nav-${group.title.replace(/\W+/g, "-").toLowerCase()}`;
  const gutter = GUTTER[size];

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        style={{ paddingLeft: gutter, paddingRight: gutter }}
        className={cn(
          "flex w-full items-center justify-between gap-2.5 pt-6 pb-2 text-left font-mono text-[11px] font-bold tracking-[0.14em] uppercase transition-colors",
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
                  style={{ paddingLeft: offset(size, item.level) }}
                  className="pt-4 pb-1 font-mono text-[11px] font-semibold tracking-[0.02em] text-label"
                >
                  {item.sub}
                </p>
              ) : null}

              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={pathname === item.href ? "page" : undefined}
                style={{
                  /* The 2px active bar is drawn inside the link's left edge, so
                     the padding carries it and every level's text still lands on
                     its own indent. */
                  paddingLeft: offset(size, item.level) - 2,
                  paddingRight: gutter,
                }}
                className={cn(
                  "block border-l-2 transition-colors",
                  size === "menu"
                    ? "py-2.5 text-[15px] leading-[1.4]"
                    : "py-[7px] text-[14.5px] leading-[1.4]",
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
