import { classesFor, TAG } from "./tokens";
import {
  CONTAINER_KINDS,
  type BuilderNode,
  type NodeKind,
} from "./types";

/* ---------------------------------------------------------------------------
   Tree operations, all pure.

   Every one takes a root and returns a new root. Nothing mutates, which is what
   makes undo a list of previous roots rather than a log of inverse operations.
--------------------------------------------------------------------------- */

let counter = 0;

/** Ids only have to be unique within a document, and they never leave one. */
export function newId(kind: NodeKind): string {
  counter += 1;
  return `${kind}-${counter.toString(36)}`;
}

export function isContainer(kind: NodeKind): boolean {
  return CONTAINER_KINDS.includes(kind);
}

const EMPTY_BOX = { t: 0, r: 0, b: 0, l: 0 };

/**
 * A new node of a kind, with defaults chosen so that dropping one in never looks
 * broken. A heading arrives display sized, a button arrives padded and filled, a
 * section arrives with room to breathe. Nobody should have to configure a node
 * before it looks like the thing they asked for.
 */
export function createNode(kind: NodeKind): BuilderNode {
  const base: BuilderNode = {
    id: newId(kind),
    kind,
    style: {
      bg: "none",
      radius: "none",
      shadow: "none",
      border: false,
      opacity: 100,
      width: "auto",
      maxWidth: "none",
    },
    layout: {
      direction: "col",
      align: "stretch",
      justify: "start",
      gap: 0,
      wrap: false,
      columns: 2,
    },
    text: { tone: "ink", align: "left", weight: "normal", size: "base" },
    pad: { ...EMPTY_BOX },
    margin: { ...EMPTY_BOX },
    children: [],
  };

  switch (kind) {
    case "section":
      return {
        ...base,
        style: { ...base.style, bg: "panel", width: "full" },
        layout: { ...base.layout, align: "center", gap: 6 },
        pad: { t: 16, r: 6, b: 16, l: 6 },
      };

    case "container":
      return {
        ...base,
        layout: { ...base.layout, align: "center", gap: 4 },
        style: { ...base.style, width: "full", maxWidth: "3xl" },
      };

    case "grid":
      return {
        ...base,
        style: { ...base.style, width: "full" },
        layout: { ...base.layout, gap: 4, columns: 3 },
        children: [createNode("container"), createNode("container"), createNode("container")],
      };

    case "heading":
      return {
        ...base,
        content: "Build something beautiful.",
        text: { tone: "ink", align: "center", weight: "extrabold", size: "5xl" },
      };

    case "text":
      return {
        ...base,
        content:
          "A short line about what this section is for, and why anyone should read on.",
        text: { tone: "body", align: "center", weight: "normal", size: "lg" },
        style: { ...base.style, maxWidth: "xl" },
      };

    case "button":
      return {
        ...base,
        content: "Get started",
        style: { ...base.style, bg: "ink", radius: "lg", width: "fit" },
        text: { tone: "white", align: "center", weight: "bold", size: "sm" },
        pad: { t: 3, r: 5, b: 3, l: 5 },
      };

    case "image":
      return {
        ...base,
        style: { ...base.style, bg: "line", radius: "xl", width: "full" },
        layout: { ...base.layout, gap: 40 },
      };

    case "divider":
      return { ...base, style: { ...base.style, bg: "line", width: "full" } };

    case "spacer":
      return { ...base, layout: { ...base.layout, gap: 8 } };

    default:
      return base;
  }
}

export function findNode(root: BuilderNode, id: string): BuilderNode | null {
  if (root.id === id) return root;

  for (const child of root.children) {
    const found = findNode(child, id);
    if (found) return found;
  }

  return null;
}

/** The node holding `id`, or null for the root. */
export function findParent(
  root: BuilderNode,
  id: string,
): BuilderNode | null {
  for (const child of root.children) {
    if (child.id === id) return root;

    const found = findParent(child, id);
    if (found) return found;
  }

  return null;
}

/** Every id from `node` down, for cleaning up selection after a delete. */
export function idsIn(node: BuilderNode): string[] {
  return [node.id, ...node.children.flatMap(idsIn)];
}

function mapTree(
  node: BuilderNode,
  change: (node: BuilderNode) => BuilderNode,
): BuilderNode {
  const next = change(node);
  return { ...next, children: next.children.map((child) => mapTree(child, change)) };
}

export function updateNode(
  root: BuilderNode,
  id: string,
  change: (node: BuilderNode) => BuilderNode,
): BuilderNode {
  return mapTree(root, (node) => (node.id === id ? change(node) : node));
}

/**
 * Inserts a child. If the target cannot hold children, the new node goes in
 * beside it instead of being refused: a click on a heading followed by "add
 * button" means "put a button here", and arguing about it is not helpful.
 */
export function insertNode(
  root: BuilderNode,
  targetId: string,
  node: BuilderNode,
): BuilderNode {
  const target = findNode(root, targetId);
  if (!target) return { ...root, children: [...root.children, node] };

  if (isContainer(target.kind)) {
    return updateNode(root, targetId, (current) => ({
      ...current,
      children: [...current.children, node],
    }));
  }

  const parent = findParent(root, targetId);
  if (!parent) return { ...root, children: [...root.children, node] };

  return updateNode(root, parent.id, (current) => {
    const at = current.children.findIndex((child) => child.id === targetId);
    const children = [...current.children];
    children.splice(at + 1, 0, node);
    return { ...current, children };
  });
}

export function removeNode(root: BuilderNode, id: string): BuilderNode {
  return mapTree(root, (node) => ({
    ...node,
    children: node.children.filter((child) => child.id !== id),
  }));
}

/** A copy of `node` and everything under it, with fresh ids. */
export function cloneNode(node: BuilderNode): BuilderNode {
  return {
    ...structuredClone(node),
    id: newId(node.kind),
    children: node.children.map(cloneNode),
  };
}

export function duplicateNode(
  root: BuilderNode,
  id: string,
): { root: BuilderNode; id: string } | null {
  const node = findNode(root, id);
  const parent = findParent(root, id);
  if (!node || !parent) return null;

  const copy = cloneNode(node);

  return {
    id: copy.id,
    root: updateNode(root, parent.id, (current) => {
      const at = current.children.findIndex((child) => child.id === id);
      const children = [...current.children];
      children.splice(at + 1, 0, copy);
      return { ...current, children };
    }),
  };
}

/** Moves a node among its siblings. Returns the root unchanged at either end. */
export function moveNode(
  root: BuilderNode,
  id: string,
  direction: -1 | 1,
): BuilderNode {
  const parent = findParent(root, id);
  if (!parent) return root;

  const at = parent.children.findIndex((child) => child.id === id);
  const to = at + direction;
  if (to < 0 || to >= parent.children.length) return root;

  return updateNode(root, parent.id, (current) => {
    const children = [...current.children];
    const [moved] = children.splice(at, 1);
    children.splice(to, 0, moved);
    return { ...current, children };
  });
}

/**
 * Wraps a node in a fresh container, in place.
 *
 * The one structural move that is tedious by hand and constant in practice: you
 * have two buttons that need to sit in a row, so they need a parent.
 */
export function wrapNode(
  root: BuilderNode,
  id: string,
): { root: BuilderNode; id: string } | null {
  const node = findNode(root, id);
  const parent = findParent(root, id);
  if (!node || !parent) return null;

  const wrapper = createNode("container");
  wrapper.style = { ...wrapper.style, maxWidth: "none" };
  wrapper.layout = { ...wrapper.layout, direction: "row", justify: "center" };
  wrapper.children = [node];

  return {
    id: wrapper.id,
    root: updateNode(root, parent.id, (current) => ({
      ...current,
      children: current.children.map((child) =>
        child.id === id ? wrapper : child,
      ),
    })),
  };
}

/* ---------------------------------------------------------------------------
   Export
--------------------------------------------------------------------------- */

const VOID_KINDS: NodeKind[] = ["divider", "spacer"];

function escape(text: string): string {
  return text.replace(/[{}]/g, (match) => `{"${match}"}`);
}

/**
 * The tree as JSX with Tailwind classes.
 *
 * Real, pasteable output rather than a description of the tree: same tag per kind
 * as the canvas renders, classes from the same tokens the canvas styles with, and
 * indentation that matches the nesting so it reads as something a person wrote.
 */
export function toJsx(node: BuilderNode, depth = 0): string {
  const pad = "  ".repeat(depth);
  const tag = TAG[node.kind];
  const classes = classesFor(node);
  const attr = classes ? ` className="${classes}"` : "";

  if (VOID_KINDS.includes(node.kind)) return `${pad}<${tag}${attr} />`;

  if (node.content !== undefined && !node.children.length) {
    return `${pad}<${tag}${attr}>${escape(node.content)}</${tag}>`;
  }

  if (!node.children.length) return `${pad}<${tag}${attr} />`;

  const inner = node.children
    .map((child) => toJsx(child, depth + 1))
    .join("\n");

  return `${pad}<${tag}${attr}>\n${inner}\n${pad}</${tag}>`;
}

export function exportComponent(root: BuilderNode): string {
  return `export function Section() {\n  return (\n${toJsx(root, 2)}\n  );\n}\n`;
}

/* ---------------------------------------------------------------------------
   The starting document
--------------------------------------------------------------------------- */

/** A hero worth opening on: something already composed, ready to be pulled apart. */
export function starterDoc(): BuilderNode {
  const heading = createNode("heading");
  const text = createNode("text");

  const primary = createNode("button");
  const secondary = createNode("button");
  secondary.content = "Learn more";
  secondary.style = { ...secondary.style, bg: "none" };
  secondary.text = { ...secondary.text, tone: "ink" };

  const buttons = createNode("container");
  buttons.style = { ...buttons.style, maxWidth: "none", width: "fit" };
  buttons.layout = {
    ...buttons.layout,
    direction: "row",
    align: "center",
    justify: "center",
    gap: 3,
  };
  buttons.children = [primary, secondary];

  const inner = createNode("container");
  inner.layout = { ...inner.layout, align: "center", gap: 5 };
  inner.children = [heading, text, buttons];

  const section = createNode("section");
  section.children = [inner];

  return section;
}
