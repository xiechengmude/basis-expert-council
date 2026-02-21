import type { Locale } from "../types";
import common from "./common";
import quota from "./quota";
import chat from "./chat";
import welcome from "./welcome";
import login from "./login";
import onboarding from "./onboarding";
import tools from "./tools";

export const translations: Record<string, Record<Locale, string>> = {
  ...common,
  ...quota,
  ...chat,
  ...welcome,
  ...login,
  ...onboarding,
  ...tools,
};
