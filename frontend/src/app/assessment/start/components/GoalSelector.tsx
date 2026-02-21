"use client";

import {
  Stethoscope,
  TrendingUp,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface GoalSelectorProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  selected: string;
  onSelect: (goal: string) => void;
}

interface GoalOption {
  key: string;
  icon: LucideIcon;
}

const GOALS: GoalOption[] = [
  { key: "diagnostic", icon: Stethoscope },
  { key: "improve", icon: TrendingUp },
  { key: "exam", icon: ClipboardList },
  { key: "placement", icon: GraduationCap },
];

export default function GoalSelector({
  t,
  selected,
  onSelect,
}: GoalSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {GOALS.map((g) => (
        <button
          key={g.key}
          onClick={() => onSelect(g.key)}
          className={`group relative rounded-xl border p-5 text-left transition-all duration-200 ${
            selected === g.key
              ? "border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10"
              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                selected === g.key
                  ? "bg-brand-500/20"
                  : "bg-white/[0.06]"
              }`}
            >
              <g.icon
                size={20}
                className={
                  selected === g.key ? "text-brand-400" : "text-slate-500"
                }
              />
            </div>
            <div>
              <span
                className={`text-sm font-semibold block ${
                  selected === g.key ? "text-white" : "text-slate-300"
                }`}
              >
                {t(`assessment.wizard.goal.${g.key}`)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                {t(`assessment.wizard.goal.${g.key}_desc`)}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
