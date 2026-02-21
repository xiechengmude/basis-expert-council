"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Smartphone,
  MessageSquare,
  Send,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { t } = useI18n();

  /* ---- state ---- */
  const [activeTab, setActiveTab] = useState<"phone" | "wechat">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    // Docker-internal hostnames are unreachable from browser
    if (envUrl && !envUrl.includes("basis-api") && !envUrl.includes("basis-agent")) return envUrl;
    try {
      const config = localStorage.getItem("deep-agent-config");
      if (config) {
        const parsed = JSON.parse(config);
        const lgUrl = parsed.deploymentUrl || "http://127.0.0.1:5095";
        return lgUrl.replace(":5095", ":5096");
      }
    } catch {}
    // Derive from current browser location (Docker deployments without reverse proxy)
    if (envUrl) {
      try {
        const parsed = new URL(envUrl);
        return `${window.location.protocol}//${window.location.hostname}:${parsed.port}`;
      } catch {}
    }
    return "";
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
        console.warn("BASIS token sync failed");
      }
    },
    [getApiBaseUrl]
  );

  /* ---- send SMS code ---- */
  const handleSendCode = useCallback(async () => {
    if (!/^1\d{10}$/.test(phone)) {
      setError(t("login.error.invalidPhone"));
      return;
    }

    setError("");
    setSendingCode(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("login.error.sendFailed"));
        return;
      }

      setCountdown(60);
    } catch {
      setError(t("login.error.network"));
    } finally {
      setSendingCode(false);
    }
  }, [phone, t, getApiBaseUrl]);

  /* ---- phone login ---- */
  const handlePhoneLogin = useCallback(async () => {
    if (!phone || !code) {
      setError(t("login.error.missingFields"));
      return;
    }
    if (code.length < 4) {
      setError(t("login.error.incompleteCode"));
      return;
    }

    setError("");
    setLoggingIn(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/phone-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("login.error.loginFailed"));
        return;
      }

      const supabase = createClient();
      await supabase.auth.setSession({
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
      });

      if (data.userId) {
        await syncBasisToken(data.userId, phone);
      }

      // Close modal — AuthProvider state update triggers page re-render
      onOpenChange(false);
    } catch {
      setError(t("login.error.network"));
    } finally {
      setLoggingIn(false);
    }
  }, [phone, code, syncBasisToken, t, onOpenChange, getApiBaseUrl]);

  /* ---- WeChat login ---- */
  const handleWeChatLogin = useCallback(() => {
    const baseUrl = getApiBaseUrl();
    const callbackUri = encodeURIComponent(
      `${window.location.origin}/api/auth/wechat/callback`
    );
    // After OAuth callback, user returns to / which will show chat (authenticated)
    window.location.href = `${baseUrl}/api/auth/wechat/url?redirect_uri=${callbackUri}&state=${encodeURIComponent("/")}`;
  }, [getApiBaseUrl]);

  /* ---- keyboard: Enter to submit ---- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && activeTab === "phone" && phone && code) {
        handlePhoneLogin();
      }
    },
    [activeTab, phone, code, handlePhoneLogin]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0 text-center">
          <div className="mx-auto mb-3">
            <img
              src="/logo-mark.svg"
              alt="BasisPilot"
              width={48}
              height={48}
              className="h-12 w-12 drop-shadow-lg"
            />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {t("login.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("login.subtitle")}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab("phone")}
            className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
              activeTab === "phone"
                ? "border-b-2 border-brand-600 text-brand-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            {t("login.tab.phone")}
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
            {t("login.tab.wechat")}
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
                  {t("login.label.phone")}
                </label>
                <div className="flex gap-2">
                  <div className="flex h-11 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                    +86
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder={t("login.placeholder.phone")}
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                    }
                    className="h-11 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                  />
                </div>
              </div>

              {/* Verification code */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  {t("login.label.code")}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={t("login.placeholder.code")}
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="h-11 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={
                      countdown > 0 ||
                      sendingCode ||
                      !/^1\d{10}$/.test(phone)
                    }
                    className="flex h-11 w-[120px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-brand-600 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-600/5 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent"
                  >
                    {countdown > 0 ? (
                      t("login.resendCountdown", { seconds: countdown })
                    ) : sendingCode ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {t("login.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        {t("login.sendCode")}
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

              {/* Terms of Service checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-600 focus:ring-brand-600/20"
                />
                <span className="text-xs leading-5 text-gray-500">
                  {t("login.terms.agree")}{" "}
                  <a href="/terms" className="text-brand-600 hover:underline">{t("login.terms.tos")}</a>
                  {" "}{t("login.terms.and")}{" "}
                  <a href="/privacy" className="text-brand-600 hover:underline">{t("login.terms.privacy")}</a>
                </span>
              </label>

              {/* Login button */}
              <button
                type="button"
                onClick={handlePhoneLogin}
                disabled={loggingIn || !phone || code.length < 4 || !agreedToTerms}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                {loggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("login.loggingIn")}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    {t("login.loginButton")}
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
                  {t("login.wechat.desc")}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-600">
                  {error}
                </div>
              )}

              {/* Terms of Service checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-600 focus:ring-brand-600/20"
                />
                <span className="text-xs leading-5 text-gray-500">
                  {t("login.terms.agree")}{" "}
                  <a href="/terms" className="text-brand-600 hover:underline">{t("login.terms.tos")}</a>
                  {" "}{t("login.terms.and")}{" "}
                  <a href="/privacy" className="text-brand-600 hover:underline">{t("login.terms.privacy")}</a>
                </span>
              </label>

              {/* WeChat login button */}
              <button
                type="button"
                onClick={handleWeChatLogin}
                disabled={!agreedToTerms}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#07C160] text-sm font-medium text-white shadow-sm transition-all hover:bg-[#06AD56] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.329 6.329 0 0 1-.262-1.82c0-3.563 3.328-6.451 7.434-6.451.258 0 .513.013.764.036C16.893 4.523 13.122 2.188 8.691 2.188zm-2.6 4.408c.56 0 1.016.455 1.016 1.016 0 .56-.455 1.016-1.015 1.016-.56 0-1.016-.455-1.016-1.016 0-.56.456-1.016 1.016-1.016zm5.201 0c.56 0 1.016.455 1.016 1.016 0 .56-.455 1.016-1.016 1.016-.56 0-1.015-.455-1.015-1.016 0-.56.455-1.016 1.015-1.016zm4.49 3.87c-3.559 0-6.45 2.488-6.45 5.56 0 3.07 2.891 5.558 6.45 5.558a7.482 7.482 0 0 0 2.145-.314.618.618 0 0 1 .51.07l1.372.8a.238.238 0 0 0 .122.04.213.213 0 0 0 .21-.213c0-.052-.02-.103-.034-.154l-.282-1.067a.425.425 0 0 1 .154-.478C21.165 19.2 22.133 17.47 22.133 15.56v-.434c-.244-2.838-2.924-4.66-5.65-4.66zm-2.143 3.27c.406 0 .735.329.735.735a.735.735 0 0 1-.735.735.735.735 0 0 1-.735-.735c0-.406.329-.735.735-.735zm4.291 0c.406 0 .735.329.735.735a.735.735 0 0 1-.735.735.735.735 0 0 1-.735-.735c0-.406.329-.735.735-.735z" />
                </svg>
                {t("login.wechat.button")}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-gray-400">
            Powered by xDAN AI
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
