"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const SUBJECT_COLORS: Record<string, string> = {
  math: "#14b8a6",
  english: "#8b5cf6",
  physics: "#f59e0b",
  chemistry: "#ef4444",
  biology: "#22c55e",
  history: "#3b82f6",
  science: "#14b8a6",
};

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  new: { text: "text-red-400", bg: "bg-red-400/15" },
  reviewing: { text: "text-yellow-400", bg: "bg-yellow-400/15" },
  mastered: { text: "text-green-400", bg: "bg-green-400/15" },
  regressed: { text: "text-orange-400", bg: "bg-orange-400/15" },
};

interface MistakeEntry {
  id: number;
  question_id: number;
  subject: string;
  topic: string;
  subtopic?: string;
  difficulty: number;
  mastery_status: string;
  wrong_count: number;
  correct_after_wrong: number;
  bloom_level?: string;
  misconception_ids?: string[];
  question_stem_zh?: string;
  question_stem_en?: string;
  last_wrong_answer?: Record<string, unknown>;
  correct_answer?: unknown;
  explanation_zh?: string;
  explanation_en?: string;
}

interface MistakeListProps {
  entries: MistakeEntry[];
  t: (key: string) => string;
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < level ? "text-amber-400" : "text-slate-700"}
        >
          &#9733;
        </span>
      ))}
    </span>
  );
}

function formatAnswer(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return JSON.stringify(value, null, 2);
}

export default function MistakeList({ entries, t }: MistakeListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 text-center text-slate-500 text-sm">
        {t("mistakes.empty")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const isExpanded = expandedId === entry.id;
        const subjectColor = SUBJECT_COLORS[entry.subject] || "#14b8a6";
        const status = STATUS_COLORS[entry.mastery_status] || STATUS_COLORS.new;

        return (
          <div
            key={entry.id}
            className="rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden"
          >
            {/* Collapsed header */}
            <button
              type="button"
              onClick={() => toggle(entry.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors text-left"
            >
              {/* Subject badge */}
              <span
                className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  color: subjectColor,
                  backgroundColor: `${subjectColor}15`,
                }}
              >
                {t(`academic.subject.${entry.subject}`)}
              </span>

              {/* Topic */}
              <span className="min-w-0 flex-1 text-sm text-white truncate">
                {entry.topic}
                {entry.subtopic && (
                  <span className="text-slate-500 ml-1">
                    / {entry.subtopic}
                  </span>
                )}
              </span>

              {/* Difficulty */}
              <span className="shrink-0 text-xs">
                <DifficultyStars level={entry.difficulty} />
              </span>

              {/* Status badge */}
              <span
                className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${status.text} ${status.bg}`}
              >
                {t(`mistakes.status.${entry.mastery_status}`)}
              </span>

              {/* Wrong count */}
              <span className="shrink-0 text-xs text-slate-400">
                {entry.wrong_count}x
              </span>

              {/* Chevron */}
              {isExpanded ? (
                <ChevronDown size={16} className="shrink-0 text-slate-500" />
              ) : (
                <ChevronRight size={16} className="shrink-0 text-slate-500" />
              )}
            </button>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-white/[0.04] pt-4 space-y-4">
                {/* Question stem */}
                {entry.question_stem_zh && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      {t("mistakes.detail.question")}
                    </div>
                    <div className="text-sm text-slate-200 whitespace-pre-wrap">
                      {entry.question_stem_zh}
                    </div>
                  </div>
                )}

                {/* Answers row */}
                <div className="flex gap-6">
                  {/* Last wrong answer */}
                  {entry.last_wrong_answer !== undefined && (
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500 mb-1">
                        {t("mistakes.detail.wrong_answer")}
                      </div>
                      <div className="text-sm text-red-400 whitespace-pre-wrap bg-red-400/5 rounded-lg px-3 py-2">
                        {formatAnswer(entry.last_wrong_answer)}
                      </div>
                    </div>
                  )}

                  {/* Correct answer */}
                  {entry.correct_answer !== undefined && (
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500 mb-1">
                        {t("mistakes.detail.correct_answer")}
                      </div>
                      <div className="text-sm text-green-400 whitespace-pre-wrap bg-green-400/5 rounded-lg px-3 py-2">
                        {formatAnswer(entry.correct_answer)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Explanation */}
                {entry.explanation_zh && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      {t("mistakes.detail.explanation")}
                    </div>
                    <div className="text-sm text-slate-300 whitespace-pre-wrap bg-white/[0.02] rounded-lg px-3 py-2">
                      {entry.explanation_zh}
                    </div>
                  </div>
                )}

                {/* Bloom level / misconceptions */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  {entry.bloom_level && (
                    <span>
                      {t("mistakes.detail.bloom")}: {entry.bloom_level}
                    </span>
                  )}
                  {entry.misconception_ids && entry.misconception_ids.length > 0 && (
                    <span>
                      {t("mistakes.detail.misconceptions")}:{" "}
                      {entry.misconception_ids.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
