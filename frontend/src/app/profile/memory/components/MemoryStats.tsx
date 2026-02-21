"use client";

import { Brain, Tag, BookOpen } from "lucide-react";

interface MemoryStatsProps {
  stats: {
    total: number;
    by_category: Record<string, number>;
    by_subject: Record<string, number>;
  };
  t: (key: string) => string;
}

export default function MemoryStats({ stats, t }: MemoryStatsProps) {
  const topCategories = Object.entries(stats.by_category)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const topSubjects = Object.entries(stats.by_subject)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10">
            <Brain size={16} className="text-violet-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-white">{stats.total}</p>
        <p className="text-xs text-slate-400 mt-1">{t("memory.stats.total")}</p>
      </div>

      {/* By category */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/10">
            <Tag size={16} className="text-teal-400" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-2">{t("memory.stats.by_category")}</p>
        <div className="space-y-1">
          {topCategories.map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between text-sm">
              <span className="text-slate-300 truncate">{t(`memory.category.${cat}`)}</span>
              <span className="text-slate-400 ml-2">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* By subject */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/10">
            <BookOpen size={16} className="text-blue-400" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-2">{t("memory.stats.by_subject")}</p>
        <div className="space-y-1">
          {topSubjects.map(([subj, count]) => (
            <div key={subj} className="flex items-center justify-between text-sm">
              <span className="text-slate-300 truncate capitalize">{subj}</span>
              <span className="text-slate-400 ml-2">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
