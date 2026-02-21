import type { Locale } from "../types";

const memory: Record<string, Record<Locale, string>> = {
  // Page
  "memory.title": { "zh-CN": "我的记忆", en: "My Memories", "zh-TW": "我的記憶" },

  // Search
  "memory.search.placeholder": { "zh-CN": "搜索记忆...", en: "Search memories...", "zh-TW": "搜尋記憶..." },

  // Stats
  "memory.stats.total": { "zh-CN": "总记忆数", en: "Total Memories", "zh-TW": "總記憶數" },
  "memory.stats.by_category": { "zh-CN": "按分类", en: "By Category", "zh-TW": "按分類" },
  "memory.stats.by_subject": { "zh-CN": "按学科", en: "By Subject", "zh-TW": "按學科" },

  // Actions
  "memory.action.edit": { "zh-CN": "编辑", en: "Edit", "zh-TW": "編輯" },
  "memory.action.save": { "zh-CN": "保存", en: "Save", "zh-TW": "儲存" },
  "memory.action.cancel": { "zh-CN": "取消", en: "Cancel", "zh-TW": "取消" },
  "memory.action.delete": { "zh-CN": "删除", en: "Delete", "zh-TW": "刪除" },
  "memory.action.delete_confirm": { "zh-CN": "确认删除这条记忆？", en: "Delete this memory?", "zh-TW": "確認刪除這條記憶？" },
  "memory.action.delete_all": { "zh-CN": "清空全部记忆", en: "Delete All Memories", "zh-TW": "清空全部記憶" },
  "memory.action.delete_all_confirm": { "zh-CN": "确认清空所有记忆？此操作不可撤销。", en: "Delete all memories? This cannot be undone.", "zh-TW": "確認清空所有記憶？此操作不可撤銷。" },
  "memory.action.batch_delete": { "zh-CN": "批量删除", en: "Batch Delete", "zh-TW": "批量刪除" },
  "memory.action.select_all": { "zh-CN": "全选", en: "Select All", "zh-TW": "全選" },
  "memory.action.deselect_all": { "zh-CN": "取消全选", en: "Deselect All", "zh-TW": "取消全選" },

  // Filters
  "memory.filter.all_categories": { "zh-CN": "全部分类", en: "All Categories", "zh-TW": "全部分類" },
  "memory.filter.all_subjects": { "zh-CN": "全部学科", en: "All Subjects", "zh-TW": "全部學科" },

  // Importance
  "memory.importance.high": { "zh-CN": "高", en: "High", "zh-TW": "高" },
  "memory.importance.medium": { "zh-CN": "中", en: "Medium", "zh-TW": "中" },
  "memory.importance.low": { "zh-CN": "低", en: "Low", "zh-TW": "低" },

  // Expiry
  "memory.expires": { "zh-CN": "{days} 天后过期", en: "Expires in {days} days", "zh-TW": "{days} 天後過期" },
  "memory.expired": { "zh-CN": "已过期", en: "Expired", "zh-TW": "已過期" },

  // Categories
  "memory.category.tutoring": { "zh-CN": "学科辅导", en: "Tutoring", "zh-TW": "學科輔導" },
  "memory.category.college_planning": { "zh-CN": "升学规划", en: "College Planning", "zh-TW": "升學規劃" },
  "memory.category.onboarding": { "zh-CN": "新生衔接", en: "Onboarding", "zh-TW": "新生銜接" },
  "memory.category.exam_prep": { "zh-CN": "AP 考试备考", en: "AP Exam Prep", "zh-TW": "AP 考試備考" },
  "memory.category.grade": { "zh-CN": "成绩记录", en: "Grades", "zh-TW": "成績記錄" },
  "memory.category.assessment": { "zh-CN": "评估报告", en: "Assessment", "zh-TW": "評估報告" },
  "memory.category.preference": { "zh-CN": "用户偏好", en: "Preferences", "zh-TW": "用戶偏好" },
  "memory.category.goal": { "zh-CN": "学习目标", en: "Goals", "zh-TW": "學習目標" },
  "memory.category.other": { "zh-CN": "其他", en: "Other", "zh-TW": "其他" },

  // Empty state
  "memory.empty.title": { "zh-CN": "暂无记忆", en: "No Memories Yet", "zh-TW": "暫無記憶" },
  "memory.empty.desc": { "zh-CN": "AI 会在对话中自动记住你的关键信息，如年级、学校、成绩和学习目标。开始对话即可建立专属记忆档案。", en: "AI will automatically remember your key information during conversations, like grade, school, scores, and goals. Start a chat to build your memory profile.", "zh-TW": "AI 會在對話中自動記住你的關鍵資訊，如年級、學校、成績和學習目標。開始對話即可建立專屬記憶檔案。" },
  "memory.empty.cta": { "zh-CN": "开始对话", en: "Start Chatting", "zh-TW": "開始對話" },

  // Menu
  "menu.memory": { "zh-CN": "我的记忆", en: "My Memories", "zh-TW": "我的記憶" },
};

export default memory;
