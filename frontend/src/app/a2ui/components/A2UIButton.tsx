"use client";

import React, { useCallback } from "react";
import type { ButtonNode, UserAction } from "../types";
import { useA2UI } from "../context";
import { A2UIRoot } from "../registry";

export const A2UIButton: React.FC<{ node: ButtonNode }> = ({ node }) => {
  const { processor, surfaceId, dispatch } = useA2UI();
  const action = node.properties.action;

  const handleClick = useCallback(() => {
    if (!action) return;

    const resolvedContext: Record<string, unknown> = {};
    if (action.context) {
      for (const item of action.context) {
        if (item.value.literalString !== undefined) {
          resolvedContext[item.key] = item.value.literalString;
        } else if (item.value.literalNumber !== undefined) {
          resolvedContext[item.key] = item.value.literalNumber;
        } else if (item.value.literalBoolean !== undefined) {
          resolvedContext[item.key] = item.value.literalBoolean;
        } else if (item.value.path) {
          resolvedContext[item.key] = processor.getData(
            surfaceId,
            processor.resolvePath(item.value.path, node.dataContextPath)
          );
        }
      }
    }

    const userAction: UserAction = {
      actionName: action.name,
      surfaceId,
      sourceComponentId: node.id,
      timestamp: new Date().toISOString(),
      context: resolvedContext,
    };
    dispatch(userAction);
  }, [action, processor, surfaceId, node.id, node.dataContextPath, dispatch]);

  const child = node.properties.child;
  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50"
    >
      {child ? <A2UIRoot node={child} /> : "Button"}
    </button>
  );
};
