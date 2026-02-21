"use client";

import React from "react";
import type { TextNode } from "../types";
import { useA2UI } from "../context";
import { MarkdownContent } from "@/app/components/MarkdownContent";

export const A2UIText: React.FC<{ node: TextNode }> = ({ node }) => {
  const { processor, surfaceId } = useA2UI();
  const text = processor.resolveStringValue(
    surfaceId,
    node.properties.text,
    node.dataContextPath
  );
  const hint = node.properties.usageHint ?? "body";

  switch (hint) {
    case "h1":
      return <h1 className="text-2xl font-bold text-primary">{text}</h1>;
    case "h2":
      return <h2 className="text-xl font-semibold text-primary">{text}</h2>;
    case "h3":
      return <h3 className="text-lg font-semibold text-primary">{text}</h3>;
    case "h4":
      return <h4 className="text-base font-medium text-primary">{text}</h4>;
    case "h5":
      return <h5 className="text-sm font-medium text-primary">{text}</h5>;
    case "caption":
      return <p className="text-xs text-muted-foreground">{text}</p>;
    case "body":
    default:
      if (text.includes("**") || text.includes("*") || text.includes("`") || text.includes("[") || text.includes("$")) {
        return <MarkdownContent content={text} />;
      }
      return <p className="text-sm leading-relaxed text-primary">{text}</p>;
  }
};
