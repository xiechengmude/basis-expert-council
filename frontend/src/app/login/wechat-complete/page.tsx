"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function WeChatCompleteInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const redirect = searchParams.get("redirect") || "/";

    if (token) {
      // Store the BASIS JWT token
      localStorage.setItem("basis-token", token);
      // Redirect to the app
      window.location.href = redirect;
    } else {
      // No token — go back to login
      window.location.href = "/login?error=no_token";
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        <p className="text-lg font-medium text-gray-700">微信登录成功</p>
        <p className="mt-1 text-sm text-gray-500">正在跳转...</p>
      </div>
    </div>
  );
}

export default function WeChatCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      }
    >
      <WeChatCompleteInner />
    </Suspense>
  );
}
