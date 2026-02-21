"use client";

import React, { useState, useCallback } from "react";
import type { MultipleChoiceNode } from "../types";
import { useA2UI } from "../context";

export const A2UIMultipleChoice: React.FC<{ node: MultipleChoiceNode }> = ({
  node,
}) => {
  const { processor, surfaceId, forceUpdate } = useA2UI();
  const { selections, options, maxAllowedSelections } = node.properties;
  const isSingle = (maxAllowedSelections ?? 1) === 1;

  // Local state as primary source of truth for selections
  const [localSelected, setLocalSelected] = useState<string[]>(() => {
    if (selections?.literalArray) return selections.literalArray;
    if (selections?.path) {
      const resolved = processor.getData(
        surfaceId,
        processor.resolvePath(selections.path, node.dataContextPath)
      );
      if (Array.isArray(resolved))
        return resolved.filter((v): v is string => typeof v === "string");
      if (typeof resolved === "string") return resolved ? [resolved] : [];
    }
    return [];
  });

  const selected = localSelected;

  const handleSelect = useCallback(
    (value: string) => {
      let newSelected: string[];
      if (isSingle) {
        newSelected = [value];
      } else {
        newSelected = selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value];
      }
      setLocalSelected(newSelected);

      // Sync to processor data model
      if (selections?.path) {
        const fullPath = processor.resolvePath(
          selections.path,
          node.dataContextPath
        );
        processor.setData(surfaceId, fullPath, isSingle ? value : newSelected);
      }
      forceUpdate();
    },
    [processor, surfaceId, selections, node.dataContextPath, isSingle, selected, forceUpdate]
  );

  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const label = processor.resolveStringValue(
          surfaceId,
          opt.label,
          node.dataContextPath
        );
        const isSelected = selected.includes(opt.value);

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
              isSelected
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-border bg-white text-primary hover:border-brand-300 hover:bg-brand-50/50 dark:bg-gray-900"
            }`}
          >
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                isSelected
                  ? "border-brand-600 bg-brand-600"
                  : "border-gray-300"
              }`}
            >
              {isSelected && (
                <svg
                  className="h-3 w-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <circle cx="6" cy="6" r="3" />
                </svg>
              )}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
