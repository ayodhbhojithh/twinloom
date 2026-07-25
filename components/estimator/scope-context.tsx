"use client";

import { createContext, useContext } from "react";

import {
  useScopeSelection,
  type ScopeController,
} from "@/lib/hooks/use-scope-selection";

const ScopeContext = createContext<ScopeController | null>(null);

/**
 * One scope, shared. Both layouts read and write the same controller, so a tick
 * in either view is a tick in both, and switching layout never loses a
 * selection. The prototype made the same promise: "same scope object as 9a".
 */
export function ScopeProvider({ children }: { children: React.ReactNode }) {
  const controller = useScopeSelection();

  return (
    <ScopeContext.Provider value={controller}>{children}</ScopeContext.Provider>
  );
}

export function useScope(): ScopeController {
  const controller = useContext(ScopeContext);

  if (!controller) {
    throw new Error("useScope must be used inside a ScopeProvider");
  }

  return controller;
}
