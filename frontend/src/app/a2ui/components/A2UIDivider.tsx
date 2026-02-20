"use client";

import React from "react";
import type { DividerNode } from "../types";

export const A2UIDivider: React.FC<{ node: DividerNode }> = ({ node }) => {
  const { axis, color, thickness } = node.properties;
  const isVertical = axis === "vertical";

  const style: React.CSSProperties = {};
  if (color) style.borderColor = color;
  if (thickness) {
    if (isVertical) style.borderLeftWidth = `${thickness}px`;
    else style.borderTopWidth = `${thickness}px`;
  }

  if (isVertical) {
    return (
      <div
        className="mx-2 self-stretch border-l border-border"
        style={style}
      />
    );
  }

  return <hr className="my-3 border-t border-border" style={style} />;
};
