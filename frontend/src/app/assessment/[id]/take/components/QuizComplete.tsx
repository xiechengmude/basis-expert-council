"use client";

import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";

interface QuizCompleteProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  correctCount: number;
  totalAnswered: number;
  sessionId: string;
  reportId: string | null;
}

export default function QuizComplete({
  t,
  correctCount,
  totalAnswered,
  sessionId,
  reportId,
}: QuizCompleteProps) {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full text-center">
        {/* Trophy animation */}
        <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
          <Trophy className="w-10 h-10 text-brand-400" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">
          {t("assessment.quiz.complete_title")}
        </h2>

        <p className="text-lg text-slate-400 mb-8">
          {t("assessment.quiz.complete_score", {
            correct: correctCount,
            total: totalAnswered,
          })}
        </p>

        {/* Score ring */}
        <div className="relative w-32 h-32 mx-auto mb-8">
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
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - correctCount / Math.max(totalAnswered, 1))}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {totalAnswered > 0
                ? Math.round((correctCount / totalAnswered) * 100)
                : 0}
              %
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={`/assessment/${sessionId}/report${reportId ? `?report_id=${reportId}` : ""}`}
            className="w-full bg-brand-500 hover:bg-brand-400 text-white rounded-full px-8 py-3.5 font-semibold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-colors"
          >
            {t("assessment.quiz.view_report")}
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/assessment"
            className="w-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-full px-8 py-3.5 font-semibold transition-colors flex items-center justify-center"
          >
            {t("assessment.report.retake_btn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
