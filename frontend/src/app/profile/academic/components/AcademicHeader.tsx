"use client";

import { RefreshCw } from "lucide-react";
import ScoreRing from "@/app/components/ScoreRing";

interface StudentInfo {
  id: number;
  nickname: string | null;
  grade: string | null;
  school_name: string | null;
  campus: string | null;
}

interface SubjectData {
  subject: string;
  score_100: number;
  assessment_count?: number;
}

interface KpiData {
  mastery_rate?: number;
}

interface AcademicHeaderProps {
  student: StudentInfo;
  subjects: SubjectData[];
  totalAssessments: number;
  kpi?: KpiData;
  computedAt?: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  t: (key: string) => string;
}

function getOverallScore(subjects: SubjectData[]): number {
  if (subjects.length === 0) return 0;
  const total = subjects.reduce((sum, s) => sum + s.score_100, 0);
  return Math.round(total / subjects.length);
}

function getAbilityLevel(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  return "C";
}

function getLevelColor(score: number): string {
  if (score >= 80) return "border-green-500/30 text-green-400 bg-green-500/10";
  if (score >= 60) return "border-yellow-500/30 text-yellow-400 bg-yellow-500/10";
  return "border-red-500/30 text-red-400 bg-red-500/10";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AcademicHeader({
  student,
  subjects,
  totalAssessments,
  kpi,
  computedAt,
  onRefresh,
  refreshing,
  t,
}: AcademicHeaderProps) {
  const overall = getOverallScore(subjects);
  const level = getAbilityLevel(overall);
  const masteryRate = kpi?.mastery_rate ?? 0;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-8 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Double ring: overall score + mastery rate */}
        <div className="relative flex items-center gap-4">
          <ScoreRing score={overall} size={140} />
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="6"
                />
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${masteryRate * 2.136} 213.6`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-green-400">{Math.round(masteryRate)}%</span>
              </div>
            </div>
            <span className="text-xs text-slate-500 mt-1">{t("academic.header.mastery_rate")}</span>
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl font-bold text-white mb-1">
            {student.nickname || t("academic.title")}
          </h1>
          {student.school_name && (
            <p className="text-sm text-slate-400 mb-2">{student.school_name}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${getLevelColor(overall)}`}
            >
              {t("academic.header.ability_level")}: {level}
            </span>
            <span className="text-sm text-slate-500">
              {totalAssessments} {t("academic.header.assessments_completed")}
            </span>
          </div>

          {/* Last updated + refresh */}
          <div className="flex items-center gap-3 mt-3">
            {computedAt && (
              <span className="text-xs text-slate-500">
                {t("academic.header.last_updated")}: {formatDate(computedAt)}
              </span>
            )}
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? t("academic.header.refreshing") : t("academic.header.refresh")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
