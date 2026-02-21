export type Locale = "zh-CN" | "en" | "zh-TW";

export const SUPPORTED_LOCALES: Locale[] = ["zh-CN", "en", "zh-TW"];

export const LOCALE_LABELS: Record<Locale, string> = {
  "zh-CN": "简体中文",
  en: "English",
  "zh-TW": "繁體中文",
};
