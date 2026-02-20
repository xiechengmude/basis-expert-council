"use client";

import React from "react";
import type { CardNode } from "../types";
import { A2UIRoot } from "../registry";

export const A2UICard: React.FC<{ node: CardNode }> = ({ node }) => {
  const { child, children } = node.properties;

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-gray-900">
      {child && <A2UIRoot node={child} />}
      {children?.length > 0 && (
        <div className="flex flex-col gap-3">
          {children.map((c) =>
            c ? <A2UIRoot key={c.id} node={c} /> : null
          )}
        </div>
      )}
    </div>
  );
};
