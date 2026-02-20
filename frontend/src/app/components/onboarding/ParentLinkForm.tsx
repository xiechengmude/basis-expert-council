"use client";

import { useState } from "react";
import { Loader2, Users, ChevronLeft, Heart, ArrowRight } from "lucide-react";
import { fetchWithAuth } from "@/app/hooks/useUser";

interface ParentLinkFormProps {
  onComplete: () => void;
  onBack: () => void;
}

export function ParentLinkForm({ onComplete, onBack }: ParentLinkFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetchWithAuth("/api/user/complete-kyc", {
        method: "POST",
      });
      if (res.ok) {
        onComplete();
      } else {
        const data = await res.json();
        setError(data.error || "操作失败");
      }
    } catch {
      setError("网络连接失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 shadow-sm">
          <Users className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">家长身份已设置</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          欢迎您加入 BasisPilot 家长社区
        </p>
      </div>

      <div className="space-y-3 rounded-xl bg-amber-50/60 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200">
            <Heart className="h-3 w-3 text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">绑定孩子的账号</p>
            <p className="text-xs text-gray-500">登录后在「个人资料」中绑定，查看学习进度</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200">
            <ArrowRight className="h-3 w-3 text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">获取学习报告</p>
            <p className="text-xs text-gray-500">定期了解孩子的学业表现和成长建议</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          返回
        </button>
        <button
          type="button"
          onClick={handleComplete}
          disabled={submitting}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              处理中...
            </>
          ) : (
            "开始使用"
          )}
        </button>
      </div>
    </div>
  );
}
