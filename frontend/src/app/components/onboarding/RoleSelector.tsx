"use client";

import { useState } from "react";
import { GraduationCap, Users, BookOpen, Loader2 } from "lucide-react";
import { fetchWithAuth } from "@/app/hooks/useUser";

type Role = "student" | "parent" | "teacher";

interface RoleSelectorProps {
  onSelect: (role: Role) => void;
}

const ROLES: { value: Role; label: string; desc: string; icon: typeof GraduationCap; color: string }[] = [
  {
    value: "student",
    label: "我是学生",
    desc: "BASIS 在读学生",
    icon: GraduationCap,
    color: "border-brand-600 bg-brand-50 text-brand-600",
  },
  {
    value: "parent",
    label: "我是家长",
    desc: "关注孩子的学业发展",
    icon: Users,
    color: "border-amber-500 bg-amber-50 text-amber-600",
  },
  {
    value: "teacher",
    label: "我是老师",
    desc: "教学辅助与分析",
    icon: BookOpen,
    color: "border-blue-500 bg-blue-50 text-blue-600",
  },
];

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  const [selected, setSelected] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetchWithAuth("/api/user/role", {
        method: "PUT",
        body: JSON.stringify({ role: selected }),
      });
      if (res.ok) {
        onSelect(selected);
      } else {
        const data = await res.json();
        setError(data.error || "设置角色失败");
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
        <h2 className="text-lg font-semibold text-gray-900">选择你的身份</h2>
        <p className="mt-1 text-sm text-gray-500">我们将为你提供个性化的体验</p>
      </div>

      <div className="grid gap-3">
        {ROLES.map(({ value, label, desc, icon: Icon, color }) => {
          const isActive = selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                isActive
                  ? color
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  isActive ? color : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className={`font-medium ${isActive ? "" : "text-gray-900"}`}>
                  {label}
                </div>
                <div className={`text-sm ${isActive ? "opacity-80" : "text-gray-500"}`}>
                  {desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!selected || submitting}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            设置中...
          </>
        ) : (
          "继续"
        )}
      </button>
    </div>
  );
}
