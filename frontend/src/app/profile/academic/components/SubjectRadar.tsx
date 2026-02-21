"use client";

interface SubjectData {
  subject: string;
  score_100: number;
}

interface SubjectRadarProps {
  subjects: SubjectData[];
  t: (key: string) => string;
}

const SUBJECT_COLORS: Record<string, string> = {
  math: "#14b8a6",
  english: "#8b5cf6",
  physics: "#f59e0b",
  chemistry: "#ef4444",
  biology: "#22c55e",
  history: "#3b82f6",
  science: "#14b8a6",
};

export default function SubjectRadar({ subjects, t }: SubjectRadarProps) {
  if (subjects.length < 3) {
    // Fallback: bar display for < 3 subjects
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {t("academic.radar.title")}
        </h2>
        <div className="space-y-4">
          {subjects.map((s, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">
                  {t(`academic.subject.${s.subject}`)}
                </span>
                <span className="text-sm font-medium text-teal-400">
                  {Math.round(s.score_100)}
                </span>
              </div>
              <div className="w-full h-3 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-1000 ease-out"
                  style={{ width: `${s.score_100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 40;
  const levels = 5;
  const n = subjects.length;

  function getPoint(index: number, r: number) {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  // Grid polygons
  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const r = (radius * (level + 1)) / levels;
    return Array.from({ length: n }, (_, i) => {
      const p = getPoint(i, r);
      return `${p.x},${p.y}`;
    }).join(" ");
  });

  // Axis lines
  const axisLines = Array.from({ length: n }, (_, i) => getPoint(i, radius));

  // Data polygon (my scores)
  const dataPoints = subjects.map((s, i) => getPoint(i, (s.score_100 / 100) * radius));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Average polygon (placeholder at 60%)
  const avgPoints = subjects.map((_, i) => getPoint(i, 0.6 * radius));
  const avgPolygon = avgPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Labels
  const labels = subjects.map((s, i) => {
    const p = getPoint(i, radius + 28);
    return { ...s, x: p.x, y: p.y };
  });

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        {t("academic.radar.title")}
      </h2>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        {/* Grid polygons */}
        {gridPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((p, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Average polygon (dashed, gray) */}
        <polygon
          points={avgPolygon}
          fill="rgba(148,163,184,0.05)"
          stroke="rgba(148,163,184,0.3)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />

        {/* Data polygon (teal) */}
        <polygon
          points={dataPolygon}
          fill="rgba(20,184,166,0.15)"
          stroke="rgba(20,184,166,0.8)"
          strokeWidth={2}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={SUBJECT_COLORS[subjects[i].subject] || "#14b8a6"}
            stroke="#0f172a"
            strokeWidth={2}
          />
        ))}

        {/* Labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-400 text-xs"
            fontSize={11}
          >
            {t(`academic.subject.${label.subject}`)}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-teal-500 rounded" />
          <span className="text-xs text-slate-400">{t("academic.radar.my_score")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 border-t border-dashed border-slate-500" />
          <span className="text-xs text-slate-400">{t("academic.radar.average")}</span>
        </div>
      </div>
    </div>
  );
}
