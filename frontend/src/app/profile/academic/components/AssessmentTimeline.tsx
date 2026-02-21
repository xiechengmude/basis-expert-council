"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SUBJECT_COLORS: Record<string, string> = {
  math: "#14b8a6",
  english: "#8b5cf6",
  physics: "#f59e0b",
  chemistry: "#ef4444",
  biology: "#22c55e",
  history: "#3b82f6",
  science: "#14b8a6",
};

interface SessionItem {
  id: string;
  subject: string;
  final_score: number | null;
  ability_level: number | null;
  assessment_type: string;
  completed_at: string | null;
}

interface AssessmentTimelineProps {
  sessions: SessionItem[];
  t: (key: string) => string;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric" });
}

function getAssessmentTypeKey(type: string): string {
  const map: Record<string, string> = {
    pre_admission: "academic.type.pre_admission",
    subject_diagnostic: "academic.type.subject_diagnostic",
    quick: "academic.type.quick",
  };
  return map[type] || type;
}

export default function AssessmentTimeline({ sessions, t }: AssessmentTimelineProps) {
  if (!sessions || sessions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        {t("academic.timeline.title")}
      </h2>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/[0.06]" />

        <div className="space-y-6">
          {sessions.map((session, idx) => {
            const color = SUBJECT_COLORS[session.subject] || "#14b8a6";
            return (
              <div key={idx} className="relative pl-14">
                {/* Timeline dot */}
                <div
                  className="absolute left-3 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: color, backgroundColor: `${color}20` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ color, backgroundColor: `${color}15` }}
                      >
                        {t(`academic.subject.${session.subject}`)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {t(getAssessmentTypeKey(session.assessment_type))}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.final_score !== null && (
                        <span className="text-lg font-bold text-white">
                          {Math.round(session.final_score)}
                          <span className="text-xs text-slate-500 ml-0.5">/100</span>
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        {formatDate(session.completed_at)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/assessment/${session.id}/report`}
                    className="shrink-0 inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    {t("academic.timeline.view_report")}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
