"use client";

import { useState } from "react";
import { Loader2, Users, ChevronLeft } from "lucide-react";
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
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
          <Users className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">家长身份已设置</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          您可以在登录后的「设置」中绑定孩子的账号，<br />
          查看孩子的学习进度和报告。
        </p>
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
          className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
          返回
        </button>
        <button
          type="button"
          onClick={handleComplete}
          disabled={submitting}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-600 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
