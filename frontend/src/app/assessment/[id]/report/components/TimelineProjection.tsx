"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TimelineProjectionProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  currentScore: number;
}

export default function TimelineProjection({
  t,
  currentScore,
}: TimelineProjectionProps) {
  // Project 6-month growth curves
  const months = ["Now", "M1", "M2", "M3", "M4", "M5", "M6"];
  const data = months.map((month, i) => {
    const withPilot = Math.min(
      100,
      currentScore + (100 - currentScore) * (1 - Math.pow(0.7, i)),
    );
    const selfStudy = Math.min(
      100,
      currentScore + (100 - currentScore) * (1 - Math.pow(0.92, i)),
    );
    return {
      month,
      withPilot: Math.round(withPilot),
      selfStudy: Math.round(selfStudy),
    };
  });

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        {t("assessment.report.timeline_title")}
      </h2>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="pilotGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="selfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#64748b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Legend
              formatter={(value: string) =>
                value === "withPilot"
                  ? t("assessment.report.timeline_with")
                  : t("assessment.report.timeline_without")
              }
              wrapperStyle={{ color: "#94a3b8", fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="withPilot"
              stroke="#14b8a6"
              strokeWidth={2}
              fill="url(#pilotGrad)"
            />
            <Area
              type="monotone"
              dataKey="selfStudy"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#selfGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
