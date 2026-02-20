"use client";

import React from "react";
import type { ListNode } from "../types";
import { A2UIRoot } from "../registry";

export const A2UIList: React.FC<{ node: ListNode }> = ({ node }) => {
  const { children, direction, alignment } = node.properties;
  const isHorizontal = direction === "horizontal";

  const alignClass = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  }[alignment ?? "stretch"] ?? "items-stretch";

  return (
    <div
      className={`flex gap-2 ${isHorizontal ? "flex-row flex-wrap" : "flex-col"} ${alignClass}`}
    >
      {children?.map((child) =>
        child ? <A2UIRoot key={child.id} node={child} /> : null
      )}
    </div>
  );
};
