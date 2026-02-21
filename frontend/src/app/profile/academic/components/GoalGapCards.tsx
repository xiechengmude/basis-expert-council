"use client";

import { Target } from "lucide-react";

interface Goal {
  goal_type: string;
  goal_text: string;
  target_value: number | null;
  current_value: number | null;
  gap_pct: number | null;
  status: string;
}

interface GoalGapCardsProps {
  goals: Goal[];
  t: (key: string) => string;
}

function getProgressColor(gapPct: number | null): {
  bar: string;
  text: string;
  bg: string;
} {
  if (gapPct === null) return { bar: "bg-slate-500", text: "text-slate-400", bg: "bg-slate-500/10" };
  if (gapPct < 10) return { bar: "bg-green-500", text: "text-green-400", bg: "bg-green-500/10" };
  if (gapPct < 30) return { bar: "bg-yellow-500", text: "text-yellow-400", bg: "bg-yellow-500/10" };
  return { bar: "bg-red-500", text: "text-red-400", bg: "bg-red-500/10" };
}

function getStatusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case "achieved":
      return { label: status, className: "text-green-400 bg-green-400/10" };
    case "on_track":
      return { label: status, className: "text-teal-400 bg-teal-400/10" };
    case "at_risk":
      return { label: status, className: "text-yellow-400 bg-yellow-400/10" };
    case "behind":
      return { label: status, className: "text-red-400 bg-red-400/10" };
    default:
      return { label: status, className: "text-slate-400 bg-slate-400/10" };
  }
}

export default function GoalGapCards({ goals, t }: GoalGapCardsProps) {
  if (!goals || goals.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/10">
          <Target size={16} className="text-teal-400" />
        </div>
        <h2 className="text-xl font-bold text-white">
          {t("academic.goals.title")}
        </h2>
      </div>

      <div className="space-y-5">
        {goals.map((goal, idx) => {
          const progress =
            goal.target_value && goal.current_value !== null
              ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
              : 0;
          const colors = getProgressColor(goal.gap_pct);
          const badge = getStatusBadge(goal.status);

          return (
            <div
              key={idx}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300">
                    {t(`academic.goals.${goal.goal_type}`)}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                <span className={`text-sm font-semibold ${colors.text}`}>
                  {goal.current_value ?? "—"} / {goal.target_value ?? "—"}
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-3 truncate">
                {goal.goal_text}
              </p>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors.bar} transition-all duration-1000 ease-out`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-slate-500">0</span>
                <span className="text-xs text-slate-500">
                  {goal.gap_pct !== null ? `${Math.round(100 - goal.gap_pct)}%` : "—"}
                </span>
                <span className="text-xs text-slate-500">{goal.target_value ?? "—"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
