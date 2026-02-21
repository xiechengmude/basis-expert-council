import type { Locale } from "../types";

const tools: Record<string, Record<Locale, string>> = {
  // Hidden tools
  "tool.read_file": { "zh-CN": "查阅资料", en: "Reading files", "zh-TW": "查閱資料" },
  "tool.list_files": { "zh-CN": "浏览目录", en: "Browsing files", "zh-TW": "瀏覽目錄" },
  "tool.search": { "zh-CN": "搜索内容", en: "Searching", "zh-TW": "搜尋內容" },
  "tool.write_file": { "zh-CN": "整理内容", en: "Organizing", "zh-TW": "整理內容" },
  "tool.execute_command": { "zh-CN": "处理数据", en: "Processing", "zh-TW": "處理資料" },
  "tool.file_search": { "zh-CN": "搜索资料", en: "Searching files", "zh-TW": "搜尋資料" },
  "tool.code_interpreter": { "zh-CN": "分析计算", en: "Analyzing", "zh-TW": "分析計算" },
  // Friendly tools
  "tool.remember_fact.label": { "zh-CN": "记录学习信息", en: "Saving learning info", "zh-TW": "記錄學習資訊" },
  "tool.remember_fact.pending": { "zh-CN": "正在记录...", en: "Saving...", "zh-TW": "正在記錄..." },
  "tool.recall_memories.label": { "zh-CN": "回忆学习记录", en: "Recalling memories", "zh-TW": "回憶學習記錄" },
  "tool.recall_memories.pending": { "zh-CN": "正在回忆学习记录...", en: "Recalling learning records...", "zh-TW": "正在回憶學習記錄..." },
  "tool.get_user_memory_profile.label": { "zh-CN": "查看学习档案", en: "Viewing learning profile", "zh-TW": "查看學習檔案" },
  "tool.get_user_memory_profile.pending": { "zh-CN": "正在查看学习档案...", en: "Loading learning profile...", "zh-TW": "正在查看學習檔案..." },
  "tool.forget_memory.label": { "zh-CN": "清除记录", en: "Clearing records", "zh-TW": "清除記錄" },
  "tool.forget_memory.pending": { "zh-CN": "正在清除记录...", en: "Clearing records...", "zh-TW": "正在清除記錄..." },
  // Subagent names
  "subagent.math-expert": { "zh-CN": "数学专家", en: "Math Expert", "zh-TW": "數學專家" },
  "subagent.science-expert": { "zh-CN": "科学专家", en: "Science Expert", "zh-TW": "科學專家" },
  "subagent.humanities-expert": { "zh-CN": "人文专家", en: "Humanities Expert", "zh-TW": "人文專家" },
  "subagent.curriculum-advisor": { "zh-CN": "课程规划顾问", en: "Curriculum Advisor", "zh-TW": "課程規劃顧問" },
  "subagent.business-advisor": { "zh-CN": "商务顾问", en: "Business Advisor", "zh-TW": "商務顧問" },
  "subagent.probation-advisor": { "zh-CN": "学业保级顾问", en: "Probation Advisor", "zh-TW": "學業保級顧問" },
};

export default tools;
