"use client";

import { AlertTriangle } from "lucide-react";

interface MistakeSummary {
  total: number;
  by_status: Record<string, number>;
  by_subject: Record<string, number>;
  top_misconceptions: Array<{ id: string; count: number }>;
}

interface MistakeSummaryCardProps {
  summary: MistakeSummary;
  masteryRate: number;
  t: (key: string) => string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "#ef4444",
  reviewing: "#f59e0b",
  mastered: "#22c55e",
  regressed: "#f97316",
};

const STATUS_LABELS: Record<string, string> = {
  new: "academic.mistakes.status_new",
  reviewing: "academic.mistakes.status_reviewing",
  mastered: "academic.mistakes.status_mastered",
  regressed: "academic.mistakes.status_regressed",
};

const SUBJECT_COLORS: Record<string, string> = {
  math: "#14b8a6",
  english: "#8b5cf6",
  physics: "#f59e0b",
  chemistry: "#ef4444",
  biology: "#22c55e",
  history: "#3b82f6",
  science: "#14b8a6",
};

export default function MistakeSummaryCard({ summary, masteryRate, t }: MistakeSummaryCardProps) {
  if (!summary || summary.total === 0) return null;

  // --- SVG Donut chart calculations ---
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const statusOrder = ["mastered", "reviewing", "new", "regressed"];
  const segments: Array<{ key: string; value: number; color: string; offset: number }> = [];
  let cumulativeOffset = 0;

  for (const key of statusOrder) {
    const count = summary.by_status[key] || 0;
    if (count === 0) continue;
    const pct = count / summary.total;
    const length = pct * circumference;
    segments.push({
      key,
      value: count,
      color: STATUS_COLORS[key] || "#64748b",
      offset: cumulativeOffset,
    });
    cumulativeOffset += length;
  }

  // by_subject entries sorted descending
  const subjectEntries = Object.entries(summary.by_subject).sort(([, a], [, b]) => b - a);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/10">
          <AlertTriangle size={16} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white">
          {t("academic.mistakes.title")}
        </h2>
        <span className="ml-auto text-sm text-slate-500">
          {summary.total} {t("academic.mistakes.total")}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Donut chart */}
        <div className="flex flex-col items-center shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background ring */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {segments.map((seg) => {
              const pct = seg.value / summary.total;
              const dashLength = pct * circumference;
              return (
                <circle
                  key={seg.key}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={-seg.offset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${cx} ${cy})`}
                  className="transition-all duration-1000 ease-out"
                />
              );
            })}
            {/* Center mastery rate */}
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-2xl font-bold"
              fontSize={28}
            >
              {Math.round(masteryRate * 100)}%
            </text>
            <text
              x={cx}
              y={cy + 16}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-400 text-xs"
              fontSize={11}
            >
              {t("academic.mistakes.mastery_rate")}
            </text>
          </svg>

          {/* Status legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4">
            {statusOrder.map((key) => {
              const count = summary.by_status[key] || 0;
              if (count === 0) return null;
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[key] }}
                  />
                  <span className="text-xs text-slate-400">
                    {t(STATUS_LABELS[key] || key)} ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: by_subject + misconceptions */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* By subject breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">
              {t("academic.mistakes.by_subject")}
            </h3>
            <div className="space-y-2.5">
              {subjectEntries.map(([subject, count]) => {
                const pct = Math.round((count / summary.total) * 100);
                const color = SUBJECT_COLORS[subject] || "#64748b";
                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300">
                        {t(`academic.subject.${subject}`)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top misconceptions */}
          {summary.top_misconceptions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                {t("academic.mistakes.top_misconceptions")}
              </h3>
              <div className="space-y-2">
                {summary.top_misconceptions.slice(0, 5).map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-2"
                  >
                    <span className="text-xs font-medium text-slate-500 w-5 shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="text-sm text-slate-300 truncate flex-1">
                      {item.id}
                    </span>
                    <span className="text-xs text-red-400 shrink-0">
                      x{item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
