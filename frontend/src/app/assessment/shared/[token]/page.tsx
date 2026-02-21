"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  Target,
  TrendingUp,
  TrendingDown,
  Check,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { getApiBaseUrl } from "@/lib/config";
import RadarChart from "../../components/RadarChart";
import AssessmentNav from "../../components/AssessmentNav";

interface SharedReportData {
  overall_score: number;
  level: string;
  level_key: string;
  grade_alignment: string;
  dimensions: { name: string; score: number }[];
  topics: { topic: string; mastery: number }[];
  recommendations: string[];
  summary_zh: string;
  strong_topics?: string[];
  weak_topics?: string[];
}

export default function SharedReportPage() {
  const params = useParams();
  const { t } = useI18n();
  const token = params.token as string;

  const [report, setReport] = useState<SharedReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    async function fetchShared() {
      try {
        const apiBase = getApiBaseUrl();
        const res = await fetch(`${apiBase}/api/assessment/shared/${token}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: SharedReportData = await res.json();
        setReport(data);
      } catch {
        setError(t("assessment.report.error"));
      } finally {
        setLoading(false);
      }
    }
    fetchShared();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Score animation
  useEffect(() => {
    if (!report) return;
    const target = report.overall_score;
    const duration = 1500;
    const startTime = Date.now();
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [report]);

  function getLevelColor(levelKey: string) {
    switch (levelKey) {
      case "advanced":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "above":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "at":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "approaching":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-red-400 bg-red-500/10 border-red-500/20";
    }
  }

  function getMasteryColor(mastery: number) {
    if (mastery >= 80) return "bg-green-500";
    if (mastery >= 60) return "bg-yellow-500";
    if (mastery >= 40) return "bg-orange-500";
    return "bg-red-500";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-400 mb-4">
            {error || t("assessment.report.error")}
          </p>
          <Link
            href="/assessment"
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            {t("assessment.hero_cta")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AssessmentNav t={t} />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score Header */}
          <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-8 mb-8 text-center">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              {t("assessment.report.score_title")}
            </p>
            <div className="text-7xl md:text-8xl font-bold text-white mb-4">
              {animatedScore}
            </div>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getLevelColor(report.level_key)}`}
            >
              <Target size={16} />
              {t(`assessment.level.${report.level_key}`)}
            </div>
            {report.grade_alignment && (
              <p className="mt-4 text-slate-400">
                {t("assessment.report.grade_eq")}: {report.grade_alignment}
              </p>
            )}
          </div>

          {/* Summary */}
          {report.summary_zh && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">
                {t("assessment.report.analysis_title")}
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {report.summary_zh}
              </p>
            </div>
          )}

          {/* Radar chart + Topics */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {report.dimensions.length >= 3 && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
                <h2 className="text-xl font-bold text-white mb-6">
                  {t("assessment.report.radar_title")}
                </h2>
                <RadarChart
                  dimensions={report.dimensions.map((d) => ({
                    label: d.name,
                    value: d.score,
                  }))}
                />
              </div>
            )}

            <div className="space-y-8">
              {report.strong_topics && report.strong_topics.length > 0 && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-400" />
                    {t("assessment.report.strong_topics")}
                  </h3>
                  <div className="space-y-2">
                    {report.strong_topics.map((topic, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-green-300 bg-green-500/10 rounded-lg px-3 py-2"
                      >
                        <Check size={14} />
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {report.weak_topics && report.weak_topics.length > 0 && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingDown size={18} className="text-red-400" />
                    {t("assessment.report.weak_topics")}
                  </h3>
                  <div className="space-y-2">
                    {report.weak_topics.map((topic, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 rounded-lg px-3 py-2"
                      >
                        <Target size={14} />
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Topic mastery bars */}
          {report.topics.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">
                {t("assessment.report.heatmap_title")}
              </h2>
              <div className="space-y-4">
                {report.topics.map((topic, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">
                        {topic.topic}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          topic.mastery >= 80
                            ? "text-green-400"
                            : topic.mastery >= 60
                              ? "text-yellow-400"
                              : topic.mastery >= 40
                                ? "text-orange-400"
                                : "text-red-400"
                        }`}
                      >
                        {topic.mastery}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${getMasteryColor(topic.mastery)}`}
                        style={{ width: `${topic.mastery}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA: Take your own assessment */}
          <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-brand-500/5 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-3">
              {t("assessment.report.share_btn")}
            </h2>
            <Link
              href="/assessment"
              className="mt-4 inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white rounded-full px-8 py-3.5 font-semibold shadow-lg shadow-brand-500/25 transition-colors"
            >
              {t("assessment.hero_cta")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
