"use client";

import { createContext, useContext } from "react";

import { useThoughts, type ThoughtsController } from "@/lib/hooks/use-thoughts";

const ThoughtsContext = createContext<ThoughtsController | null>(null);

export function useThoughtsSession(): ThoughtsController {
  const controller = useContext(ThoughtsContext);

  if (!controller) {
    throw new Error("useThoughtsSession must be used inside ThoughtsProvider");
  }

  return controller;
}

export { ThoughtsContext, useThoughts };
