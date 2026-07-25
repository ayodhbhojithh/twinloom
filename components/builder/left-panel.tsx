"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Columns3,
  Heading,
  Image as ImageIcon,
  Minus,
  MousePointerClick,
  MoveVertical,
  Square,
  SquareStack,
  Type,
  type LucideIcon,
} from "lucide-react";

import { KIND_NAME } from "@/lib/builder/tokens";
import { isContainer } from "@/lib/builder/tree";
import type { BuilderNode, NodeKind } from "@/lib/builder/types";
import type { BuilderController } from "@/lib/hooks/use-builder";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<NodeKind, LucideIcon> = {
  section: SquareStack,
  container: Square,
  grid: Columns3,
  heading: Heading,
  text: Type,
  button: MousePointerClick,
  image: ImageIcon,
  divider: Minus,
  spacer: MoveVertical,
};

/** What the palette offers, in the order people reach for it. */
const PALETTE: { kind: NodeKind; hint: string }[] = [
  { kind: "section", hint: "A full width band" },
  { kind: "container", hint: "A box that holds things" },
  { kind: "grid", hint: "Equal columns" },
  { kind: "heading", hint: "Display type" },
  { kind: "text", hint: "A paragraph" },
  { kind: "button", hint: "A call to action" },
  { kind: "image", hint: "A picture block" },
  { kind: "divider", hint: "A hairline" },
  { kind: "spacer", hint: "Empty height" },
];

/**
 * Layers and Components, in the two tabs the reference uses.
 *
 * Layers is the document as an outline, which is the only view that shows nesting
 * plainly. On a canvas, a container with no padding is invisible until you hit it;
 * here it is a row like any other.
 */
export function LeftPanel({ builder }: { builder: BuilderController }) {
  const [tab, setTab] = useState<"Layers" | "Components">("Layers");

  return (
    <>
      <div className="shrink-0 p-3 pb-2">
        <div className="flex gap-0.5 rounded-[8px] bg-panel-bg p-0.5">
          {(["Layers", "Components"] as const).map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setTab(entry)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-[6px] py-1.5 font-mono text-[9px] font-bold tracking-[0.12em] uppercase transition-colors",
                entry === tab
                  ? "bg-white text-ink"
                  : "text-faint hover:text-ink",
              )}
            >
              {entry}
              {entry === "Layers" ? (
                <span className="font-normal text-faint tabular-nums">
                  {builder.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-scroll min-h-0 flex-1 overflow-y-auto px-1.5 pb-6">
        {tab === "Layers" ? (
          <LayerRow node={builder.root} builder={builder} depth={0} />
        ) : (
          <div className="flex flex-col gap-1 px-1">
            {PALETTE.map((entry) => {
              const Icon = KIND_ICON[entry.kind];

              return (
                <button
                  key={entry.kind}
                  type="button"
                  onClick={() => builder.add(entry.kind)}
                  className="group flex items-center gap-2.5 rounded-[7px] px-2 py-2 text-left transition-colors hover:bg-panel-bg"
                >
                  <span
                    aria-hidden
                    className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-panel-bg text-faint transition-colors group-hover:bg-soft group-hover:text-brand"
                  >
                    <Icon className="size-3.5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] leading-tight font-bold">
                      {KIND_NAME[entry.kind]}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] leading-tight text-faint">
                      {entry.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * One row of the outline, and its children.
 *
 * Collapsed state is local to the row rather than held in the document: which
 * branches you have folded is a property of looking at the tree, not of the tree,
 * and it has no business in the undo stack.
 */
function LayerRow({
  node,
  builder,
  depth,
}: {
  node: BuilderNode;
  builder: BuilderController;
  depth: number;
}) {
  const [open, setOpen] = useState(true);

  const Icon = KIND_ICON[node.kind];
  const selected = builder.selectedId === node.id;
  const hovered = builder.hoveredId === node.id;
  const canOpen = node.children.length > 0;

  return (
    <>
      <div
        className={cn(
          "group flex items-center rounded-[6px] transition-colors",
          selected ? "bg-soft" : hovered ? "bg-panel-bg" : "hover:bg-panel-bg",
        )}
        style={{ marginLeft: `${depth * 11}px` }}
        onMouseEnter={() => builder.hover(node.id)}
        onMouseLeave={() => builder.hover(null)}
      >
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Collapse" : "Expand"}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-[4px] text-faint transition-colors",
            canOpen ? "hover:text-ink" : "pointer-events-none opacity-0",
          )}
        >
          {open ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
        </button>

        <button
          type="button"
          onClick={() => builder.select(node.id)}
          className="flex min-w-0 flex-1 items-center gap-1.5 py-1.5 pr-2 text-left"
        >
          <Icon
            aria-hidden
            className={cn(
              "size-3 shrink-0",
              selected ? "text-brand" : "text-faint",
            )}
          />

          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[11.5px]",
              selected ? "font-bold text-ink" : "font-medium text-body",
            )}
          >
            {node.content?.trim() || KIND_NAME[node.kind]}
          </span>

          {isContainer(node.kind) && canOpen ? (
            <span className="shrink-0 font-mono text-[9px] text-faint/70 tabular-nums">
              {node.children.length}
            </span>
          ) : null}
        </button>
      </div>

      {open
        ? node.children.map((child) => (
            <LayerRow
              key={child.id}
              node={child}
              builder={builder}
              depth={depth + 1}
            />
          ))
        : null}
    </>
  );
}
