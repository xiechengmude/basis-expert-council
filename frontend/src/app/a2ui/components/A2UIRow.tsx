"use client";

import React from "react";
import type { RowNode } from "../types";
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

export const A2UIRow: React.FC<{ node: RowNode }> = ({ node }) => {
  const { distribution, alignment, children } = node.properties;
  const justify = JUSTIFY[distribution ?? "start"] ?? "justify-start";
  const align = ALIGN[alignment ?? "center"] ?? "items-center";

  return (
    <div className={`flex flex-row flex-wrap gap-3 ${justify} ${align}`}>
      {children?.map((child) =>
        child ? <A2UIRoot key={child.id} node={child} /> : null
      )}
    </div>
  );
};
