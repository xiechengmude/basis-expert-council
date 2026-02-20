"use client";

import { useState, useEffect, useCallback } from "react";

export interface UserInfo {
  id: number;
  nickname: string;
  avatar_url: string | null;
  phone: string | null;
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
  expires_at: string | null;
}

export interface QuotaInfo {
  allowed: boolean;
  plan: string;
  daily_limit: number;
  used_today: number;
  remaining: number;
  allowed_agents: string[];
  priority: boolean;
}

export interface UserProfile {
  user: UserInfo;
  subscription: SubscriptionInfo;
  quota: QuotaInfo;
}

const PLAN_NAMES: Record<string, string> = {
  free: "免费试用",
  basic: "基础会员",
  premium: "高级会员",
  vip: "VIP 会员",
};

export function getPlanName(plan: string): string {
  return PLAN_NAMES[plan] || plan;
}

/**
 * Get the BASIS Business API base URL.
 * Reads from env var first, then tries to derive from LangGraph config.
 */
function getApiBaseUrl(): string {
  if (typeof window === "undefined") return "";
  // Prefer explicit env var
  const envUrl = process.env.NEXT_PUBLIC_BASIS_API_URL;
  if (envUrl) return envUrl;
  // Fallback: derive from LangGraph URL (port 5096 instead of 5095)
  try {
    const config = localStorage.getItem("deep-agent-config");
    if (config) {
      const parsed = JSON.parse(config);
      const lgUrl = parsed.deploymentUrl || "http://127.0.0.1:5095";
      return lgUrl.replace(":5095", ":5096");
    }
  } catch {}
  return "http://127.0.0.1:5096";
}

/**
 * Get the stored BASIS JWT token
 */
export function getBasisToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("basis-token");
}

/**
 * Fetch with BASIS auth token
 */
async function fetchWithAuth(path: string, options: RequestInit = {}): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  const token = getBasisToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`${baseUrl}${path}`, { ...options, headers });
}

/**
 * Hook to fetch and manage user profile + quota information
 */
export function useUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    const token = getBasisToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetchWithAuth("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setError(null);
      } else if (res.status === 401) {
        localStorage.removeItem("basis-token");
        setProfile(null);
      } else {
        setError("获取用户信息失败");
      }
    } catch {
      setError("网络连接失败");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshQuota = useCallback(async () => {
    const token = getBasisToken();
    if (!token) return;

    try {
      const res = await fetchWithAuth("/api/user/usage");
      if (res.ok) {
        const data = await res.json();
        if (profile) {
          setProfile((prev) =>
            prev ? { ...prev, quota: data.quota } : null
          );
        }
      }
    } catch {}
  }, [profile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
    refreshQuota,
    isLoggedIn: !!profile,
    plan: profile?.subscription?.plan || "free",
    planName: getPlanName(profile?.subscription?.plan || "free"),
    quota: profile?.quota || null,
  };
}
