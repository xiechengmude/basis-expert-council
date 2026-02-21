"use client";

import React, { useMemo, useState, useCallback } from "react";
import { A2UIContext } from "../context";
import { A2UIProcessor } from "../processor";
import { A2UIRoot } from "../registry";
import type { ServerToClientMessage, UserAction } from "../types";

interface A2UISurfaceProps {
  /** A2UI JSONL string (one JSON per line) or pre-parsed messages */
  jsonl: string | ServerToClientMessage[];
  onAction?: (action: UserAction) => void;
}

function parseJsonl(input: string | ServerToClientMessage[]): ServerToClientMessage[] {
  if (Array.isArray(input)) return input;
  const lines = input.trim().split("\n");
  const messages: ServerToClientMessage[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      messages.push(JSON.parse(trimmed));
    } catch {
      // skip malformed lines
    }
  }
  return messages;
}

export const A2UISurface: React.FC<A2UISurfaceProps> = ({ jsonl, onAction }) => {
  const [, setTick] = useState(0);

  const processor = useMemo(() => new A2UIProcessor(), []);

  const surfaces = useMemo(() => {
    const msgs = parseJsonl(jsonl);
    return processor.process(msgs);
  }, [jsonl, processor]);

  const dispatch = useCallback(
    (action: UserAction) => {
      onAction?.(action);
    },
    [onAction]
  );

  const forceUpdate = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  if (surfaces.size === 0) return null;

  return (
    <>
      {Array.from(surfaces.values()).map((surface) => {
        if (!surface.componentTree) return null;
        return (
          <A2UIContext.Provider
            key={surface.id}
            value={{ processor, surfaceId: surface.id, dispatch, forceUpdate }}
          >
            <div className="my-2 w-full">
              <A2UIRoot node={surface.componentTree} />
            </div>
          </A2UIContext.Provider>
        );
      })}
    </>
  );
};
