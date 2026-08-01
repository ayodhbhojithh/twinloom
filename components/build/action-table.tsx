"use client";

import { OWN_ICON } from "@/lib/build/data";
import type { ActionBand, OwnAction } from "@/lib/build/derive";
import { cn } from "@/lib/utils";

import { Glyph } from "./glyph";

/**
 * Everything a visitor can do, as one table.
 *
 * One table rather than a list per band, so the columns line up the whole way
 * down and the middle one can keep saying what each tick actually puts on the
 * site. The bands sit inside it as full width rows.
 *
 * Below the wide breakpoint the middle column is dropped and its line is folded
 * under the name instead. The information is the point, not the column.
 */
export function ActionTable({
  bands,
  picked,
  own,
  ownBand,
  onToggle,
  onRemoveOwn,
}: {
  bands: readonly ActionBand[];
  picked: readonly string[];
  own: readonly OwnAction[];
  ownBand: { name: string; sub: string };
  onToggle: (key: string) => void;
  onRemoveOwn: (key: string) => void;
}) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <Th>What a visitor can do</Th>
          <Th className="hidden w-[31%] lg:table-cell">
            What it puts on the site
          </Th>
          <Th className="w-[88px] pr-0 text-right">On the list</Th>
        </tr>
      </thead>

      <tbody>
        {bands.map((band) => (
          <BandRows
            key={band.name}
            name={band.name}
            sub={band.sub}
            count={band.items.length}
          >
            {band.items.map((action) => {
              const on = picked.includes(action.key);
              const page = action.page
                ? action.page
                : action.need === "talk"
                  ? "a window on every page"
                  : "no page of its own";

              return (
                <tr
                  key={action.key}
                  onClick={() => onToggle(action.key)}
                  className="cursor-pointer hover:bg-well"
                >
                  <Cell
                    icon={action.icon}
                    name={action.name}
                    sub={action.sub}
                    foot={
                      action.page
                        ? `Adds ${action.page}`
                        : action.need === "talk"
                          ? "A window on every page"
                          : "No page of its own"
                    }
                    on={on}
                  />

                  <td
                    className={cn(
                      "hidden border-b border-hair py-[11px] pr-3 text-[13.5px] leading-[1.35] lg:table-cell",
                      on ? "text-ink" : "text-quiet",
                      !action.page && "text-label",
                    )}
                  >
                    {page}
                  </td>

                  <td className="border-b border-hair p-0 text-right">
                    <button
                      type="button"
                      aria-pressed={on}
                      className={cn(
                        "cursor-pointer py-[11px] pl-3 font-mono text-[10px] font-bold tracking-[0.14em] whitespace-nowrap uppercase transition-colors",
                        on ? "text-done" : "text-label hover:text-ink",
                      )}
                    >
                      {on ? "Picked" : "Pick"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </BandRows>
        ))}

        {own.length ? (
          <BandRows name={ownBand.name} sub={ownBand.sub} count={own.length}>
            {own.map((entry) => (
              <tr key={entry.key} className="hover:bg-well">
                <Cell
                  icon={OWN_ICON}
                  name={entry.name}
                  sub="Added by you, and on the list."
                  foot="A page of its own, to talk about"
                  on
                />

                <td className="hidden border-b border-hair py-[11px] pr-3 text-[13.5px] leading-[1.35] text-label lg:table-cell">
                  a page of its own, to talk about
                </td>

                <td className="border-b border-hair p-0 text-right">
                  <button
                    type="button"
                    onClick={() => onRemoveOwn(entry.key)}
                    className="cursor-pointer py-[11px] pl-3 font-mono text-[10px] font-bold tracking-[0.14em] whitespace-nowrap text-label uppercase transition-colors hover:text-ink"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </BandRows>
        ) : null}
      </tbody>
    </table>
  );
}

function Th({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-border pr-3 pb-2 text-left font-mono text-[10px] font-bold tracking-[0.14em] text-label uppercase",
        className,
      )}
    >
      {children}
    </th>
  );
}

/** A band heading and the rows under it, as sibling rows of one table. */
function BandRows({
  name,
  sub,
  count,
  children,
}: {
  name: string;
  sub: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <tr>
        <td colSpan={3} className="border-b border-hair pt-[21px] pb-[7px]">
          <h4 className="mb-0.5 font-mono text-[10.5px] font-bold tracking-[0.14em] text-label uppercase">
            {name}
            <span className="ml-[9px] text-[10px] font-normal tracking-normal text-idx tabular-nums">
              {count}
            </span>
          </h4>
          <span className="block text-[12.5px] leading-[1.45] text-quiet normal-case">
            {sub}
          </span>
        </td>
      </tr>
      {children}
    </>
  );
}

/** The first cell, which is the same shape in every row. */
function Cell({
  icon,
  name,
  sub,
  foot,
  on,
}: {
  icon: string;
  name: string;
  sub: string;
  foot: string;
  on: boolean;
}) {
  return (
    <td className="border-b border-hair p-0 align-middle">
      <span className="flex items-center gap-3.5 py-[11px] pr-3">
        <span
          className={cn(
            "size-6 flex-none transition-colors",
            on ? "text-ink" : "text-quiet",
          )}
        >
          <Glyph path={icon} className="size-6" />
        </span>

        <span className="block min-w-0">
          <span
            className={cn(
              "block text-[15px] leading-[1.3] text-ink",
              on ? "font-bold" : "font-semibold",
            )}
          >
            {name}
          </span>
          <span className="block text-[12.5px] leading-[1.4] text-quiet">
            {sub}
          </span>
          <span className="mt-[3px] block font-mono text-[10px] font-bold tracking-[0.12em] text-label uppercase lg:hidden">
            {foot}
          </span>
        </span>
      </span>
    </td>
  );
}
