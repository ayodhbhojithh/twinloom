"use client";

import { useEffect, useRef } from "react";

import { styleFor, TAG } from "@/lib/builder/tokens";
import { isContainer } from "@/lib/builder/tree";
import type { BuilderNode } from "@/lib/builder/types";
import type { BuilderController } from "@/lib/hooks/use-builder";
import { cn } from "@/lib/utils";

/** The label on the outline, so a selected empty box still says what it is. */
const KIND_LABEL: Record<BuilderNode["kind"], string> = {
  section: "Section",
  container: "Container",
  grid: "Grid",
  heading: "Heading",
  text: "Text",
  button: "Button",
  image: "Image",
  divider: "Divider",
  spacer: "Spacer",
};

const EDITABLE = new Set(["heading", "text", "button"]);

/**
 * One node on the canvas.
 *
 * Renders the real element with real styles, then draws selection on top with a
 * ring rather than a border, because a border would change the box and everything
 * would shift the moment you clicked it. Nothing on the canvas may move because it
 * was selected.
 *
 * Text nodes are edited in place. `contentEditable` on the element itself, so what
 * you type is laid out by the same styles the export will use, and committed on
 * blur rather than per keystroke so the undo stack gets one entry per edit instead
 * of one per character.
 */
export function NodeView({
  node,
  builder,
  depth = 0,
}: {
  node: BuilderNode;
  builder: BuilderController;
  depth?: number;
}) {
  const { selectedId, hoveredId, select, hover, setContent } = builder;

  const selectedHere = selectedId === node.id;
  const hoveredHere = hoveredId === node.id && !selectedHere;
  const editable = EDITABLE.has(node.kind);

  /* The editable text lives in a span of its own rather than directly in the
     element. The element also holds the selection label, and writing `textContent`
     on a node wipes every child it has, label included. One extra span keeps the
     two apart: React owns the label, the DOM owns the words. */
  const textRef = useRef<HTMLSpanElement>(null);

  /* The DOM owns the text while it is being edited, so React must not overwrite it
     mid-keystroke. Writing it only when the value actually differs keeps the caret
     where the person left it. */
  useEffect(() => {
    if (!editable || !textRef.current) return;
    if (textRef.current.textContent !== (node.content ?? "")) {
      textRef.current.textContent = node.content ?? "";
    }
  }, [editable, node.content]);

  const Tag = TAG[node.kind] as "div";

  const common = {
    style: styleFor(node),
    "data-kind": node.kind,
    onClick: (event: React.MouseEvent) => {
      event.stopPropagation();
      select(node.id);
    },
    onMouseEnter: (event: React.MouseEvent) => {
      event.stopPropagation();
      hover(node.id);
    },
    onMouseLeave: () => hover(null),
    className: cn(
      "relative outline-none transition-[box-shadow] duration-150",
      /* Rings, not borders: they are drawn outside the box and cost no layout. */
      selectedHere && "ring-2 ring-brand ring-offset-0",
      hoveredHere && "ring-1 ring-brand/40",
      !selectedHere && "cursor-pointer",
      /* An empty container has nothing to click, so give it a minimum. */
      isContainer(node.kind) &&
        !node.children.length &&
        "min-h-16 ring-1 ring-line ring-dashed",
    ),
  };

  const label = selectedHere || hoveredHere ? (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -top-[19px] left-0 rounded-t-[4px] px-1.5 py-px font-mono text-[9px] font-bold tracking-[0.1em] whitespace-nowrap uppercase",
        selectedHere ? "bg-brand text-white" : "bg-brand/40 text-white",
      )}
    >
      {KIND_LABEL[node.kind]}
    </span>
  ) : null;

  if (editable) {
    return (
      <Tag {...common}>
        {label}

        <span
          ref={textRef}
          contentEditable={selectedHere}
          suppressContentEditableWarning
          spellCheck={false}
          className="block outline-none"
          onBlur={(event: React.FocusEvent<HTMLSpanElement>) => {
            const next = event.currentTarget.textContent ?? "";
            if (next !== node.content) setContent(node.id, next);
          }}
          onKeyDown={(event: React.KeyboardEvent<HTMLSpanElement>) => {
            if (event.key === "Escape") event.currentTarget.blur();
          }}
        />
      </Tag>
    );
  }

  return (
    <Tag {...common}>
      {label}
      {node.children.map((child) => (
        <NodeView
          key={child.id}
          node={child}
          builder={builder}
          depth={depth + 1}
        />
      ))}
    </Tag>
  );
}
