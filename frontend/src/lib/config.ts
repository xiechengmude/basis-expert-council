export interface StandaloneConfig {
  deploymentUrl: string;
  assistantId: string;
  langsmithApiKey?: string;
}

const CONFIG_KEY = "deep-agent-config";

/**
 * Check if running in a deployed (non-localhost) environment.
 */
function isDeployed(): boolean {
  if (typeof window === "undefined") return false;
  return !["localhost", "127.0.0.1"].includes(window.location.hostname);
}

/**
 * Resolve LangGraph API URL:
 * - Deployed: "/agent" (nginx proxies /agent/* → LangGraph :5095)
 * - Local dev: "http://127.0.0.1:5095" (direct)
 * - NEXT_PUBLIC_LANGGRAPH_URL override if set to a real external URL
 */
function resolveDefaultDeploymentUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_LANGGRAPH_URL || "";
  // Valid external URL (not Docker-internal) → use as-is
  if (envUrl && !envUrl.includes("basis-agent") && !envUrl.includes("basis-api")) {
    return envUrl;
  }
  // Deployed environment → nginx proxy at /agent
  if (isDeployed()) return "/agent";
  return "http://127.0.0.1:5095";
}

const DEFAULT_CONFIG: StandaloneConfig = {
  deploymentUrl: resolveDefaultDeploymentUrl(),
  assistantId: "basis-expert",
  langsmithApiKey: process.env.NEXT_PUBLIC_LANGSMITH_API_KEY || "",
};

/**
 * Sanitize deploymentUrl: Docker-internal hostnames are unreachable from browser.
 * In deployed (non-localhost) environments, replace with empty string for nginx proxy.
 */
function sanitizeDeploymentUrl(url: string): string {
  if (url.includes("basis-agent") || url.includes("basis-api")) {
    // Derive from current browser location (Docker deployments without reverse proxy)
    try {
      const parsed = new URL(url);
      return `${window.location.protocol}//${window.location.hostname}:${parsed.port}`;
    } catch {}
    return url;
  }
  return url;
}

export function getConfig(): StandaloneConfig | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(CONFIG_KEY);
  if (!stored) {
    const config = { ...DEFAULT_CONFIG, deploymentUrl: sanitizeDeploymentUrl(DEFAULT_CONFIG.deploymentUrl) };
    saveConfig(config);
    return config;
  }

  try {
    const parsed: StandaloneConfig = JSON.parse(stored);
    // Fix stale Docker-internal URLs saved in localStorage
    const sanitized = sanitizeDeploymentUrl(parsed.deploymentUrl);
    if (sanitized !== parsed.deploymentUrl) {
      parsed.deploymentUrl = sanitized;
      saveConfig(parsed);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveConfig(config: StandaloneConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}
