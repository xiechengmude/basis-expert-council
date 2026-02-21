"use client";

import React, { useState, useCallback } from "react";
import type { CheckboxNode } from "../types";
import { useA2UI } from "../context";

export const A2UICheckbox: React.FC<{ node: CheckboxNode }> = ({ node }) => {
  const { processor, surfaceId, forceUpdate } = useA2UI();
  const label = processor.resolveStringValue(
    surfaceId,
    node.properties.label,
    node.dataContextPath
  );

  const valueDef = node.properties.value;

  // Local state as primary source of truth
  const [localChecked, setLocalChecked] = useState<boolean>(() => {
    if (valueDef?.literalBoolean !== undefined) return valueDef.literalBoolean;
    if (valueDef?.path) {
      const resolved = processor.getData(
        surfaceId,
        processor.resolvePath(valueDef.path, node.dataContextPath)
      );
      if (typeof resolved === "boolean") return resolved;
    }
    return false;
  });

  const handleChange = useCallback(() => {
    const newValue = !localChecked;
    setLocalChecked(newValue);

    if (valueDef?.path) {
      processor.setData(
        surfaceId,
        processor.resolvePath(valueDef.path, node.dataContextPath),
        newValue
      );
    }
    forceUpdate();
  }, [processor, surfaceId, valueDef, node.dataContextPath, localChecked, forceUpdate]);

  return (
    <label className="flex cursor-pointer items-center gap-2 py-1">
      <input
        type="checkbox"
        checked={localChecked}
        onChange={handleChange}
        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
      />
      <span className="text-sm text-primary">{label}</span>
    </label>
  );
};
