"use client";

interface GoalItem {
  goal_type: string;
  goal_text: string;
  target_value: number | null;
  current_value: number | null;
  gap_pct: number | null;
  status: string;
}

interface GoalTimelineProps {
  goals: GoalItem[];
  t: (key: string) => string;
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  achieved:  { color: "#22c55e", label: "academic.goals.status_achieved" },
  on_track:  { color: "#14b8a6", label: "academic.goals.status_on_track" },
  at_risk:   { color: "#f59e0b", label: "academic.goals.status_at_risk" },
  behind:    { color: "#ef4444", label: "academic.goals.status_behind" },
  not_started: { color: "#64748b", label: "academic.goals.status_not_started" },
};

export default function GoalTimeline({ goals, t }: GoalTimelineProps) {
  if (!goals || goals.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        {t("academic.goals.timeline_title")}
      </h2>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/[0.06]" />

        <div className="space-y-6">
          {goals.map((goal, idx) => {
            const config = STATUS_CONFIG[goal.status] || STATUS_CONFIG.not_started;
            const color = config.color;
            const progress =
              goal.target_value && goal.current_value !== null
                ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
                : 0;

            return (
              <div key={idx} className="relative pl-14">
                {/* Timeline dot */}
                <div
                  className="absolute left-3 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: color, backgroundColor: `${color}20` }}
                >
                  {goal.status === "achieved" ? (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path
                        d="M2 5.5L4 7.5L8 3"
                        fill="none"
                        stroke={color}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  )}
                </div>

                <div>
                  {/* Header row */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ color, backgroundColor: `${color}15` }}
                    >
                      {t(`academic.goals.${goal.goal_type}`)}
                    </span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ color, backgroundColor: `${color}10` }}
                    >
                      {t(config.label)}
                    </span>
                  </div>

                  {/* Goal text */}
                  <p className="text-sm text-slate-300 mb-2">{goal.goal_text}</p>

                  {/* Inline progress */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden max-w-[200px]">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {goal.current_value ?? "—"} / {goal.target_value ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
