"use client";

import { BarChart3, CheckCircle, TrendingUp, Target, BookX, Sparkles } from "lucide-react";

interface KpiData {
  total_assessments: number;
  overall_accuracy: number;
  improvement_pct: number;
  total_questions: number;
  total_mistakes?: number;
  mastery_rate?: number;
}

interface KpiCardsProps {
  kpi: KpiData;
  t: (key: string) => string;
}

export default function KpiCards({ kpi, t }: KpiCardsProps) {
  const cards = [
    {
      label: t("academic.kpi.total_assessments"),
      value: kpi.total_assessments,
      icon: BarChart3,
      color: "text-teal-400",
      bgColor: "bg-teal-400/10",
    },
    {
      label: t("academic.kpi.overall_accuracy"),
      value: `${Math.round(kpi.overall_accuracy)}%`,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: t("academic.kpi.improvement"),
      value: `${kpi.improvement_pct > 0 ? "+" : ""}${kpi.improvement_pct}%`,
      icon: TrendingUp,
      color: kpi.improvement_pct >= 0 ? "text-green-400" : "text-red-400",
      bgColor: kpi.improvement_pct >= 0 ? "bg-green-400/10" : "bg-red-400/10",
    },
    {
      label: t("academic.kpi.total_questions"),
      value: kpi.total_questions,
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      label: t("academic.kpi.total_mistakes"),
      value: kpi.total_mistakes ?? 0,
      icon: BookX,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
    {
      label: t("academic.kpi.mastery_rate"),
      value: `${Math.round(kpi.mastery_rate ?? 0)}%`,
      icon: Sparkles,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bgColor}`}>
              <card.icon size={16} className={card.color} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
          <p className="text-xs text-slate-400 mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
