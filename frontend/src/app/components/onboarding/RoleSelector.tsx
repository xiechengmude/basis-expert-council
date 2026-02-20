"use client";

import { useState } from "react";
import { GraduationCap, Users, BookOpen, Loader2, Check } from "lucide-react";
import { fetchWithAuth } from "@/app/hooks/useUser";

type Role = "student" | "parent" | "teacher";

interface RoleSelectorProps {
  onSelect: (role: Role) => void;
}

const ROLES: {
  value: Role;
  label: string;
  desc: string;
  icon: typeof GraduationCap;
  activeClasses: string;
  iconBg: string;
  iconActiveClasses: string;
}[] = [
  {
    value: "student",
    label: "我是学生",
    desc: "BASIS 在读学生，获取 AI 学伴辅导",
    icon: GraduationCap,
    activeClasses: "border-brand-500 bg-brand-50/80 ring-2 ring-brand-500/20",
    iconBg: "bg-brand-100 text-brand-600",
    iconActiveClasses: "bg-brand-600 text-white shadow-md shadow-brand-600/30",
  },
  {
    value: "parent",
    label: "我是家长",
    desc: "关注孩子的学业发展与规划",
    icon: Users,
    activeClasses: "border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20",
    iconBg: "bg-amber-100 text-amber-600",
    iconActiveClasses: "bg-amber-500 text-white shadow-md shadow-amber-500/30",
  },
  {
    value: "teacher",
    label: "我是老师",
    desc: "教学辅助、学情分析与报告",
    icon: BookOpen,
    activeClasses: "border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20",
    iconBg: "bg-blue-100 text-blue-600",
    iconActiveClasses: "bg-blue-500 text-white shadow-md shadow-blue-500/30",
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
        <h2 className="text-xl font-bold text-gray-900">选择你的身份</h2>
        <p className="mt-1.5 text-sm text-gray-500">
          我们将为你提供个性化的 AI 学习体验
        </p>
      </div>

      <div className="space-y-3">
        {ROLES.map(({ value, label, desc, icon: Icon, activeClasses, iconBg, iconActiveClasses }) => {
          const isActive = selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 sm:p-5 ${
                isActive
                  ? activeClasses
                  : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-200 sm:h-14 sm:w-14 ${
                  isActive ? iconActiveClasses : iconBg
                }`}
              >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-900">
                  {label}
                </div>
                <div className="mt-0.5 text-sm text-gray-500">{desc}</div>
              </div>
              {isActive && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 shadow-sm">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}
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
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
