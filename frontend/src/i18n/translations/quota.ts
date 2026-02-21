import type { Locale } from "../types";

const quota: Record<string, Record<Locale, string>> = {
  "quota.exhausted": {
    "zh-CN": "今日对话次数已用完（{used}/{limit}）",
    en: "Daily limit reached ({used}/{limit})",
    "zh-TW": "今日對話次數已用完（{used}/{limit}）",
  },
  "quota.upgrade": {
    "zh-CN": "升级会员",
    en: "Upgrade",
    "zh-TW": "升級會員",
  },
  "quota.low": {
    "zh-CN": "今日剩余 {remaining} 次对话（{used}/{limit}）",
    en: "{remaining} chats left today ({used}/{limit})",
    "zh-TW": "今日剩餘 {remaining} 次對話（{used}/{limit}）",
  },
  "quota.upgradeShort": {
    "zh-CN": "升级",
    en: "Upgrade",
    "zh-TW": "升級",
  },
  "quota.normal": {
    "zh-CN": "今日 {used}/{limit}",
    en: "Today {used}/{limit}",
    "zh-TW": "今日 {used}/{limit}",
  },
  "quota.unlimited": {
    "zh-CN": "无限对话",
    en: "Unlimited",
    "zh-TW": "無限對話",
  },
};

export default quota;
