"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  computeScope,
  DEFAULT_SELECTION,
  getComponent,
  type CollapsedMap,
  type ScopeSelection,
  type ScopeTotals,
} from "@/lib/scope";

export interface ScopeController {
  totals: ScopeTotals;
  /** Raw ticks. Needed only where the full breakdown has to be written out. */
  selection: ScopeSelection;

  isOptionTicked: (optionId: string) => boolean;
  toggleOption: (optionId: string, componentId: string) => void;

  isSectionOpen: (sectionId: string) => boolean;
  toggleSection: (sectionId: string) => void;

  isComponentOpen: (componentId: string) => boolean;
  toggleComponent: (componentId: string) => void;

  /** Any option ticked means the component is in the build. */
  isComponentIncluded: (componentId: string) => boolean;
  /**
   * One tap in or out, used by the portal circles. Adding restores the
   * component's pre ticked options, or its lightest option when it has none.
   * Removing clears every option it owns.
   */
  setComponentIncluded: (componentId: string, included: boolean) => void;
  toggleComponentInclusion: (componentId: string) => void;

  focusedComponentId: string | null;
  /**
   * Reveals a component's row and snaps the scope panel to it. Called from the
   * mock-up, which is the two way half of the link.
   */
  jumpToComponent: (componentId: string) => void;

  registerRow: (componentId: string, node: HTMLElement | null) => void;
  registerScroller: (node: HTMLElement | null) => void;

  resetToDefaults: () => void;
  isPristine: boolean;
}

function setCollapsed(
  map: CollapsedMap,
  id: string,
  collapsed: boolean,
): CollapsedMap {
  if (Boolean(map[id]) === collapsed) return map;
  const next = { ...map };
  if (collapsed) next[id] = true;
  else delete next[id];
  return next;
}

function sameSelection(a: ScopeSelection, b: ScopeSelection): boolean {
  const ticked = (map: ScopeSelection) =>
    Object.keys(map)
      .filter((key) => map[key])
      .sort();
  const left = ticked(a);
  const right = ticked(b);
  return (
    left.length === right.length && left.every((key, i) => key === right[i])
  );
}

/**
 * Everything the estimator knows. Collapsed state is stored separately from the
 * selection, which is what makes collapsing a group non destructive: folding a
 * section away cannot clear a tick. See Docs/README.md, point 4.
 */
export function useScopeSelection(): ScopeController {
  const [selection, setSelection] = useState<ScopeSelection>(DEFAULT_SELECTION);
  const [collapsedSections, setCollapsedSections] = useState<CollapsedMap>({});
  const [collapsedComponents, setCollapsedComponents] = useState<CollapsedMap>(
    {},
  );
  const [focusedComponentId, setFocusedComponentId] = useState<string | null>(
    null,
  );

  /** Bumped on every jump so repeat clicks on the same block still fire. */
  const [pendingJump, setPendingJump] = useState<{
    componentId: string;
    nonce: number;
  } | null>(null);
  const nonce = useRef(0);

  const rows = useRef(new Map<string, HTMLElement>());
  const scroller = useRef<HTMLElement | null>(null);

  /* Switching layout unmounts one tree and mounts another. React detaches the
     old refs first, but guarding on `isConnected` means even a reversed order
     cannot leave us holding nothing. */
  const registerRow = useCallback(
    (componentId: string, node: HTMLElement | null) => {
      if (node) {
        rows.current.set(componentId, node);
        return;
      }

      if (!rows.current.get(componentId)?.isConnected) {
        rows.current.delete(componentId);
      }
    },
    [],
  );

  const registerScroller = useCallback((node: HTMLElement | null) => {
    if (node) {
      scroller.current = node;
      return;
    }

    if (!scroller.current?.isConnected) scroller.current = null;
  }, []);

  const totals = useMemo(() => computeScope(selection), [selection]);

  const isOptionTicked = useCallback(
    (optionId: string) => Boolean(selection[optionId]),
    [selection],
  );

  const toggleOption = useCallback((optionId: string, componentId: string) => {
    setSelection((prev) => {
      const next = { ...prev };
      if (next[optionId]) delete next[optionId];
      else next[optionId] = true;
      return next;
    });
    setFocusedComponentId(componentId);
  }, []);

  const isSectionOpen = useCallback(
    (sectionId: string) => !collapsedSections[sectionId],
    [collapsedSections],
  );

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) =>
      setCollapsed(prev, sectionId, !prev[sectionId]),
    );
  }, []);

  const isComponentOpen = useCallback(
    (componentId: string) => !collapsedComponents[componentId],
    [collapsedComponents],
  );

  const toggleComponent = useCallback((componentId: string) => {
    setCollapsedComponents((prev) =>
      setCollapsed(prev, componentId, !prev[componentId]),
    );
    setFocusedComponentId(componentId);
  }, []);

  const isComponentIncluded = useCallback(
    (componentId: string) => (totals.componentTotals[componentId] ?? 0) > 0,
    [totals],
  );

  const setComponentIncluded = useCallback(
    (componentId: string, included: boolean) => {
      const component = getComponent(componentId);
      if (!component) return;

      setSelection((prev) => {
        const next = { ...prev };
        for (const option of component.options) delete next[option.id];

        if (included) {
          const preTicked = component.options.filter(
            (option) => option.defaultOn,
          );
          /* Options are ordered cheapest first, so a component with no defaults
             comes in at its lightest sensible version. */
          const toTick = preTicked.length
            ? preTicked
            : component.options.slice(0, 1);

          for (const option of toTick) next[option.id] = true;
        }

        return next;
      });

      setFocusedComponentId(componentId);
    },
    [],
  );

  const toggleComponentInclusion = useCallback(
    (componentId: string) => {
      setComponentIncluded(componentId, !isComponentIncluded(componentId));
    },
    [isComponentIncluded, setComponentIncluded],
  );

  const jumpToComponent = useCallback((componentId: string) => {
    const component = getComponent(componentId);
    if (!component) return;

    setCollapsedSections((prev) => setCollapsed(prev, component.sectionId, false));
    setCollapsedComponents((prev) => setCollapsed(prev, componentId, false));
    setFocusedComponentId(componentId);
    nonce.current += 1;
    setPendingJump({ componentId, nonce: nonce.current });
  }, []);

  /* The anchor. scrollTop is assigned outright: an instant jump, deliberately
     not smooth scrolled. Smooth scrolling inside the panel was tried during
     design and rejected as too slow. See Docs/README.md, "Row anchoring". */
  useEffect(() => {
    if (!pendingJump) return;

    const row = rows.current.get(pendingJump.componentId);
    const panel = scroller.current;
    if (!row || !panel) return;

    const offset =
      row.getBoundingClientRect().top -
      panel.getBoundingClientRect().top +
      panel.scrollTop -
      10;

    panel.scrollTop = offset;
  }, [pendingJump]);

  const resetToDefaults = useCallback(() => {
    setSelection(DEFAULT_SELECTION);
    setCollapsedSections({});
    setCollapsedComponents({});
    setFocusedComponentId(null);
  }, []);

  const isPristine = useMemo(
    () => sameSelection(selection, DEFAULT_SELECTION),
    [selection],
  );

  return {
    totals,
    selection,
    isOptionTicked,
    toggleOption,
    isSectionOpen,
    toggleSection,
    isComponentOpen,
    toggleComponent,
    isComponentIncluded,
    setComponentIncluded,
    toggleComponentInclusion,
    focusedComponentId,
    jumpToComponent,
    registerRow,
    registerScroller,
    resetToDefaults,
    isPristine,
  };
}
