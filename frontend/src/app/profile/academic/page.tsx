"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useI18n } from "@/i18n";
import { useUser, fetchWithAuth } from "@/app/hooks/useUser";
import AcademicHeader from "./components/AcademicHeader";
import KpiCards from "./components/KpiCards";
import SubjectRadar from "./components/SubjectRadar";
import TopicProgress from "./components/TopicProgress";
import AbilityTrend from "./components/AbilityTrend";
import AssessmentTimeline from "./components/AssessmentTimeline";
import EmptyState from "./components/EmptyState";

interface AcademicData {
  student: {
    id: number;
    nickname: string | null;
    grade: string | null;
    school_name: string | null;
    campus: string | null;
    ap_courses: string | null;
  };
  subjects: Array<{
    subject: string;
    ability_score: number;
    score_100: number;
    confidence: number;
    assessment_count: number;
    topics: Array<{ topic: string; ability_score: number; score_100: number }>;
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
    ability_level: number | null;
    assessment_type: string;
    completed_at: string | null;
  }>;
  kpi: {
    total_assessments: number;
    overall_accuracy: number;
    improvement_pct: number;
    total_questions: number;
  };
}

export default function AcademicProfilePage() {
  const { t } = useI18n();
  const { profile, loading: userLoading } = useUser();
  const [data, setData] = useState<AcademicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parent: select child
  const linkedStudents = profile?.linked_students || [];
  const isParent = profile?.user?.role === "parent";
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (userLoading) return;
    if (!profile) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
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
    };

    fetchData();
  }, [profile, userLoading, selectedStudentId]);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const isEmpty = !data || data.kpi.total_assessments === 0;

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
              t={t}
            />

            <KpiCards kpi={data.kpi} t={t} />

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mx-auto mb-6 grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="overview">{t("academic.tab.overview")}</TabsTrigger>
                <TabsTrigger value="subjects">{t("academic.tab.subjects")}</TabsTrigger>
                <TabsTrigger value="history">{t("academic.tab.history")}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-8">
                  <SubjectRadar subjects={data.subjects} t={t} />
                  <AbilityTrend history={data.history} t={t} />
                </div>
              </TabsContent>

              <TabsContent value="subjects">
                <TopicProgress subjects={data.subjects} t={t} />
              </TabsContent>

              <TabsContent value="history">
                <AssessmentTimeline sessions={data.recent_sessions} t={t} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
