"use client";

import { GraduationCap } from "lucide-react";

interface GradeSelectorProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  selected: string;
  onSelect: (grade: string) => void;
}

const GRADES = ["G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"];

export default function GradeSelector({
  t,
  selected,
  onSelect,
}: GradeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {GRADES.map((g) => (
        <button
          key={g}
          onClick={() => onSelect(g)}
          className={`group relative rounded-xl border p-4 text-center transition-all duration-200 ${
            selected === g
              ? "border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10"
              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          }`}
        >
          <GraduationCap
            size={20}
            className={`mx-auto mb-2 ${
              selected === g ? "text-brand-400" : "text-slate-500"
            }`}
          />
          <span
            className={`text-sm font-semibold ${
              selected === g ? "text-white" : "text-slate-300"
            }`}
          >
            {g}
          </span>
          <p className="text-xs text-slate-500 mt-1">
            {t(`assessment.grade.${g}`)}
          </p>
        </button>
      ))}
    </div>
  );
}
