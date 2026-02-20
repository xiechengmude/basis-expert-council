"use client";

import React from "react";
import type { ColumnNode } from "../types";
import { A2UIRoot } from "../registry";

const JUSTIFY: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  spaceBetween: "justify-between",
  spaceAround: "justify-around",
  spaceEvenly: "justify-evenly",
};

const ALIGN: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export const A2UIColumn: React.FC<{ node: ColumnNode }> = ({ node }) => {
  const { distribution, alignment, children } = node.properties;
  const justify = JUSTIFY[distribution ?? "start"] ?? "justify-start";
  const align = ALIGN[alignment ?? "stretch"] ?? "items-stretch";

  return (
    <div className={`flex flex-col gap-3 ${justify} ${align}`}>
      {children?.map((child) =>
        child ? <A2UIRoot key={child.id} node={child} /> : null
      )}
    </div>
  );
};
