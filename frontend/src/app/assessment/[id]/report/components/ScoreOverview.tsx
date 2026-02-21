"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";

interface ScoreOverviewProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  score: number;
  percentile?: number;
  gradeEquivalent?: string;
  levelKey: string;
}

function getLevelColor(levelKey: string) {
  switch (levelKey) {
    case "advanced":
      return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    case "above":
      return "text-green-400 bg-green-500/10 border-green-500/20";
    case "at":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "approaching":
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    default:
      return "text-red-400 bg-red-500/10 border-red-500/20";
  }
}

export default function ScoreOverview({
  t,
  score,
  percentile,
  gradeEquivalent,
  levelKey,
}: ScoreOverviewProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(100);

  const circumference = 2 * Math.PI * 52;
  const targetOffset = ((100 - score) / 100) * circumference;

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      setAnimatedOffset(circumference - (circumference - targetOffset) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [score, circumference, targetOffset]);

  return (
    <div className="text-center">
      {/* Score Ring */}
      <div className="relative w-40 h-40 mx-auto mb-6">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            className="transition-none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{animatedScore}</span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>

      {/* Level badge */}
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getLevelColor(levelKey)}`}
      >
        <Target size={16} />
        {t(`assessment.level.${levelKey}`)}
      </div>

      {/* Percentile */}
      {percentile !== undefined && (
        <p className="mt-3 text-sm text-slate-500">
          {t("assessment.report.percentile", { pct: percentile })}
        </p>
      )}

      {/* Grade equivalent */}
      {gradeEquivalent && (
        <p className="mt-2 text-sm text-slate-400">
          {t("assessment.report.grade_eq")}: {gradeEquivalent}
        </p>
      )}
    </div>
  );
}
