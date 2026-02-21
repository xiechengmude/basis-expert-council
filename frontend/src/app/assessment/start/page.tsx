"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Stethoscope,
  Zap,
  Loader2,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { getApiBaseUrl } from "@/lib/config";
import AssessmentNav from "../components/AssessmentNav";

const ASSESSMENT_TYPE_META: Record<
  string,
  { icon: typeof ClipboardList; color: string }
> = {
  pre_admission: { icon: ClipboardList, color: "text-teal-400" },
  diagnostic: { icon: Stethoscope, color: "text-blue-400" },
  quick: { icon: Zap, color: "text-amber-400" },
};

const GRADES = ["G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"];

const SUBJECTS_BY_TYPE: Record<string, string[]> = {
  pre_admission: ["math", "english", "academic_readiness"],
  diagnostic: ["math", "english", "physics", "chemistry", "biology", "history"],
  quick: ["math", "english", "physics", "chemistry", "biology"],
};

const CAMPUSES = [
  "shenzhen",
  "guangzhou",
  "hangzhou",
  "nanjing",
  "chengdu",
  "wuhan",
  "jinan",
  "other",
];

export default function AssessmentStartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const type = searchParams.get("type") || "diagnostic";
  const typeMeta = ASSESSMENT_TYPE_META[type] || ASSESSMENT_TYPE_META.diagnostic;
  const TypeIcon = typeMeta.icon;

  const [gradeLevel, setGradeLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [campus, setCampus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subjects = useMemo(
    () => SUBJECTS_BY_TYPE[type] || SUBJECTS_BY_TYPE.diagnostic,
    [type],
  );

  const canSubmit = gradeLevel && subject && !loading;

  async function handleStart() {
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/assessment/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          subject,
          grade_level: gradeLevel,
          ...(campus ? { campus } : {}),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      // Store first question for instant quiz load
      sessionStorage.setItem(
        `assessment_${data.session_id}_first_question`,
        JSON.stringify({
          first_question: data.first_question,
          total_estimated: data.total_estimated,
          time_limit_sec: data.time_limit_sec,
        }),
      );
      router.push(`/assessment/${data.session_id}/take`);
    } catch {
      setError(t("assessment.start_error"));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 scroll-smooth">
      <AssessmentNav t={t} />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            {t("assessment.start_back")}
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <TypeIcon className={`w-6 h-6 ${typeMeta.color}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t(`assessment.type.${type}`)}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {t("assessment.start_subtitle")}
              </p>
            </div>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
            {/* Grade select */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t("assessment.start_grade_label")}
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  {t("assessment.start_grade_placeholder")}
                </option>
                {GRADES.map((g) => (
                  <option key={g} value={g} className="bg-slate-900">
                    {t(`assessment.grade.${g}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject select */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t("assessment.start_subject_label")}
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  {t("assessment.start_subject_placeholder")}
                </option>
                {subjects.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">
                    {t(`assessment.subject.${s}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Campus select (optional) */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t("assessment.start_campus_label")}
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  {t("assessment.start_campus_placeholder")}
                </option>
                {CAMPUSES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900">
                    {t(`assessment.campus.${c}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleStart}
              disabled={!canSubmit}
              className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full px-8 py-3.5 font-semibold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t("assessment.start_loading")}
                </>
              ) : (
                <>
                  {t("assessment.start_btn")}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Info card */}
          <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-brand-400" />
              <h3 className="text-sm font-semibold text-white">
                {t("assessment.start_info_title")}
              </h3>
            </div>
            <ul className="space-y-3">
              {["adaptive", "no_penalty", "time"].map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-2 text-sm text-slate-400"
                >
                  <CheckCircle2
                    size={16}
                    className="text-brand-400 shrink-0 mt-0.5"
                  />
                  {t(`assessment.start_info_${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
