"use client";

import type { AssessmentQuestion } from "../../../types/assessment";

interface QuestionCardProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  question: AssessmentQuestion;
}

export default function QuestionCard({ t, question }: QuestionCardProps) {
  const difficultyKey = `assessment.quiz.${question.difficulty_label}`;

  return (
    <div className="mb-8">
      {/* Topic + difficulty badges */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center rounded-full bg-white/[0.06] border border-white/10 px-3 py-1 text-xs text-slate-400">
          {question.topic}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${
            question.difficulty_label === "easy"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : question.difficulty_label === "hard"
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          {t(difficultyKey)}
        </span>
      </div>

      {/* Question stem */}
      <p
        className="text-xl md:text-2xl font-medium text-white leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderLatex(question.stem) }}
      />
    </div>
  );
}

/**
 * Simple LaTeX renderer: wraps $...$ in KaTeX-compatible spans.
 * For MVP, just display the LaTeX notation plainly if KaTeX isn't loaded.
 */
function renderLatex(text: string): string {
  return text.replace(
    /\$([^$]+)\$/g,
    '<code class="text-brand-400 font-mono">$1</code>',
  );
}
