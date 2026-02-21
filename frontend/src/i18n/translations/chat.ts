import type { Locale } from "../types";

const chat: Record<string, Record<Locale, string>> = {
  "chat.preparing": {
    "zh-CN": "正在准备专业内容...",
    en: "Preparing expert content...",
    "zh-TW": "正在準備專業內容...",
  },
  "chat.prepared": {
    "zh-CN": "已准备专业内容",
    en: "Expert content ready",
    "zh-TW": "已準備專業內容",
  },
  "chat.task": {
    "zh-CN": "任务",
    en: "Task",
    "zh-TW": "任務",
  },
  "chat.result": {
    "zh-CN": "结果",
    en: "Result",
    "zh-TW": "結果",
  },
};

export default chat;
