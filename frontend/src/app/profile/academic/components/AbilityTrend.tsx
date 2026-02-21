"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const SUBJECT_COLORS: Record<string, string> = {
  math: "#14b8a6",
  english: "#8b5cf6",
  physics: "#f59e0b",
  chemistry: "#ef4444",
  biology: "#22c55e",
  history: "#3b82f6",
  science: "#14b8a6",
};

interface HistoryPoint {
  subject: string;
  topic: string | null;
  score_100: number;
  recorded_at: string;
}

interface AbilityTrendProps {
  history: HistoryPoint[];
  t: (key: string) => string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function AbilityTrend({ history, t }: AbilityTrendProps) {
  // Only use subject-level points (topic = null)
  const subjectHistory = useMemo(
    () => history.filter((h) => h.topic === null),
    [history],
  );

  const subjects = useMemo(
    () => [...new Set(subjectHistory.map((h) => h.subject))],
    [subjectHistory],
  );

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Build chart data: group by recorded_at date, one key per subject
  const chartData = useMemo(() => {
    const filtered = selectedSubject
      ? subjectHistory.filter((h) => h.subject === selectedSubject)
      : subjectHistory;

    // Group by date string
    const dateMap: Record<string, Record<string, number>> = {};
    for (const point of filtered) {
      const dateKey = formatDate(point.recorded_at);
      if (!dateMap[dateKey]) dateMap[dateKey] = {};
      dateMap[dateKey][point.subject] = point.score_100;
    }

    return Object.entries(dateMap)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [subjectHistory, selectedSubject]);

  const displaySubjects = selectedSubject ? [selectedSubject] : subjects;

  if (subjectHistory.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {t("academic.trend.title")}
        </h2>

        {/* Subject filter */}
        <select
          value={selectedSubject || ""}
          onChange={(e) => setSelectedSubject(e.target.value || null)}
          className="bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="">{t("academic.trend.all_subjects")}</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {t(`academic.subject.${s}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="date"
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
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: 12,
              }}
            />
            {displaySubjects.length > 1 && (
              <Legend
                wrapperStyle={{ color: "#94a3b8", fontSize: 12 }}
              />
            )}
            {displaySubjects.map((subject) => (
              <Line
                key={subject}
                type="monotone"
                dataKey={subject}
                name={t(`academic.subject.${subject}`)}
                stroke={SUBJECT_COLORS[subject] || "#14b8a6"}
                strokeWidth={2}
                dot={{ r: 3, fill: SUBJECT_COLORS[subject] || "#14b8a6", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
