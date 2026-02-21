"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useI18n } from "@/i18n";
import { useUser, fetchWithAuth } from "@/app/hooks/useUser";
import AcademicHeader from "./components/AcademicHeader";
import KpiCards from "./components/KpiCards";
import GoalGapCards from "./components/GoalGapCards";
import SubjectRadar from "./components/SubjectRadar";
import MistakeSummaryCard from "./components/MistakeSummaryCard";
import ActivityHeatmap from "./components/ActivityHeatmap";
import MistakeFilters from "./components/MistakeFilters";
import MistakeList from "./components/MistakeList";
import MistakeByTopicChart from "./components/MistakeByTopicChart";
import MisconceptionPanel from "./components/MisconceptionPanel";
import BloomMasteryChart from "./components/BloomMasteryChart";
import TopicProgress from "./components/TopicProgress";
import AbilityTrend from "./components/AbilityTrend";
import AssessmentTimeline from "./components/AssessmentTimeline";
import GoalTimeline from "./components/GoalTimeline";
import MilestoneCards from "./components/MilestoneCards";
import EmptyState from "./components/EmptyState";

// ---------------------------------------------------------------------------
// Types — v2 API response
// ---------------------------------------------------------------------------

interface AcademicData {
  meta?: {
    computed_at?: string;
    version?: number;
    data_range?: { first_session?: string; last_session?: string };
  };
  student: {
    id: number;
    nickname: string | null;
    grade: string | null;
    school_name: string | null;
    campus: string | null;
    ap_courses: string | null;
  };
  kpi: {
    total_assessments: number;
    total_questions: number;
    overall_accuracy: number;
    improvement_pct: number;
    total_mistakes?: number;
    mastered_mistakes?: number;
    active_mistakes?: number;
    mastery_rate?: number;
  };
  subjects: Array<{
    subject: string;
    score_100: number;
    confidence: number;
    total_questions: number;
    correct_questions: number;
    wrong_questions: number;
    mastered_mistakes: number;
    active_mistakes: number;
    bloom_mastery: Record<string, number>;
    topics: Array<{
      topic: string;
      score_100: number;
      total: number;
      correct: number;
      wrong: number;
      active_mistakes: number;
    }>;
  }>;
  mistake_book?: {
    summary: {
      total: number;
      by_status: Record<string, number>;
      by_subject: Record<string, number>;
      top_misconceptions: Array<{ id: string; count: number; description_zh?: string }>;
    };
    entries: Array<Record<string, unknown>>;
  };
  goals?: Array<{
    goal_type: string;
    goal_text: string;
    target_value: number | null;
    current_value: number | null;
    gap_pct: number | null;
    status: string;
  }>;
  history: Array<{
    subject: string;
    topic: string | null;
    score_100: number;
    recorded_at: string;
  }>;
  recent_sessions: Array<{
    id: string;
    subject: string;
    final_score: number | null;
    assessment_type: string;
    completed_at: string | null;
  }>;
  activity_heatmap?: Record<string, { questions: number; correct: number; messages: number }>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AcademicProfilePage() {
  const { t } = useI18n();
  const { profile, loading: userLoading } = useUser();
  const [data, setData] = useState<AcademicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parent: select child
  const linkedStudents = profile?.linked_students || [];
  const isParent = profile?.user?.role === "parent";
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Mistake filters
  const [mistakeSubject, setMistakeSubject] = useState<string | null>(null);
  const [mistakeStatus, setMistakeStatus] = useState<string | null>(null);
  const [mistakeSort, setMistakeSort] = useState<"time" | "count">("time");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = selectedStudentId ? `?student_id=${selectedStudentId}` : "";
      const res = await fetchWithAuth(`/api/academic/profile${params}`);
      if (res.ok) {
        const json = await res.json();
        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
        }
      } else {
        setError("Failed to load academic profile");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    if (userLoading) return;
    if (!profile) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [profile, userLoading, fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const params = selectedStudentId ? `?student_id=${selectedStudentId}` : "";
      const res = await fetchWithAuth(`/api/academic/profile/refresh${params}`, {
        method: "POST",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.profile) {
          setData(json.profile);
        }
      }
    } catch {
      // silent
    } finally {
      setRefreshing(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const isEmpty = !data || data.kpi.total_assessments === 0;

  // Filter & sort mistake entries
  const mistakeEntries = data?.mistake_book?.entries ?? [];
  const filteredMistakes = mistakeEntries
    .filter((e) => !mistakeSubject || e.subject === mistakeSubject)
    .filter((e) => !mistakeStatus || e.mastery_status === mistakeStatus)
    .sort((a, b) => {
      if (mistakeSort === "count") {
        return ((b.wrong_count as number) || 0) - ((a.wrong_count as number) || 0);
      }
      return String(b.last_wrong_at || "").localeCompare(String(a.last_wrong_at || ""));
    });

  // Aggregate bloom mastery across all subjects
  const aggregatedBloom: Record<string, number[]> = {};
  if (data) {
    for (const subj of data.subjects) {
      for (const [level, rate] of Object.entries(subj.bloom_mastery || {})) {
        if (!aggregatedBloom[level]) aggregatedBloom[level] = [];
        aggregatedBloom[level].push(rate);
      }
    }
  }
  const bloomAvg: Record<string, number> = {};
  for (const [level, rates] of Object.entries(aggregatedBloom)) {
    bloomAvg[level] = rates.reduce((a, b) => a + b, 0) / rates.length;
  }

  // Available subjects for mistake filter
  const availableSubjects = [...new Set(mistakeEntries.map((e) => String(e.subject)))];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top nav */}
      <div className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/chat" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-semibold text-white">
            {t("academic.title")}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16">
        {/* Parent student switcher */}
        {isParent && linkedStudents.length > 0 && (
          <div className="mb-6">
            <label className="text-sm text-slate-400 mb-2 block">
              {t("academic.parent.select_student")}
            </label>
            <select
              value={selectedStudentId || ""}
              onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : null)}
              className="bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">--</option>
              {linkedStudents.map((s: Record<string, unknown>) => (
                <option key={String(s.id)} value={String(s.id)}>
                  {String(s.nickname || s.id)}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-6 text-sm text-red-400">
            {error}
          </div>
        )}

        {isEmpty ? (
          <EmptyState t={t} />
        ) : data && (
          <>
            <AcademicHeader
              student={data.student}
              subjects={data.subjects}
              totalAssessments={data.kpi.total_assessments}
              kpi={data.kpi}
              computedAt={data.meta?.computed_at}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              t={t}
            />

            {/* Goal gap cards */}
            {data.goals && data.goals.length > 0 && (
              <GoalGapCards goals={data.goals} t={t} />
            )}

            <KpiCards kpi={data.kpi} t={t} />

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mx-auto mb-6 grid w-full max-w-lg grid-cols-4">
                <TabsTrigger value="overview">{t("academic.tab.overview")}</TabsTrigger>
                <TabsTrigger value="mistakes">{t("academic.tab.mistakes")}</TabsTrigger>
                <TabsTrigger value="ability">{t("academic.tab.ability")}</TabsTrigger>
                <TabsTrigger value="history">{t("academic.tab.history")}</TabsTrigger>
              </TabsList>

              {/* ==================== Tab 1: 总览 ==================== */}
              <TabsContent value="overview">
                <div className="space-y-8">
                  <SubjectRadar subjects={data.subjects} t={t} />
                  {data.mistake_book && (
                    <MistakeSummaryCard
                      summary={data.mistake_book.summary}
                      masteryRate={data.kpi.mastery_rate ?? 0}
                      t={t}
                    />
                  )}
                  {data.activity_heatmap && Object.keys(data.activity_heatmap).length > 0 && (
                    <ActivityHeatmap data={data.activity_heatmap} t={t} />
                  )}
                </div>
              </TabsContent>

              {/* ==================== Tab 2: 错题分析 ==================== */}
              <TabsContent value="mistakes">
                <div className="space-y-6">
                  <MistakeFilters
                    subjects={availableSubjects}
                    selectedSubject={mistakeSubject}
                    selectedStatus={mistakeStatus}
                    sortBy={mistakeSort}
                    onSubjectChange={setMistakeSubject}
                    onStatusChange={setMistakeStatus}
                    onSortChange={setMistakeSort}
                    t={t}
                  />
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <MistakeList entries={filteredMistakes as any[]} t={t} />
                  {data.mistake_book && (
                    <>
                      <MistakeByTopicChart
                        entries={mistakeEntries.map((e) => ({
                          subject: String(e.subject),
                          topic: String(e.topic),
                          mastery_status: String(e.mastery_status),
                        }))}
                        t={t}
                      />
                      {data.mistake_book.summary.top_misconceptions.length > 0 && (
                        <MisconceptionPanel
                          misconceptions={data.mistake_book.summary.top_misconceptions}
                          t={t}
                        />
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              {/* ==================== Tab 3: 能力图谱 ==================== */}
              <TabsContent value="ability">
                <div className="space-y-8">
                  {Object.keys(bloomAvg).length > 0 && (
                    <BloomMasteryChart bloomMastery={bloomAvg} t={t} />
                  )}
                  <TopicProgress subjects={data.subjects} t={t} />
                  <AbilityTrend history={data.history} t={t} />
                </div>
              </TabsContent>

              {/* ==================== Tab 4: 学习轨迹 ==================== */}
              <TabsContent value="history">
                <div className="space-y-8">
                  <AssessmentTimeline sessions={data.recent_sessions} t={t} />
                  {data.goals && data.goals.length > 0 && (
                    <GoalTimeline goals={data.goals} t={t} />
                  )}
                  <MilestoneCards
                    totalAssessments={data.kpi.total_assessments}
                    masteredMistakes={data.kpi.mastered_mistakes ?? 0}
                    highestScore={
                      data.recent_sessions.length > 0
                        ? Math.max(...data.recent_sessions.map((s) => s.final_score ?? 0))
                        : null
                    }
                    firstSessionDate={data.meta?.data_range?.first_session ?? null}
                    t={t}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
