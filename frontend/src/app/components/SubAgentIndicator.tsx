"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2, CircleCheckBig } from "lucide-react";
import type { SubAgent } from "@/app/types/types";
import { getSubAgentDisplayName } from "@/app/config/toolDisplayConfig";

interface SubAgentIndicatorProps {
  subAgent: SubAgent;
  onClick: () => void;
  isExpanded?: boolean;
}

export const SubAgentIndicator = React.memo<SubAgentIndicatorProps>(
  ({ subAgent, onClick, isExpanded = true }) => {
    const displayName = useMemo(
      () => getSubAgentDisplayName(subAgent.subAgentName),
      [subAgent.subAgentName]
    );

    const isPending = subAgent.status === "pending" || subAgent.status === "active";

    return (
      <div className="w-fit max-w-[70vw] overflow-hidden rounded-lg border-none bg-card shadow-none outline-none">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          className="flex w-full items-center justify-between gap-2 border-none px-4 py-2 text-left shadow-none outline-none transition-colors duration-200"
        >
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isPending ? (
                <Loader2 size={14} className="animate-spin text-brand-600" />
              ) : (
                <CircleCheckBig size={14} className="text-green-600" />
              )}
              <span className="font-sans text-[15px] font-bold leading-[140%] tracking-[-0.6px] text-[#3F3F46]">
                {displayName}
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp
                size={14}
                className="shrink-0 text-[#70707B]"
              />
            ) : (
              <ChevronDown
                size={14}
                className="shrink-0 text-[#70707B]"
              />
            )}
          </div>
        </Button>
      </div>
    );
  }
);

SubAgentIndicator.displayName = "SubAgentIndicator";
