"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  cloneNode,
  duplicateNode,
  exportComponent,
  findNode,
  findParent,
  insertNode,
  createNode,
  moveNode,
  removeNode,
  starterDoc,
  updateNode,
  wrapNode,
} from "@/lib/builder/tree";
import type {
  BuilderNode,
  Device,
  NodeKind,
  NodeLayout,
  NodeStyle,
  NodeText,
} from "@/lib/builder/types";

const LIMIT = 60;

const STORAGE_KEY = "tct.builder.v1";

/** The zoom stops the canvas offers. Percentages, because that is how people ask. */
export const ZOOM_STOPS = [50, 75, 90, 100, 125, 150];

/**
 * Reads a saved document, or falls back to the starter.
 *
 * Called as `useState`'s initialiser rather than in an effect, so the first paint
 * is already the restored document and there is no flash of the starter over the
 * top of somebody's work.
 */
function initialDoc(): BuilderNode {
  if (typeof window === "undefined") return starterDoc();

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return starterDoc();

    const parsed = JSON.parse(raw) as BuilderNode;
    /* Trust it only as far as the shape: a session written by an older build must
       not be able to crash the tool it is read into. */
    return parsed && typeof parsed === "object" && Array.isArray(parsed.children)
      ? parsed
      : starterDoc();
  } catch {
    return starterDoc();
  }
}

export interface BuilderController {
  root: BuilderNode;
  selected: BuilderNode | null;
  selectedId: string | null;
  hoveredId: string | null;
  /** The chain from the root down to the selection, for the breadcrumb. */
  path: BuilderNode[];
  device: Device;
  count: number;
  /** Canvas zoom, as a percentage. */
  zoom: number;
  /** Chrome off, so the design can be read without outlines over it. */
  preview: boolean;
  /** True once something has been copied, so paste can be offered honestly. */
  hasCopy: boolean;

  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  setDevice: (device: Device) => void;
  setZoom: (zoom: number) => void;
  setPreview: (preview: boolean) => void;
  nudgeZoom: (direction: -1 | 1) => void;

  add: (kind: NodeKind) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  move: (id: string, direction: -1 | 1) => void;
  wrap: (id: string) => void;
  copy: (id: string) => void;
  paste: () => void;

  setContent: (id: string, content: string) => void;
  setStyle: (id: string, change: Partial<NodeStyle>) => void;
  setLayout: (id: string, change: Partial<NodeLayout>) => void;
  setText: (id: string, change: Partial<NodeText>) => void;
  setPad: (id: string, side: "t" | "r" | "b" | "l", value: number) => void;
  setMargin: (id: string, side: "t" | "r" | "b" | "l", value: number) => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  reset: () => void;
  code: string;
}

function countNodes(node: BuilderNode): number {
  return 1 + node.children.reduce((total, child) => total + countNodes(child), 0);
}

function chainTo(root: BuilderNode, id: string | null): BuilderNode[] {
  if (!id) return [];

  const chain: BuilderNode[] = [];
  let current: BuilderNode | null = findNode(root, id);

  while (current) {
    chain.unshift(current);
    current = findParent(root, current.id);
  }

  return chain;
}

/**
 * The Builder session.
 *
 * One reducer-ish hook holding the document, the selection and the history. Every
 * mutation goes through `commit`, which is the only place that touches the undo
 * stack, so no action can forget to be undoable.
 *
 * History stores whole document snapshots rather than inverse operations. A
 * document here is small plain JSON, so a snapshot costs almost nothing, and it
 * removes the entire class of bug where an undo is not quite the mirror of the
 * thing it is undoing.
 */
export function useBuilder(): BuilderController {
  const [root, setRoot] = useState<BuilderNode>(initialDoc);
  const [past, setPast] = useState<BuilderNode[]>([]);
  const [future, setFuture] = useState<BuilderNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [zoom, setZoom] = useState(100);
  const [preview, setPreview] = useState(false);
  const clipboard = useRef<BuilderNode | null>(null);
  const [hasCopy, setHasCopy] = useState(false);

  /* Saved on every change rather than on a timer: a document is small, the write
     is synchronous and cheap, and a tab closed mid-thought should not cost work. */
  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(root));
    } catch {
      /* Storage can be full or blocked. The session still works in memory. */
    }
  }, [root]);

  const commit = useCallback(
    (next: BuilderNode) => {
      setPast((current) => [...current, root].slice(-LIMIT));
      setFuture([]);
      setRoot(next);
    },
    [root],
  );

  const undo = useCallback(() => {
    setPast((current) => {
      if (!current.length) return current;

      const previous = current[current.length - 1];
      setFuture((forward) => [root, ...forward].slice(0, LIMIT));
      setRoot(previous);
      return current.slice(0, -1);
    });
  }, [root]);

  const redo = useCallback(() => {
    setFuture((current) => {
      if (!current.length) return current;

      const [next, ...rest] = current;
      setPast((back) => [...back, root].slice(-LIMIT));
      setRoot(next);
      return rest;
    });
  }, [root]);

  const add = useCallback(
    (kind: NodeKind) => {
      const node = createNode(kind);
      commit(insertNode(root, selectedId ?? root.id, node));
      setSelectedId(node.id);
    },
    [commit, root, selectedId],
  );

  const remove = useCallback(
    (id: string) => {
      /* The root is the document. Deleting it would leave nothing to select. */
      if (id === root.id) return;

      const parent = findParent(root, id);
      commit(removeNode(root, id));
      setSelectedId(parent?.id ?? null);
    },
    [commit, root],
  );

  const duplicate = useCallback(
    (id: string) => {
      const result = duplicateNode(root, id);
      if (!result) return;

      commit(result.root);
      setSelectedId(result.id);
    },
    [commit, root],
  );

  const move = useCallback(
    (id: string, direction: -1 | 1) => {
      const next = moveNode(root, id, direction);
      if (next !== root) commit(next);
    },
    [commit, root],
  );

  const wrap = useCallback(
    (id: string) => {
      const result = wrapNode(root, id);
      if (!result) return;

      commit(result.root);
      setSelectedId(result.id);
    },
    [commit, root],
  );

  const setContent = useCallback(
    (id: string, content: string) => {
      commit(updateNode(root, id, (node) => ({ ...node, content })));
    },
    [commit, root],
  );

  const setStyle = useCallback(
    (id: string, change: Partial<NodeStyle>) => {
      commit(
        updateNode(root, id, (node) => ({
          ...node,
          style: { ...node.style, ...change },
        })),
      );
    },
    [commit, root],
  );

  const setLayout = useCallback(
    (id: string, change: Partial<NodeLayout>) => {
      commit(
        updateNode(root, id, (node) => ({
          ...node,
          layout: { ...node.layout, ...change },
        })),
      );
    },
    [commit, root],
  );

  const setText = useCallback(
    (id: string, change: Partial<NodeText>) => {
      commit(
        updateNode(root, id, (node) => ({
          ...node,
          text: { ...node.text, ...change },
        })),
      );
    },
    [commit, root],
  );

  const setPad = useCallback(
    (id: string, side: "t" | "r" | "b" | "l", value: number) => {
      commit(
        updateNode(root, id, (node) => ({
          ...node,
          pad: { ...node.pad, [side]: value },
        })),
      );
    },
    [commit, root],
  );

  const setMargin = useCallback(
    (id: string, side: "t" | "r" | "b" | "l", value: number) => {
      commit(
        updateNode(root, id, (node) => ({
          ...node,
          margin: { ...node.margin, [side]: value },
        })),
      );
    },
    [commit, root],
  );

  const copy = useCallback(
    (id: string) => {
      const node = findNode(root, id);
      if (!node) return;

      clipboard.current = node;
      setHasCopy(true);
    },
    [root],
  );

  /**
   * Pastes into the selection, or beside it when the selection cannot hold
   * children. Fresh ids all the way down, so pasting twice gives two nodes rather
   * than two references to one.
   */
  const paste = useCallback(() => {
    if (!clipboard.current) return;

    const copyOf = cloneNode(clipboard.current);
    commit(insertNode(root, selectedId ?? root.id, copyOf));
    setSelectedId(copyOf.id);
  }, [commit, root, selectedId]);

  const nudgeZoom = useCallback((direction: -1 | 1) => {
    setZoom((current) => {
      const at = ZOOM_STOPS.indexOf(current);
      const next =
        ZOOM_STOPS[
          Math.min(ZOOM_STOPS.length - 1, Math.max(0, (at === -1 ? 3 : at) + direction))
        ];
      return next ?? current;
    });
  }, []);

  const reset = useCallback(() => {
    commit(starterDoc());
    setSelectedId(null);
  }, [commit]);

  /* Shortcuts. Skipped whenever a field or a contenteditable has focus, so typing
     "d" into a heading does not duplicate it. */
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
      if (typing) return;

      const meta = event.metaKey || event.ctrlKey;

      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }

      if (meta && event.key.toLowerCase() === "d" && selectedId) {
        event.preventDefault();
        duplicate(selectedId);
        return;
      }

      if (meta && event.key.toLowerCase() === "c" && selectedId) {
        copy(selectedId);
        return;
      }

      if (meta && event.key.toLowerCase() === "v") {
        event.preventDefault();
        paste();
        return;
      }

      /* Cmd and a bracket zooms, which is what every canvas tool binds it to. */
      if (meta && (event.key === "=" || event.key === "+")) {
        event.preventDefault();
        nudgeZoom(1);
        return;
      }

      if (meta && event.key === "-") {
        event.preventDefault();
        nudgeZoom(-1);
        return;
      }

      if (meta && event.key === "0") {
        event.preventDefault();
        setZoom(100);
        return;
      }

      if (event.key.toLowerCase() === "p" && !meta) {
        event.preventDefault();
        setPreview((current) => !current);
        return;
      }

      if (event.key === "Escape") {
        if (preview) setPreview(false);
        else setSelectedId(null);
        return;
      }

      if (!selectedId) return;

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        remove(selectedId);
        return;
      }

      /* Alt with an arrow reorders; the arrow alone walks the tree, which is the
         convention every canvas editor uses. */
      if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        move(selectedId, event.key === "ArrowUp" ? -1 : 1);
        return;
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        const parent = findParent(root, selectedId);
        if (!parent) return;

        event.preventDefault();
        const at = parent.children.findIndex((child) => child.id === selectedId);
        const to = at + (event.key === "ArrowUp" ? -1 : 1);
        const sibling = parent.children[to];
        if (sibling) setSelectedId(sibling.id);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    copy,
    duplicate,
    move,
    nudgeZoom,
    paste,
    preview,
    redo,
    remove,
    root,
    selectedId,
    undo,
  ]);

  const selected = useMemo(
    () => (selectedId ? findNode(root, selectedId) : null),
    [root, selectedId],
  );

  return {
    root,
    selected,
    selectedId,
    hoveredId,
    path: useMemo(() => chainTo(root, selectedId), [root, selectedId]),
    device,
    count: useMemo(() => countNodes(root), [root]),
    zoom,
    preview,
    hasCopy,

    select: setSelectedId,
    hover: setHoveredId,
    setDevice,
    setZoom,
    setPreview,
    nudgeZoom,

    add,
    remove,
    duplicate,
    move,
    wrap,
    copy,
    paste,

    setContent,
    setStyle,
    setLayout,
    setText,
    setPad,
    setMargin,

    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,

    reset,
    code: useMemo(() => exportComponent(root), [root]),
  };
}
