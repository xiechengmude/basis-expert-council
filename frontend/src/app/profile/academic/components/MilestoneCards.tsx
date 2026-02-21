"use client";

import { Trophy, Star, CheckCircle, Calendar } from "lucide-react";

interface MilestoneCardsProps {
  totalAssessments: number;
  masteredMistakes: number;
  highestScore: number | null;
  firstSessionDate: string | null;
  t: (key: string) => string;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric" });
}

export default function MilestoneCards({
  totalAssessments,
  masteredMistakes,
  highestScore,
  firstSessionDate,
  t,
}: MilestoneCardsProps) {
  const milestones = [
    {
      label: t("academic.milestones.first_assessment"),
      value: firstSessionDate ? formatDate(firstSessionDate) : "—",
      icon: Calendar,
      color: "text-teal-400",
      bgColor: "bg-teal-400/10",
      achieved: !!firstSessionDate,
    },
    {
      label: t("academic.milestones.total_assessments"),
      value: `${totalAssessments}`,
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      achieved: totalAssessments > 0,
    },
    {
      label: t("academic.milestones.mastered_mistakes"),
      value: `${masteredMistakes}`,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      achieved: masteredMistakes > 0,
    },
    {
      label: t("academic.milestones.highest_score"),
      value: highestScore !== null ? `${Math.round(highestScore)}` : "—",
      icon: Star,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      achieved: highestScore !== null,
    },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        {t("academic.milestones.title")}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {milestones.map((milestone, i) => (
          <div
            key={i}
            className={`shrink-0 w-44 rounded-xl border p-4 transition-colors ${
              milestone.achieved
                ? "border-white/[0.06] bg-white/[0.03]"
                : "border-white/[0.04] bg-white/[0.01] opacity-50"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${milestone.bgColor}`}
              >
                <milestone.icon size={16} className={milestone.color} />
              </div>
            </div>
            <p className="text-lg font-bold text-white truncate">{milestone.value}</p>
            <p className="text-xs text-slate-400 mt-1 leading-snug">{milestone.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
