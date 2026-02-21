"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import ProgressBar from "@/app/components/ProgressBar";

const SUBJECT_COLORS: Record<string, string> = {
  math: "#14b8a6",
  english: "#8b5cf6",
  physics: "#f59e0b",
  chemistry: "#ef4444",
  biology: "#22c55e",
  history: "#3b82f6",
  science: "#14b8a6",
};

interface TopicData {
  topic: string;
  score_100: number;
  active_mistakes?: number;
}

interface SubjectData {
  subject: string;
  score_100: number;
  active_mistakes?: number;
  topics: TopicData[];
}

interface TopicProgressProps {
  subjects: SubjectData[];
  t: (key: string) => string;
}

export default function TopicProgress({ subjects, t }: TopicProgressProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (subjects.length > 0) init[subjects[0].subject] = true;
    return init;
  });

  const toggle = (subject: string) => {
    setExpanded((prev) => ({ ...prev, [subject]: !prev[subject] }));
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        {t("academic.progress.title")}
      </h2>

      <div className="space-y-4">
        {subjects.map((subject) => {
          const color = SUBJECT_COLORS[subject.subject] || "#14b8a6";
          const isExpanded = expanded[subject.subject] || false;
          const activeMistakes = subject.active_mistakes || 0;

          return (
            <div key={subject.subject} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {/* Subject header */}
              <button
                type="button"
                onClick={() => toggle(subject.subject)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-semibold text-white">
                    {t(`academic.subject.${subject.subject}`)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {subject.topics.length} {t("academic.progress.coverage")}
                  </span>
                  {activeMistakes > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 rounded-full px-2 py-0.5">
                      <AlertCircle size={10} />
                      {activeMistakes} {t("academic.progress.active_mistakes")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-teal-400">
                    {Math.round(subject.score_100)}
                  </span>
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-slate-500" />
                  ) : (
                    <ChevronRight size={16} className="text-slate-500" />
                  )}
                </div>
              </button>

              {/* Topic list */}
              {isExpanded && subject.topics.length > 0 && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/[0.04] pt-4">
                  {subject.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <ProgressBar
                          label={topic.topic}
                          value={topic.score_100}
                          size="sm"
                        />
                      </div>
                      {(topic.active_mistakes ?? 0) > 0 && (
                        <span className="shrink-0 text-xs text-red-400">
                          {topic.active_mistakes} {t("academic.progress.active_mistakes")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
