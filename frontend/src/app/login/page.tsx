"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Smartphone,
  MessageSquare,
  Send,
  Loader2,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  LoginForm (inner component, uses useSearchParams)                  */
/* ------------------------------------------------------------------ */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  /* ---- state ---- */
  const [activeTab, setActiveTab] = useState<"phone" | "wechat">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  /* ---- countdown timer ---- */
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  /* ---- clear error when switching tabs ---- */
  useEffect(() => {
    setError("");
  }, [activeTab]);

  /* ---- helper: get business API base URL ---- */
  const getApiBaseUrl = useCallback(() => {
    const envUrl = process.env.NEXT_PUBLIC_BASIS_API_URL;
    if (envUrl) return envUrl;
    try {
      const config = localStorage.getItem("deep-agent-config");
      if (config) {
        const parsed = JSON.parse(config);
        const lgUrl = parsed.deploymentUrl || "http://127.0.0.1:5095";
        return lgUrl.replace(":5095", ":5096");
      }
    } catch {}
    return "http://127.0.0.1:5096";
  }, []);

  /* ---- helper: sync with BASIS backend ---- */
  const syncBasisToken = useCallback(
    async (supabaseUid: string, userPhone: string) => {
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/auth/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabase_uid: supabaseUid,
            phone: userPhone,
          }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem("basis-token", data.token);
        }
      } catch {
        // Non-critical: continue even if sync fails
        console.warn("BASIS token sync failed");
      }
    },
    [getApiBaseUrl]
  );

  /* ---- send SMS code ---- */
  const handleSendCode = useCallback(async () => {
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入有效的 11 位手机号");
      return;
    }

    setError("");
    setSendingCode(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "验证码发送失败，请稍后重试");
        return;
      }

      setCountdown(60);
    } catch {
      setError("网络连接失败，请检查网络后重试");
    } finally {
      setSendingCode(false);
    }
  }, [phone]);

  /* ---- phone login ---- */
  const handlePhoneLogin = useCallback(async () => {
    if (!phone || !code) {
      setError("请输入手机号和验证码");
      return;
    }
    if (code.length < 4) {
      setError("请输入完整的验证码");
      return;
    }

    setError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/auth/phone-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登录失败，请重试");
        return;
      }

      // Set Supabase session on the client (cookies handled by @supabase/ssr)
      const supabase = createClient();
      await supabase.auth.setSession({
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
      });

      // Sync with BASIS backend to get business JWT
      if (data.userId) {
        await syncBasisToken(data.userId, phone);
      }

      router.push(redirect);
    } catch {
      setError("网络连接失败，请检查网络后重试");
    } finally {
      setLoggingIn(false);
    }
  }, [phone, code, redirect, router, syncBasisToken]);

  /* ---- WeChat login ---- */
  const handleWeChatLogin = useCallback(() => {
    const baseUrl = getApiBaseUrl();
    const callbackUri = encodeURIComponent(
      `${window.location.origin}/api/auth/wechat/callback`
    );
    window.location.href = `${baseUrl}/api/auth/wechat/url?redirect_uri=${callbackUri}&state=${encodeURIComponent(redirect)}`;
  }, [redirect, getApiBaseUrl]);

  /* ---- keyboard: Enter to submit ---- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && activeTab === "phone" && phone && code) {
        handlePhoneLogin();
      }
    },
    [activeTab, phone, code, handlePhoneLogin]
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#f0f7f7] to-white px-4 py-8">
      {/* Card */}
      <div className="w-full max-w-[400px]">
        {/* ---- Brand header ---- */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2F6868] shadow-lg">
            <GraduationCap className="h-9 w-9 text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            BASIS 教育专家
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            AI 驱动的国际学校学习助手
          </p>
        </div>

        {/* ---- Main card ---- */}
        <div className="rounded-2xl bg-white shadow-xl shadow-gray-200/60 ring-1 ring-gray-100">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              type="button"
              onClick={() => setActiveTab("phone")}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
                activeTab === "phone"
                  ? "border-b-2 border-[#2F6868] text-[#2F6868]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Smartphone className="h-4 w-4" />
              手机登录
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("wechat")}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
                activeTab === "wechat"
                  ? "border-b-2 border-[#07C160] text-[#07C160]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              微信登录
            </button>
          </div>

          {/* Tab content */}
          <div className="p-6" onKeyDown={handleKeyDown}>
            {/* ---------- Phone login ---------- */}
            {activeTab === "phone" && (
              <div className="space-y-4">
                {/* Phone input */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    手机号
                  </label>
                  <div className="flex gap-2">
                    <div className="flex h-11 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                      +86
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="请输入 11 位手机号"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                      }
                      className="h-11 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2F6868] focus:outline-none focus:ring-2 focus:ring-[#2F6868]/20"
                    />
                  </div>
                </div>

                {/* Verification code */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    验证码
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="请输入验证码"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="h-11 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2F6868] focus:outline-none focus:ring-2 focus:ring-[#2F6868]/20"
                    />
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={
                        countdown > 0 ||
                        sendingCode ||
                        !/^1\d{10}$/.test(phone)
                      }
                      className="flex h-11 w-[120px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#2F6868] text-sm font-medium text-[#2F6868] transition-colors hover:bg-[#2F6868]/5 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent"
                    >
                      {countdown > 0 ? (
                        `${countdown}s 后重发`
                      ) : sendingCode ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          发送中
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          获取验证码
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-600">
                    {error}
                  </div>
                )}

                {/* Login button */}
                <button
                  type="button"
                  onClick={handlePhoneLogin}
                  disabled={loggingIn || !phone || code.length < 4}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2F6868] text-sm font-medium text-white shadow-sm transition-all hover:bg-[#256060] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                >
                  {loggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      登录
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ---------- WeChat login ---------- */}
            {activeTab === "wechat" && (
              <div className="space-y-5">
                <div className="text-center">
                  {/* WeChat icon */}
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#07C160]/10">
                    <svg
                      className="h-10 w-10"
                      viewBox="0 0 24 24"
                      fill="#07C160"
                    >
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.329 6.329 0 0 1-.262-1.82c0-3.563 3.328-6.451 7.434-6.451.258 0 .513.013.764.036C16.893 4.523 13.122 2.188 8.691 2.188zm-2.6 4.408c.56 0 1.016.455 1.016 1.016 0 .56-.455 1.016-1.015 1.016-.56 0-1.016-.455-1.016-1.016 0-.56.456-1.016 1.016-1.016zm5.201 0c.56 0 1.016.455 1.016 1.016 0 .56-.455 1.016-1.016 1.016-.56 0-1.015-.455-1.015-1.016 0-.56.455-1.016 1.015-1.016zm4.49 3.87c-3.559 0-6.45 2.488-6.45 5.56 0 3.07 2.891 5.558 6.45 5.558a7.482 7.482 0 0 0 2.145-.314.618.618 0 0 1 .51.07l1.372.8a.238.238 0 0 0 .122.04.213.213 0 0 0 .21-.213c0-.052-.02-.103-.034-.154l-.282-1.067a.425.425 0 0 1 .154-.478C21.165 19.2 22.133 17.47 22.133 15.56v-.434c-.244-2.838-2.924-4.66-5.65-4.66zm-2.143 3.27c.406 0 .735.329.735.735a.735.735 0 0 1-.735.735.735.735 0 0 1-.735-.735c0-.406.329-.735.735-.735zm4.291 0c.406 0 .735.329.735.735a.735.735 0 0 1-.735.735.735.735 0 0 1-.735-.735c0-.406.329-.735.735-.735z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">
                    使用微信账号快速安全登录
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-600">
                    {error}
                  </div>
                )}

                {/* WeChat login button */}
                <button
                  type="button"
                  onClick={handleWeChatLogin}
                  className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#07C160] text-sm font-medium text-white shadow-sm transition-all hover:bg-[#06AD56] active:scale-[0.98]"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.329 6.329 0 0 1-.262-1.82c0-3.563 3.328-6.451 7.434-6.451.258 0 .513.013.764.036C16.893 4.523 13.122 2.188 8.691 2.188zm-2.6 4.408c.56 0 1.016.455 1.016 1.016 0 .56-.455 1.016-1.015 1.016-.56 0-1.016-.455-1.016-1.016 0-.56.456-1.016 1.016-1.016zm5.201 0c.56 0 1.016.455 1.016 1.016 0 .56-.455 1.016-1.016 1.016-.56 0-1.015-.455-1.015-1.016 0-.56.455-1.016 1.015-1.016zm4.49 3.87c-3.559 0-6.45 2.488-6.45 5.56 0 3.07 2.891 5.558 6.45 5.558a7.482 7.482 0 0 0 2.145-.314.618.618 0 0 1 .51.07l1.372.8a.238.238 0 0 0 .122.04.213.213 0 0 0 .21-.213c0-.052-.02-.103-.034-.154l-.282-1.067a.425.425 0 0 1 .154-.478C21.165 19.2 22.133 17.47 22.133 15.56v-.434c-.244-2.838-2.924-4.66-5.65-4.66zm-2.143 3.27c.406 0 .735.329.735.735a.735.735 0 0 1-.735.735.735.735 0 0 1-.735-.735c0-.406.329-.735.735-.735zm4.291 0c.406 0 .735.329.735.735a.735.735 0 0 1-.735.735.735.735 0 0 1-.735-.735c0-.406.329-.735.735-.735z" />
                  </svg>
                  微信一键登录
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---- Footer ---- */}
        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          登录即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page (default export with Suspense boundary)                       */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f0f7f7] to-white">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#2F6868]" />
            <p className="mt-3 text-sm text-gray-400">加载中...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
