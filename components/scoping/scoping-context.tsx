"use client";

import { createContext, useContext } from "react";

import { useScoping, type ScopingController } from "@/lib/hooks/use-scoping";

const ScopingContext = createContext<ScopingController | null>(null);

export function useScopingSession(): ScopingController {
  const controller = useContext(ScopingContext);

  if (!controller) {
    throw new Error("useScopingSession must be used inside a ScopingProvider");
  }

  return controller;
}

/**
 * One session, read by the dial, the questions, the readout and the focus panel
 * alike. They all describe the same answers, so none of them can disagree.
 */
export function ScopingProvider({ children }: { children: React.ReactNode }) {
  const controller = useScoping();

  return (
    <ScopingContext.Provider value={controller}>
      {children}
    </ScopingContext.Provider>
  );
}
