"use client";

import type { StudyPlanItem } from "../../../types/assessment";

interface LearningPathProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  studyPlan: StudyPlanItem[];
}

export default function LearningPath({ t, studyPlan }: LearningPathProps) {
  if (!studyPlan || studyPlan.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        {t("assessment.report.path_title")}
      </h2>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/[0.06]" />

        <div className="space-y-8">
          {studyPlan.map((item, idx) => (
            <div key={idx} className="relative pl-14">
              {/* Timeline dot */}
              <div className="absolute left-3 top-1 w-5 h-5 rounded-full bg-brand-500/20 border-2 border-brand-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-brand-400">
                  {item.week}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {t("assessment.report.week", { n: item.week })} — {item.focus}
                </h3>
                <ul className="space-y-1">
                  {item.activities.map((activity, aidx) => (
                    <li
                      key={aidx}
                      className="text-xs text-slate-400 flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
