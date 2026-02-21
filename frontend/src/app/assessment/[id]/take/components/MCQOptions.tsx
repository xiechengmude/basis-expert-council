"use client";

import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { AnswerResult } from "../../../types/assessment";

interface MCQOptionsProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  options: string[];
  selectedAnswer: string | null;
  feedback: AnswerResult | null;
  showFeedback: boolean;
  onSelect: (answer: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

const LABELS = ["A", "B", "C", "D", "E", "F"];

export default function MCQOptions({
  t,
  options,
  selectedAnswer,
  feedback,
  showFeedback,
  onSelect,
  onSubmit,
  submitting,
}: MCQOptionsProps) {
  return (
    <div>
      <div className="space-y-3">
        {options.map((option, idx) => {
          const label = LABELS[idx];
          const isSelected = selectedAnswer === label;
          const isCorrect =
            showFeedback && feedback?.correct_answer === label;
          const isWrong = showFeedback && isSelected && !feedback?.is_correct;

          let borderClass = "border-white/10 hover:border-white/20";
          let bgClass = "bg-white/[0.03] hover:bg-white/[0.06]";
          let ringClass = "";

          if (isCorrect) {
            borderClass = "border-green-500/50";
            bgClass = "bg-green-500/10";
            ringClass = "animate-ring-pulse-green";
          } else if (isWrong) {
            borderClass = "border-red-500/50";
            bgClass = "bg-red-500/10";
            ringClass = "animate-ring-pulse-red";
          } else if (isSelected && !showFeedback) {
            borderClass = "border-brand-500/50";
            bgClass = "bg-brand-500/10";
          }

          return (
            <button
              key={label}
              onClick={() => !showFeedback && !submitting && onSelect(label)}
              disabled={showFeedback || submitting}
              className={`w-full text-left rounded-xl border ${borderClass} ${bgClass} ${ringClass} px-5 py-4 transition-all duration-200 flex items-center gap-4 group disabled:cursor-default`}
            >
              <span
                className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${
                  isSelected
                    ? "border-brand-500 text-brand-400 bg-brand-500/10"
                    : "border-white/20 text-slate-400 group-hover:border-white/40"
                }`}
              >
                {label}
              </span>
              <span
                className="text-slate-200 text-base flex-1"
                dangerouslySetInnerHTML={{
                  __html: option.replace(
                    /\$([^$]+)\$/g,
                    '<code class="text-brand-400 font-mono">$1</code>',
                  ),
                }}
              />
              {isCorrect && (
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              )}
              {isWrong && (
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Submit button */}
      {!showFeedback && (
        <button
          onClick={onSubmit}
          disabled={!selectedAnswer || submitting}
          className="mt-6 w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full px-8 py-3.5 font-semibold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-colors"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {t("assessment.quiz.submitting")}
            </>
          ) : (
            t("assessment.quiz.submit_answer")
          )}
        </button>
      )}
    </div>
  );
}
