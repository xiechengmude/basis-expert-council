"use client";

import React from "react";
import type { AnyComponentNode } from "./types";
import { A2UIText } from "./components/A2UIText";
import { A2UIButton } from "./components/A2UIButton";
import { A2UIRow } from "./components/A2UIRow";
import { A2UIColumn } from "./components/A2UIColumn";
import { A2UICard } from "./components/A2UICard";
import { A2UIImage } from "./components/A2UIImage";
import { A2UIList } from "./components/A2UIList";
import { A2UICheckbox } from "./components/A2UICheckbox";
import { A2UIMultipleChoice } from "./components/A2UIMultipleChoice";
import { A2UIDivider } from "./components/A2UIDivider";
import { A2UISuggestedActions } from "./components/A2UISuggestedActions";

/* eslint-disable @typescript-eslint/no-explicit-any */
const A2UI_COMPONENTS: Record<string, React.FC<{ node: any }>> = {
  Text: A2UIText,
  Button: A2UIButton,
  Row: A2UIRow,
  Column: A2UIColumn,
  Card: A2UICard,
  Image: A2UIImage,
  List: A2UIList,
  CheckBox: A2UICheckbox,
  Checkbox: A2UICheckbox,
  MultipleChoice: A2UIMultipleChoice,
  Divider: A2UIDivider,
  SuggestedActions: A2UISuggestedActions,
  NextAction: A2UISuggestedActions,
};

/**
 * Recursive tree renderer — looks up node.type in the registry and renders.
 */
export const A2UIRoot: React.FC<{ node: AnyComponentNode }> = ({ node }) => {
  if (!node) return null;
  const Component = A2UI_COMPONENTS[node.type];
  if (!Component) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div className="rounded border border-dashed border-yellow-400 bg-yellow-50 px-2 py-1 text-xs text-yellow-700">
          Unknown A2UI component: <code>{node.type}</code>
        </div>
      );
    }
    return null;
  }
  return <Component node={node} />;
};
