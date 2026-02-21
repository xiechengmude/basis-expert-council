"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ReportGeneratingProps {
  t: (key: string, params?: Record<string, string | number>) => string;
}

const TIPS_EN = [
  "Each question is calibrated using Item Response Theory (IRT).",
  "Our adaptive algorithm adjusts difficulty in real-time for precision.",
  "BasisPilot's question bank covers the complete BASIS curriculum.",
  "Your report includes personalized study recommendations.",
  "Over 10,000 students have used BasisPilot assessments.",
];

const TIPS_ZH = [
  "每道题都基于项目反应理论 (IRT) 精准校准。",
  "自适应算法实时调整题目难度，确保测量精度。",
  "BasisPilot 题库覆盖 BASIS 全年级课程。",
  "报告包含个性化学习建议和提升路径。",
  "已有超过 10,000 名学生使用 BasisPilot 测评。",
];

export default function ReportGenerating({ t }: ReportGeneratingProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const tips = t("assessment.nav_brand") === "BasisPilot" ? TIPS_EN : TIPS_ZH;

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated progress circle */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: "3s" }}>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="80 180"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          {t("assessment.report.generating_title")}
        </h2>
        <p className="text-sm text-slate-500 mb-8">
          {t("assessment.report.generating_tip")}
        </p>

        {/* Rotating tips */}
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-6 py-4">
          <p className="text-sm text-slate-400 transition-all duration-500">
            {tips[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
