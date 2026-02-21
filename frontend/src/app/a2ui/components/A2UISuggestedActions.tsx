"use client";

import React from "react";
import type { AnyComponentNode } from "../types";
import { useA2UI } from "../context";
import { A2UIRoot } from "../registry";

/**
 * SuggestedActions — 推荐下一步操作按钮组
 *
 * 水平排列一组可点击的建议操作按钮，常用于对话结束后推荐后续步骤。
 * 每个子组件应该是 Button 类型。
 *
 * A2UI JSONL 用法:
 * {"surfaceUpdate": {"surfaceId": "s1", "components": [
 *   {"id": "actions", "component": {"SuggestedActions": {"children": {"explicitList": ["btn1","btn2"]}}}},
 *   ...
 * ]}}
 */
interface SuggestedActionsNode {
  id: string;
  type: "SuggestedActions";
  dataContextPath?: string;
  weight?: number | string;
  properties: {
    children: AnyComponentNode[];
    title?: { literalString?: string; path?: string };
  };
}

export const A2UISuggestedActions: React.FC<{ node: SuggestedActionsNode }> = ({
  node,
}) => {
  const { processor, surfaceId } = useA2UI();
  const children = node.properties.children ?? [];

  const title = node.properties.title
    ? processor.resolveStringValue(
        surfaceId,
        node.properties.title,
        node.dataContextPath
      )
    : "";

  if (children.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-2">
      {title && (
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
      )}
      <div className="flex flex-wrap gap-2 [&_button]:bg-transparent [&_button]:border [&_button]:border-border [&_button]:text-primary [&_button]:hover:bg-accent">
        {children.map((child) => (
          <A2UIRoot key={child.id} node={child} />
        ))}
      </div>
    </div>
  );
};
