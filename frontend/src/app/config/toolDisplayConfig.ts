/**
 * Tool Display Config — toC 用户友好展示策略
 *
 * 三类展示策略：
 * - hidden:   完全隐藏，pending 时显示"思考指示器"
 * - friendly: 友好化展示（中文名称 + 执行状态文案）
 * - special:  已有特殊渲染逻辑（a2ui_render / task），不做修改
 *
 * 开发者模式：设置 NEXT_PUBLIC_DEV_TOOLS=true 后，所有工具走 special 路径，
 * 恢复原始展示（tool name + 可折叠参数 + result），方便调试。
 */

const DEV_TOOLS_ENABLED =
  process.env.NEXT_PUBLIC_DEV_TOOLS === "true";

export type ToolDisplayStrategy = "hidden" | "friendly" | "special";

export interface FriendlyToolConfig {
  strategy: "friendly";
  /** 中文友好名称 */
  label: string;
  /** 执行中显示的文案 */
  pendingText: string;
  /** Lucide 图标名（用于未来扩展） */
  icon: string;
  /** 是否展示 result（默认 false） */
  showResult?: boolean;
}

export interface HiddenToolConfig {
  strategy: "hidden";
  /** 友好标签，展开时显示（如"查阅资料"） */
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
  read_file: { strategy: "hidden", label: "查阅资料" },
  list_files: { strategy: "hidden", label: "浏览目录" },
  search: { strategy: "hidden", label: "搜索内容" },
  write_file: { strategy: "hidden", label: "整理内容" },
  execute_command: { strategy: "hidden", label: "处理数据" },
  file_search: { strategy: "hidden", label: "搜索资料" },
  code_interpreter: { strategy: "hidden", label: "分析计算" },

  // --- 记忆工具（友好展示） ---
  remember_fact: {
    strategy: "friendly",
    label: "记录学习信息",
    pendingText: "正在记录...",
    icon: "BookmarkPlus",
  },
  recall_memories: {
    strategy: "friendly",
    label: "回忆学习记录",
    pendingText: "正在回忆学习记录...",
    icon: "Search",
  },
  get_user_memory_profile: {
    strategy: "friendly",
    label: "查看学习档案",
    pendingText: "正在查看学习档案...",
    icon: "UserCircle",
  },
  forget_memory: {
    strategy: "friendly",
    label: "清除记录",
    pendingText: "正在清除记录...",
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
// 子代理中文名映射
// ---------------------------------------------------------------------------

const SUBAGENT_NAME_MAP: Record<string, string> = {
  "math-expert": "数学专家",
  "science-expert": "科学专家",
  "humanities-expert": "人文专家",
  "curriculum-advisor": "课程规划顾问",
  "business-advisor": "商务顾问",
  "probation-advisor": "学业保级顾问",
};

/**
 * 获取子代理的中文友好名称
 * 开发者模式下返回原始英文名
 */
export function getSubAgentDisplayName(agentName: string): string {
  if (DEV_TOOLS_ENABLED) {
    return agentName;
  }
  return SUBAGENT_NAME_MAP[agentName] ?? agentName;
}
