"use client";

import { Clock } from "lucide-react";

interface QuizHeaderProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  currentQuestion: number;
  totalQuestions: number;
  elapsedSec: number;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QuizHeader({
  t,
  currentQuestion,
  totalQuestions,
  elapsedSec,
}: QuizHeaderProps) {
  const progressPercent = Math.min(
    (currentQuestion / totalQuestions) * 100,
    100,
  );
  const remaining = totalQuestions - currentQuestion;

  return (
    <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-white/[0.06] -mx-4 px-4 py-3 mb-6">
      {/* Progress bar */}
      <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300 font-medium">
          {t("assessment.quiz.progress", {
            current: currentQuestion,
            total: totalQuestions,
          })}
        </span>

        {remaining <= 2 && remaining >= 0 && (
          <span className="text-brand-400 font-medium animate-pulse">
            {t("assessment.quiz.finishing")}
          </span>
        )}

        <span className="text-slate-500 flex items-center gap-1.5">
          <Clock size={14} />
          {formatTime(elapsedSec)}
        </span>
      </div>
    </div>
  );
}
