"use client";

import { createContext, useContext } from "react";
import type { A2UIProcessor } from "./processor";
import type { UserAction } from "./types";

export interface A2UIContextValue {
  processor: A2UIProcessor;
  surfaceId: string;
  dispatch: (action: UserAction) => void;
}

export const A2UIContext = createContext<A2UIContextValue | null>(null);

export function useA2UI(): A2UIContextValue {
  const ctx = useContext(A2UIContext);
  if (!ctx) {
    throw new Error("useA2UI must be used within an A2UISurface");
  }
  return ctx;
}
