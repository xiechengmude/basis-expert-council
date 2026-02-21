"use client";

import { Brain } from "lucide-react";

interface BloomMasteryChartProps {
  bloomMastery: Record<string, number>; // level -> mastery rate (0-1)
  t: (key: string) => string;
}

const BLOOM_LEVELS = [
  "remember",
  "understand",
  "apply",
  "analyze",
  "evaluate",
  "create",
] as const;

const BLOOM_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  remember:   { bar: "bg-green-500",  bg: "bg-green-500/10",  text: "text-green-400" },
  understand: { bar: "bg-teal-500",   bg: "bg-teal-500/10",   text: "text-teal-400" },
  apply:      { bar: "bg-blue-500",   bg: "bg-blue-500/10",   text: "text-blue-400" },
  analyze:    { bar: "bg-indigo-500", bg: "bg-indigo-500/10", text: "text-indigo-400" },
  evaluate:   { bar: "bg-violet-500", bg: "bg-violet-500/10", text: "text-violet-400" },
  create:     { bar: "bg-purple-500", bg: "bg-purple-500/10", text: "text-purple-400" },
};

export default function BloomMasteryChart({ bloomMastery, t }: BloomMasteryChartProps) {
  const hasData = BLOOM_LEVELS.some((level) => (bloomMastery[level] ?? 0) > 0);
  if (!hasData) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/10">
          <Brain size={16} className="text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-white">
          {t("academic.bloom.title")}
        </h2>
      </div>

      <div className="space-y-4">
        {BLOOM_LEVELS.map((level) => {
          const rate = bloomMastery[level] ?? 0;
          const pct = Math.round(rate * 100);
          const colors = BLOOM_COLORS[level];

          return (
            <div key={level}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors.bar}`} />
                  <span className="text-sm text-slate-300">
                    {t(`academic.bloom.${level}`)}
                  </span>
                </div>
                <span className={`text-sm font-semibold ${colors.text}`}>
                  {pct}%
                </span>
              </div>
              <div className="w-full h-3 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors.bar} transition-all duration-1000 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bloom pyramid hint */}
      <div className="flex items-center justify-center mt-6 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5">
          {BLOOM_LEVELS.map((level) => {
            const colors = BLOOM_COLORS[level];
            return (
              <div
                key={level}
                className={`h-1.5 rounded-full ${colors.bar}`}
                style={{ width: `${12 + BLOOM_LEVELS.indexOf(level) * 4}px` }}
              />
            );
          })}
        </div>
        <span className="text-xs text-slate-500 ml-3">
          {t("academic.bloom.easy")} → {t("academic.bloom.hard")}
        </span>
      </div>
    </div>
  );
}
