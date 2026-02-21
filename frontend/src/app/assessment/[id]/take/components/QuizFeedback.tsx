"use client";

import { CheckCircle, XCircle } from "lucide-react";
import type { AnswerResult } from "../../../types/assessment";

interface QuizFeedbackProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  result: AnswerResult;
}

export default function QuizFeedback({ t, result }: QuizFeedbackProps) {
  return (
    <div
      className={`mt-6 rounded-xl border px-5 py-4 animate-slide-in-right ${
        result.is_correct
          ? "border-green-500/30 bg-green-500/10"
          : "border-red-500/30 bg-red-500/10"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        {result.is_correct ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-green-400">
              {t("assessment.quiz.correct")}
            </span>
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="font-semibold text-red-400">
              {t("assessment.quiz.incorrect")}
            </span>
          </>
        )}
      </div>

      {!result.is_correct && (
        <p className="text-sm text-slate-300">
          {t("assessment.quiz.correct_answer", {
            answer: result.correct_answer,
          })}
        </p>
      )}

      {result.explanation && (
        <p className="text-sm text-slate-400 mt-2">{result.explanation}</p>
      )}
    </div>
  );
}
