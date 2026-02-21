"use client";

import { useMemo } from "react";

const STATUS_FILL: Record<string, string> = {
  new: "#f87171",       // red-400
  reviewing: "#facc15",  // yellow-400
  mastered: "#4ade80",   // green-400
  regressed: "#fb923c",  // orange-400
};

const STATUS_ORDER = ["new", "reviewing", "regressed", "mastered"];

interface MistakeByTopicChartProps {
  entries: Array<{
    subject: string;
    topic: string;
    mastery_status: string;
  }>;
  t: (key: string) => string;
}

interface TopicRow {
  topic: string;
  total: number;
  segments: Array<{ status: string; count: number }>;
}

export default function MistakeByTopicChart({
  entries,
  t,
}: MistakeByTopicChartProps) {
  const rows: TopicRow[] = useMemo(() => {
    // Aggregate by topic
    const topicMap: Record<string, Record<string, number>> = {};
    for (const entry of entries) {
      if (!topicMap[entry.topic]) topicMap[entry.topic] = {};
      const statusKey = entry.mastery_status || "new";
      topicMap[entry.topic][statusKey] =
        (topicMap[entry.topic][statusKey] || 0) + 1;
    }

    // Build row objects
    const result: TopicRow[] = Object.entries(topicMap).map(
      ([topic, statusCounts]) => {
        const segments = STATUS_ORDER.filter((s) => statusCounts[s])
          .map((s) => ({ status: s, count: statusCounts[s] }));
        const total = segments.reduce((sum, seg) => sum + seg.count, 0);
        return { topic, total, segments };
      },
    );

    // Sort by total desc, take top 10
    result.sort((a, b) => b.total - a.total);
    return result.slice(0, 10);
  }, [entries]);

  if (rows.length === 0) return null;

  const maxTotal = Math.max(...rows.map((r) => r.total));
  const barHeight = 24;
  const labelWidth = 140;
  const countWidth = 40;
  const chartPadding = 16;
  const rowGap = 8;
  const chartWidth = 500;
  const barAreaWidth = chartWidth - labelWidth - countWidth - chartPadding;
  const svgHeight = rows.length * (barHeight + rowGap) - rowGap + chartPadding * 2;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-4">
        {t("mistakes.chart.title")}
      </h2>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: STATUS_FILL[status] }}
            />
            <span className="text-xs text-slate-400">
              {t(`mistakes.status.${status}`)}
            </span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg
          width="100%"
          viewBox={`0 0 ${chartWidth} ${svgHeight}`}
          className="min-w-[400px]"
        >
          {rows.map((row, idx) => {
            const y = chartPadding + idx * (barHeight + rowGap);
            let xOffset = labelWidth;

            return (
              <g key={row.topic}>
                {/* Topic label */}
                <text
                  x={labelWidth - 8}
                  y={y + barHeight / 2}
                  textAnchor="end"
                  dominantBaseline="central"
                  className="fill-slate-400"
                  fontSize={11}
                >
                  {row.topic.length > 16
                    ? row.topic.slice(0, 15) + "..."
                    : row.topic}
                </text>

                {/* Stacked bar segments */}
                {row.segments.map((seg) => {
                  const segWidth =
                    maxTotal > 0
                      ? (seg.count / maxTotal) * barAreaWidth
                      : 0;
                  const rect = (
                    <rect
                      key={seg.status}
                      x={xOffset}
                      y={y}
                      width={Math.max(segWidth, 0)}
                      height={barHeight}
                      rx={4}
                      ry={4}
                      fill={STATUS_FILL[seg.status] || STATUS_FILL.new}
                      opacity={0.85}
                    />
                  );
                  xOffset += segWidth;
                  return rect;
                })}

                {/* Total count */}
                <text
                  x={xOffset + 8}
                  y={y + barHeight / 2}
                  dominantBaseline="central"
                  className="fill-slate-500"
                  fontSize={11}
                >
                  {row.total}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
