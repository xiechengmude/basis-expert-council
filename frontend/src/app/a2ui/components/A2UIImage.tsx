"use client";

import React from "react";
import type { ImageNode } from "../types";
import { useA2UI } from "../context";

const SIZE_CLASSES: Record<string, string> = {
  icon: "h-6 w-6",
  avatar: "h-10 w-10 rounded-full",
  smallFeature: "h-24 w-full rounded-lg",
  mediumFeature: "h-48 w-full rounded-lg",
  largeFeature: "h-72 w-full rounded-lg",
  header: "h-40 w-full rounded-t-lg",
};

const FIT_CLASSES: Record<string, string> = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

export const A2UIImage: React.FC<{ node: ImageNode }> = ({ node }) => {
  const { processor, surfaceId } = useA2UI();
  const url = processor.resolveStringValue(
    surfaceId,
    node.properties.url,
    node.dataContextPath
  );
  const hint = node.properties.usageHint ?? "mediumFeature";
  const fit = node.properties.fit ?? "cover";

  if (!url) return null;

  return (
    <img
      src={url}
      alt=""
      className={`${SIZE_CLASSES[hint] ?? SIZE_CLASSES.mediumFeature} ${FIT_CLASSES[fit] ?? FIT_CLASSES.cover}`}
    />
  );
};
