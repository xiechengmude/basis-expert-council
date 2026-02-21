"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface GapAnalysisProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  topicScores: Record<
    string,
    { correct: number; total: number; accuracy: number }
  >;
  targetLevel?: number;
}

export default function GapAnalysis({
  t,
  topicScores,
  targetLevel = 80,
}: GapAnalysisProps) {
  const data = Object.entries(topicScores).map(([topic, scores]) => ({
    topic,
    current: Math.round(scores.accuracy),
    target: targetLevel,
    gap: Math.max(0, targetLevel - Math.round(scores.accuracy)),
  }));

  if (data.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-2">
        {t("assessment.report.gap_title")}
      </h2>
      <div className="flex items-center gap-6 text-xs text-slate-500 mb-6">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-teal-500" />
          {t("assessment.report.gap_current")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-slate-500" />
          {t("assessment.report.gap_target")}
        </span>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="topic"
              width={100}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="current" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={
                    entry.current >= targetLevel
                      ? "rgba(20,184,166,0.8)"
                      : entry.current >= 60
                        ? "rgba(234,179,8,0.8)"
                        : "rgba(239,68,68,0.6)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
