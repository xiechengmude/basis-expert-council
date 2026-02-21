"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  Share2,
  RotateCcw,
  Check,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  CheckCircle,
  BarChart3,
  Timer,
  Download,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { getApiBaseUrl } from "@/lib/config";
import RadarChart from "../../components/RadarChart";
import AssessmentNav from "../../components/AssessmentNav";
import GapAnalysis from "./components/GapAnalysis";
import TimelineProjection from "./components/TimelineProjection";
import LearningPath from "./components/LearningPath";
import ServiceRecommendations from "./components/ServiceRecommendations";
import PdfExportButton from "./components/PdfExportButton";
import ReportGenerating from "./components/ReportGenerating";
import type { StudyPlanItem } from "../../types/assessment";

interface ReportDimension {
  name: string;
  score: number;
}

interface TopicMastery {
  topic: string;
  mastery: number;
}

interface ReportData {
  session_id: string;
  report_id: string;
  overall_score: number;
  level: string;
  level_key: string;
  grade_alignment: string;
  percentile?: number;
  dimensions: ReportDimension[];
  topics: TopicMastery[];
  recommendations: string[];
  summary_zh: string;
  strong_topics?: string[];
  weak_topics?: string[];
  stats?: {
    total_questions: number;
    correct_count: number;
    accuracy: number;
    total_time_sec: number;
    avg_time_sec: number;
  };
  topic_scores?: Record<
    string,
    { correct: number; total: number; accuracy: number }
  >;
  study_plan?: StudyPlanItem[];
  share_token?: string;
  status?: "generating" | "ready" | "failed";
}

export default function ReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const sessionId = params.id as string;
  const reportId = searchParams.get("report_id");

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [copied, setCopied] = useState(false);

  const fetchReport = useCallback(async () => {
    try {
      const apiBase = getApiBaseUrl();
      const endpoint = reportId
        ? `${apiBase}/api/assessment/report/${reportId}`
        : `${apiBase}/api/assessment/${sessionId}/report`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ReportData = await res.json();
      setReport(data);

      // Keep polling if still generating
      if (data.status === "generating") {
        setTimeout(fetchReport, 2000);
        return;
      }
    } catch {
      setError(t("assessment.report.error"));
    } finally {
      setLoading(false);
    }
  }, [sessionId, reportId, t]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Animated score count-up
  useEffect(() => {
    if (!report || report.status === "generating") return;
    const target = report.overall_score;
    const duration = 1500;
    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [report]);

  const handleShare = useCallback(async () => {
    if (!report) return;
    const shareUrl = report.share_token
      ? `${window.location.origin}/assessment/shared/${report.share_token}`
      : window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [report]);

  function getMasteryColor(mastery: number) {
    if (mastery >= 80) return "bg-green-500";
    if (mastery >= 60) return "bg-yellow-500";
    if (mastery >= 40) return "bg-orange-500";
    return "bg-red-500";
  }

  function getMasteryBg(idx: number) {
    const values = [100, 80, 60, 40, 20];
    const v = values[idx] ?? 20;
    if (v >= 80) return "bg-green-500/10";
    if (v >= 60) return "bg-yellow-500/10";
    if (v >= 40) return "bg-orange-500/10";
    return "bg-red-500/10";
  }

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

  // Generating state — animated wait screen
  if (loading || report?.status === "generating") {
    return <ReportGenerating t={t} />;
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
            {t("assessment.report.retake_btn")}
          </Link>
        </div>
      </div>
    );
  }

  // Build topicScores from topics array if not provided by API
  const topicScores = report.topic_scores ??
    Object.fromEntries(
      report.topics.map((tp) => [
        tp.topic,
        { correct: 0, total: 0, accuracy: tp.mastery },
      ]),
    );

  return (
    <div className="min-h-screen bg-slate-950">
      <AssessmentNav t={t} />

      <div id="report-content" className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score Header */}
          <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-8 mb-8 text-center">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              {t("assessment.report.score_title")}
            </p>

            {/* Animated score ring */}
            <div className="relative w-40 h-40 mx-auto mb-4">
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
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - report.overall_score / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {animatedScore}
                </span>
                <span className="text-xs text-slate-500">/100</span>
              </div>
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
            {report.percentile !== undefined && (
              <p className="mt-2 text-sm text-slate-500">
                {t("assessment.report.percentile", {
                  pct: report.percentile,
                })}
              </p>
            )}

            {/* Stats row */}
            {report.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/[0.06]">
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
                    <CheckCircle size={12} />
                    {t("assessment.report.stats_accuracy")}
                  </div>
                  <p className="text-xl font-bold text-white">
                    {Math.round(report.stats.accuracy)}%
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
                    <BarChart3 size={12} />
                    {t("assessment.report.stats_questions")}
                  </div>
                  <p className="text-xl font-bold text-white">
                    {report.stats.correct_count}/{report.stats.total_questions}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Clock size={12} />
                    {t("assessment.report.stats_time")}
                  </div>
                  <p className="text-xl font-bold text-white">
                    {t("assessment.report.minutes", {
                      n: Math.round(report.stats.total_time_sec / 60),
                    })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Timer size={12} />
                    {t("assessment.report.stats_avg_time")}
                  </div>
                  <p className="text-xl font-bold text-white">
                    {t("assessment.report.seconds", {
                      n: Math.round(report.stats.avg_time_sec),
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* AI Analysis */}
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

          {/* Radar chart + Strong/Weak topics side by side */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Radar chart */}
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

            {/* Strong/Weak topics */}
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

          {/* Gap Analysis Chart */}
          {Object.keys(topicScores).length > 0 && (
            <div className="mb-8">
              <GapAnalysis t={t} topicScores={topicScores} />
            </div>
          )}

          {/* Topic Mastery Heatmap */}
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

          {/* Timeline Projection */}
          <div className="mb-8">
            <TimelineProjection t={t} currentScore={report.overall_score} />
          </div>

          {/* Learning Path (if study_plan available from API) */}
          {report.study_plan && report.study_plan.length > 0 && (
            <div className="mb-8">
              <LearningPath t={t} studyPlan={report.study_plan} />
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">
                {t("assessment.report.recommendations")}
              </h2>
              <div className="space-y-4">
                {report.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className={`rounded-xl ${getMasteryBg(i)} p-4 flex items-start gap-3`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Recommendations */}
          <div className="mb-8">
            <ServiceRecommendations t={t} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PdfExportButton t={t} containerId="report-content" />

            <button
              onClick={handleShare}
              className="border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-full px-6 py-3 font-medium transition-colors inline-flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-400" />
                  {t("assessment.report.copied")}
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  {t("assessment.report.share_btn")}
                </>
              )}
            </button>
            <Link
              href="/assessment"
              className="border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-full px-6 py-3 font-medium transition-colors inline-flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              {t("assessment.report.retake_btn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
