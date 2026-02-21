/**
 * Tool Display Config — toC 用户友好展示策略
 *
 * 三类展示策略：
 * - hidden:   完全隐藏，pending 时显示"思考指示器"
 * - friendly: 友好化展示（i18n label + 执行状态文案）
 * - special:  已有特殊渲染逻辑（a2ui_render / task），不做修改
 *
 * 开发者模式：设置 NEXT_PUBLIC_DEV_TOOLS=true 后，所有工具走 special 路径，
 * 恢复原始展示（tool name + 可折叠参数 + result），方便调试。
 *
 * NOTE: label / pendingText values are i18n keys. Consumers must call t() to resolve.
 */

const DEV_TOOLS_ENABLED =
  process.env.NEXT_PUBLIC_DEV_TOOLS === "true";

export type ToolDisplayStrategy = "hidden" | "friendly" | "special";

export interface FriendlyToolConfig {
  strategy: "friendly";
  /** i18n key for friendly label */
  label: string;
  /** i18n key for pending status text */
  pendingText: string;
  /** Lucide icon name */
  icon: string;
  /** Whether to show result (default false) */
  showResult?: boolean;
}

export interface HiddenToolConfig {
  strategy: "hidden";
  /** i18n key for friendly label shown when expanded */
  label?: string;
}

export interface SpecialToolConfig {
  strategy: "special";
}

export type ToolDisplayConfig =
  | FriendlyToolConfig
  | HiddenToolConfig
  | SpecialToolConfig;

// ---------------------------------------------------------------------------
// 工具展示配置表
// ---------------------------------------------------------------------------

const TOOL_DISPLAY_MAP: Record<string, ToolDisplayConfig> = {
  // --- 特殊处理（已有渲染逻辑，不修改） ---
  task: { strategy: "special" },
  a2ui_render: { strategy: "special" },

  // --- 框架内部工具（聚合为思考指示器） ---
  read_file: { strategy: "hidden", label: "tool.read_file" },
  list_files: { strategy: "hidden", label: "tool.list_files" },
  search: { strategy: "hidden", label: "tool.search" },
  write_file: { strategy: "hidden", label: "tool.write_file" },
  execute_command: { strategy: "hidden", label: "tool.execute_command" },
  file_search: { strategy: "hidden", label: "tool.file_search" },
  code_interpreter: { strategy: "hidden", label: "tool.code_interpreter" },

  // --- 记忆工具（友好展示） ---
  remember_fact: {
    strategy: "friendly",
    label: "tool.remember_fact.label",
    pendingText: "tool.remember_fact.pending",
    icon: "BookmarkPlus",
  },
  recall_memories: {
    strategy: "friendly",
    label: "tool.recall_memories.label",
    pendingText: "tool.recall_memories.pending",
    icon: "Search",
  },
  get_user_memory_profile: {
    strategy: "friendly",
    label: "tool.get_user_memory_profile.label",
    pendingText: "tool.get_user_memory_profile.pending",
    icon: "UserCircle",
  },
  forget_memory: {
    strategy: "friendly",
    label: "tool.forget_memory.label",
    pendingText: "tool.forget_memory.pending",
    icon: "Eraser",
  },
};

/** 未知工具的默认策略：toC 产品安全默认值 = hidden */
const DEFAULT_CONFIG: HiddenToolConfig = { strategy: "hidden" };

/**
 * 获取工具的展示配置
 * 开发者模式下所有工具走 special 路径（原始展示）
 */
export function getToolDisplayConfig(toolName: string): ToolDisplayConfig {
  if (DEV_TOOLS_ENABLED) {
    return { strategy: "special" };
  }
  return TOOL_DISPLAY_MAP[toolName] ?? DEFAULT_CONFIG;
}

// ---------------------------------------------------------------------------
// 子代理名称映射（i18n keys）
// ---------------------------------------------------------------------------

const SUBAGENT_NAME_MAP: Record<string, string> = {
  "math-expert": "subagent.math-expert",
  "science-expert": "subagent.science-expert",
  "humanities-expert": "subagent.humanities-expert",
  "curriculum-advisor": "subagent.curriculum-advisor",
  "business-advisor": "subagent.business-advisor",
  "probation-advisor": "subagent.probation-advisor",
};

/**
 * 获取子代理的 i18n key
 * 开发者模式下返回原始英文名
 */
export function getSubAgentDisplayName(agentName: string): string {
  if (DEV_TOOLS_ENABLED) {
    return agentName;
  }
  return SUBAGENT_NAME_MAP[agentName] ?? agentName;
}
