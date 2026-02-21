"use client";

import React, { useMemo, useState, useCallback } from "react";
import { SubAgentIndicator } from "@/app/components/SubAgentIndicator";
import { ToolCallBox } from "@/app/components/ToolCallBox";
import { MarkdownContent } from "@/app/components/MarkdownContent";
import type {
  SubAgent,
  ToolCall,
  ActionRequest,
  ReviewConfig,
} from "@/app/types/types";
import { A2UI_TOOL_NAME } from "@/app/types/types";
import { A2UISurface } from "@/app/a2ui";
import type { UserAction } from "@/app/a2ui";
import { Message } from "@langchain/langgraph-sdk";
import {
  extractSubAgentContent,
  extractStringFromMessageContent,
} from "@/app/utils/utils";
import { cn } from "@/lib/utils";
import {
  getToolDisplayConfig,
  type FriendlyToolConfig,
  type HiddenToolConfig,
} from "@/app/config/toolDisplayConfig";
import { useI18n } from "@/i18n";

// ---------------------------------------------------------------------------
// 聚合的 Hidden 工具思考指示器 + 可见工具渲染
// ---------------------------------------------------------------------------

interface HiddenToolsAndVisibleToolsProps {
  toolCalls: ToolCall[];
  ui?: any[];
  stream?: any;
  graphId?: string;
  actionRequestsMap?: Map<string, ActionRequest>;
  reviewConfigsMap?: Map<string, ReviewConfig>;
  onResumeInterrupt?: (value: any) => void;
  onA2UIAction?: (action: UserAction) => void;
  isLoading?: boolean;
  a2uiInterruptPayload?: string | null;
}

function HiddenToolsAndVisibleTools({
  toolCalls,
  ui,
  stream,
  graphId,
  actionRequestsMap,
  reviewConfigsMap,
  onResumeInterrupt,
  onA2UIAction,
  isLoading,
  a2uiInterruptPayload,
}: HiddenToolsAndVisibleToolsProps) {
  const { t } = useI18n();
  const [thinkingExpanded, setThinkingExpanded] = useState(false);

  // 分离 hidden 工具和可见工具
  const hiddenTools = useMemo(() => {
    return toolCalls
      .map((tc) => ({ tc, cfg: getToolDisplayConfig(tc.name) }))
      .filter(({ cfg }) => cfg.strategy === "hidden");
  }, [toolCalls]);

  const hasPending = hiddenTools.some(({ tc }) => tc.status === "pending");
  const hasHidden = hiddenTools.length > 0;

  // 去重显示标签（同名工具只显示一次），resolve i18n keys
  const hiddenLabels = useMemo(() => {
    const seen = new Set<string>();
    return hiddenTools
      .map(({ tc, cfg }) => {
        const key = (cfg as HiddenToolConfig).label ?? tc.name;
        return t(key);
      })
      .filter((label) => {
        if (seen.has(label)) return false;
        seen.add(label);
        return true;
      });
  }, [hiddenTools, t]);

  return (
    <div className="mt-4 flex w-full flex-col">
      {/* 聚合思考指示器：持久显示 */}
      {hasHidden && (
        <div className="mb-1 overflow-hidden rounded-lg transition-colors duration-200 hover:bg-accent">
          <button
            onClick={() => setThinkingExpanded((p) => !p)}
            className="flex w-full items-center gap-2 px-2 py-2 text-left"
          >
            {hasPending ? (
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-600" />
            ) : (
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {hasPending ? t("chat.preparing") : t("chat.prepared")}
            </span>
            <svg
              className={cn(
                "ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                thinkingExpanded && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {thinkingExpanded && (
            <div className="flex flex-wrap gap-2 px-3 pb-3">
              {hiddenLabels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {/* 可见工具（friendly / special） */}
      {toolCalls.map((toolCall: ToolCall) => {
        const displayConfig = getToolDisplayConfig(toolCall.name);

        // special 工具：保留原有逻辑
        if (toolCall.name === "task") return null;
        if (toolCall.name === A2UI_TOOL_NAME) {
          // Phase 1: interrupt active — render from interrupt payload, interactive
          if (toolCall.status === "interrupted" && a2uiInterruptPayload) {
            return (
              <A2UISurface
                key={toolCall.id}
                jsonl={a2uiInterruptPayload}
                onAction={onA2UIAction}
              />
            );
          }
          // Phase 2: resumed — render from tool result's ui field, static (no onAction)
          if (toolCall.result) {
            try {
              const parsed = JSON.parse(toolCall.result);
              const jsonl = parsed.ui || toolCall.result;
              return <A2UISurface key={toolCall.id} jsonl={jsonl} />;
            } catch {
              return null;
            }
          }
          return null; // tool still executing
        }

        // hidden 工具：已在上方聚合渲染
        if (displayConfig.strategy === "hidden") return null;

        const toolCallGenUiComponent = ui?.find(
          (u) => u.metadata?.tool_call_id === toolCall.id
        );
        const actionRequest = actionRequestsMap?.get(toolCall.name);
        const reviewConfig = reviewConfigsMap?.get(toolCall.name);
        return (
          <ToolCallBox
            key={toolCall.id}
            toolCall={toolCall}
            displayConfig={
              displayConfig.strategy === "friendly"
                ? (displayConfig as FriendlyToolConfig)
                : undefined
            }
            uiComponent={toolCallGenUiComponent}
            stream={stream}
            graphId={graphId}
            actionRequest={actionRequest}
            reviewConfig={reviewConfig}
            onResume={onResumeInterrupt}
            isLoading={isLoading}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------

interface ChatMessageProps {
  message: Message;
  toolCalls: ToolCall[];
  isLoading?: boolean;
  actionRequestsMap?: Map<string, ActionRequest>;
  reviewConfigsMap?: Map<string, ReviewConfig>;
  a2uiInterruptPayload?: string | null;
  ui?: any[];
  stream?: any;
  onResumeInterrupt?: (value: any) => void;
  onA2UIAction?: (action: UserAction) => void;
  graphId?: string;
}

export const ChatMessage = React.memo<ChatMessageProps>(
  ({
    message,
    toolCalls,
    isLoading,
    actionRequestsMap,
    reviewConfigsMap,
    a2uiInterruptPayload,
    ui,
    stream,
    onResumeInterrupt,
    onA2UIAction,
    graphId,
  }) => {
    const { t } = useI18n();
    const isUser = message.type === "human";
    const messageContent = extractStringFromMessageContent(message);
    const hasContent = messageContent && messageContent.trim() !== "";
    const hasToolCalls = toolCalls.length > 0;
    const subAgents = useMemo(() => {
      return toolCalls
        .filter((toolCall: ToolCall) => {
          return (
            toolCall.name === "task" &&
            toolCall.args["subagent_type"] &&
            toolCall.args["subagent_type"] !== "" &&
            toolCall.args["subagent_type"] !== null
          );
        })
        .map((toolCall: ToolCall) => {
          const subagentType = (toolCall.args as Record<string, unknown>)[
            "subagent_type"
          ] as string;
          return {
            id: toolCall.id,
            name: toolCall.name,
            subAgentName: subagentType,
            input: toolCall.args,
            output: toolCall.result ? { result: toolCall.result } : undefined,
            status: toolCall.status,
          } as SubAgent;
        });
    }, [toolCalls]);

    const [expandedSubAgents, setExpandedSubAgents] = useState<
      Record<string, boolean>
    >({});
    const isSubAgentExpanded = useCallback(
      (id: string) => expandedSubAgents[id] ?? true,
      [expandedSubAgents]
    );
    const toggleSubAgent = useCallback((id: string) => {
      setExpandedSubAgents((prev) => ({
        ...prev,
        [id]: prev[id] === undefined ? false : !prev[id],
      }));
    }, []);

    return (
      <div
        className={cn(
          "flex w-full max-w-full overflow-x-hidden",
          isUser && "flex-row-reverse"
        )}
      >
        <div
          className={cn(
            "min-w-0 max-w-full",
            isUser ? "max-w-[70%]" : "w-full"
          )}
        >
          {hasContent && (
            <div className={cn("relative flex items-end gap-0")}>
              <div
                className={cn(
                  "mt-4 overflow-hidden break-words text-sm font-normal leading-[150%]",
                  isUser
                    ? "rounded-xl rounded-br-none border border-border px-3 py-2 text-foreground"
                    : "text-primary"
                )}
                style={
                  isUser
                    ? { backgroundColor: "var(--color-user-message-bg)" }
                    : undefined
                }
              >
                {isUser ? (
                  <p className="m-0 whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {messageContent}
                  </p>
                ) : hasContent ? (
                  <MarkdownContent content={messageContent} />
                ) : null}
              </div>
            </div>
          )}
          {hasToolCalls && (
            <HiddenToolsAndVisibleTools
              toolCalls={toolCalls}
              ui={ui}
              stream={stream}
              graphId={graphId}
              actionRequestsMap={actionRequestsMap}
              reviewConfigsMap={reviewConfigsMap}
              onResumeInterrupt={onResumeInterrupt}
              onA2UIAction={onA2UIAction}
              isLoading={isLoading}
              a2uiInterruptPayload={a2uiInterruptPayload}
            />
          )}
          {!isUser && subAgents.length > 0 && (
            <div className="flex w-fit max-w-full flex-col gap-4">
              {subAgents.map((subAgent) => (
                <div
                  key={subAgent.id}
                  className="flex w-full flex-col gap-2"
                >
                  <div className="flex items-end gap-2">
                    <div className="w-[calc(100%-100px)]">
                      <SubAgentIndicator
                        subAgent={subAgent}
                        onClick={() => toggleSubAgent(subAgent.id)}
                        isExpanded={isSubAgentExpanded(subAgent.id)}
                      />
                    </div>
                  </div>
                  {isSubAgentExpanded(subAgent.id) && (
                    <div className="w-full max-w-full">
                      <div className="bg-surface border-border-light rounded-md border p-4">
                        <h4 className="text-primary/70 mb-2 text-xs font-semibold tracking-wider">
                          {t("chat.task")}
                        </h4>
                        <div className="mb-4 text-sm text-muted-foreground">
                          {extractSubAgentContent(subAgent.input)}
                        </div>
                        {subAgent.output && (
                          <>
                            <h4 className="text-primary/70 mb-2 text-xs font-semibold tracking-wider">
                              {t("chat.result")}
                            </h4>
                            <MarkdownContent
                              content={extractSubAgentContent(subAgent.output)}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";
