"use client";

import { useState, useMemo } from "react";
import { Activity } from "lucide-react";

interface DayData {
  questions: number;
  correct: number;
  messages: number;
}

interface ActivityHeatmapProps {
  data: Record<string, DayData>;
  t: (key: string) => string;
}

function getColorIntensity(count: number, max: number): string {
  if (count === 0) return "rgba(255,255,255,0.03)";
  const ratio = Math.min(count / Math.max(max, 1), 1);
  if (ratio <= 0.25) return "rgba(20,184,166,0.2)";
  if (ratio <= 0.5) return "rgba(20,184,166,0.4)";
  if (ratio <= 0.75) return "rgba(20,184,166,0.6)";
  return "rgba(20,184,166,0.85)";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export default function ActivityHeatmap({ data, t }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    date: string;
    info: DayData;
  } | null>(null);

  const { grid, maxCount, weeks } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Go back 90 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 89);

    // Align to the previous Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const cells: Array<{
      date: string;
      dayData: DayData;
      row: number;
      col: number;
      isInRange: boolean;
    }> = [];

    let maxQ = 0;
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89);

    let weekIdx = 0;
    const cursor = new Date(startDate);

    while (cursor <= today) {
      const dow = cursor.getDay(); // 0=Sun
      const dateKey = cursor.toISOString().split("T")[0];
      const dayData = data[dateKey] || { questions: 0, correct: 0, messages: 0 };
      const isInRange = cursor >= ninetyDaysAgo && cursor <= today;

      if (isInRange && dayData.questions > maxQ) maxQ = dayData.questions;

      cells.push({
        date: dateKey,
        dayData,
        row: dow,
        col: weekIdx,
        isInRange,
      });

      // Advance day
      cursor.setDate(cursor.getDate() + 1);
      if (cursor.getDay() === 0 && cursor <= today) {
        weekIdx++;
      }
    }

    return { grid: cells, maxCount: maxQ, weeks: weekIdx + 1 };
  }, [data]);

  const cellSize = 14;
  const gap = 3;
  const labelWidth = 24;
  const svgWidth = labelWidth + weeks * (cellSize + gap);
  const svgHeight = 7 * (cellSize + gap);

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/10">
          <Activity size={16} className="text-teal-400" />
        </div>
        <h2 className="text-xl font-bold text-white">
          {t("academic.activity.title")}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight + 20}
          viewBox={`0 0 ${svgWidth} ${svgHeight + 20}`}
          className="block"
        >
          {/* Day of week labels */}
          {dayLabels.map((label, i) => (
            <text
              key={i}
              x={0}
              y={i * (cellSize + gap) + cellSize / 2 + 1}
              className="fill-slate-500"
              fontSize={9}
              dominantBaseline="middle"
            >
              {label}
            </text>
          ))}

          {/* Heatmap cells */}
          {grid.map((cell, i) => {
            if (!cell.isInRange) return null;
            const x = labelWidth + cell.col * (cellSize + gap);
            const y = cell.row * (cellSize + gap);
            const color = getColorIntensity(cell.dayData.questions, maxCount);

            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={3}
                fill={color}
                className="cursor-pointer transition-opacity hover:opacity-80"
                onMouseEnter={(e) => {
                  const rect = (e.target as SVGRectElement).getBoundingClientRect();
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    date: cell.date,
                    info: cell.dayData,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3">
        <span className="text-xs text-slate-500">{t("academic.activity.less")}</span>
        {[0, 0.25, 0.5, 0.75, 1].map((level, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: getColorIntensity(
                level * Math.max(maxCount, 1),
                Math.max(maxCount, 1)
              ),
            }}
          />
        ))}
        <span className="text-xs text-slate-500">{t("academic.activity.more")}</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 rounded-lg bg-slate-800 border border-white/[0.1] shadow-xl pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="text-xs font-medium text-white mb-1">
            {formatDate(tooltip.date)}
          </p>
          <p className="text-xs text-slate-400">
            {t("academic.activity.questions")}: {tooltip.info.questions}
          </p>
          <p className="text-xs text-slate-400">
            {t("academic.activity.correct")}: {tooltip.info.correct}
          </p>
          <p className="text-xs text-slate-400">
            {t("academic.activity.messages")}: {tooltip.info.messages}
          </p>
        </div>
      )}
    </div>
  );
}
