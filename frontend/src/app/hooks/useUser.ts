"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export interface UserInfo {
  id: number;
  nickname: string;
  avatar_url: string | null;
  phone: string | null;
  role: string;
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
  kyc_completed: boolean;
  student_profile: Record<string, unknown> | null;
  linked_students: Record<string, unknown>[] | null;
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
 * Get the stored BASIS JWT token
 */
export function getBasisToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("basis-token");
}

/**
 * Fetch with BASIS auth token.
 */
import { getApiBaseUrl } from "@/lib/config";
export { getApiBaseUrl };

export async function fetchWithAuth(path: string, options: RequestInit = {}): Promise<Response> {
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

  const syncAttempted = useRef(false);

  /**
   * 当有 Supabase session 但无 basis-token 时，自动调 /api/auth/sync 补上。
   * 这解决了 Supabase cookie 自动续期但 basis-token 过期/丢失的问题。
   */
  const ensureBasisToken = useCallback(async (): Promise<string | null> => {
    const existing = getBasisToken();
    if (existing) return existing;
    if (syncAttempted.current) return null;
    syncAttempted.current = true;

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabase_uid: session.user.id,
          phone: session.user.phone || "",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("basis-token", data.token);
          return data.token;
        }
      }
    } catch {
      // silent — sync is best-effort
    }
    return null;
  }, []);

  const fetchProfile = useCallback(async () => {
    let token = getBasisToken();
    if (!token) {
      token = await ensureBasisToken();
    }
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
        // Try once more with fresh sync
        const freshToken = await ensureBasisToken();
        if (freshToken) {
          const retry = await fetchWithAuth("/api/user/me");
          if (retry.ok) {
            const data = await retry.json();
            setProfile(data);
            setError(null);
            return;
          }
        }
        setProfile(null);
      } else {
        setError("获取用户信息失败");
      }
    } catch {
      setError("网络连接失败");
    } finally {
      setLoading(false);
    }
  }, [ensureBasisToken]);

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
