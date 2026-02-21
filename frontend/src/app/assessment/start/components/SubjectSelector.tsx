"use client";

import {
  Calculator,
  BookOpen,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SubjectSelectorProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  selected: string;
  onSelect: (subject: string) => void;
}

interface SubjectOption {
  key: string;
  icon: LucideIcon;
  available: boolean;
}

const SUBJECTS: SubjectOption[] = [
  { key: "math", icon: Calculator, available: true },
  { key: "english", icon: BookOpen, available: false },
  { key: "physics", icon: Atom, available: false },
  { key: "chemistry", icon: FlaskConical, available: false },
  { key: "biology", icon: Dna, available: false },
  { key: "history", icon: Landmark, available: false },
];

export default function SubjectSelector({
  t,
  selected,
  onSelect,
}: SubjectSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {SUBJECTS.map((s) => (
        <button
          key={s.key}
          onClick={() => s.available && onSelect(s.key)}
          disabled={!s.available}
          className={`group relative rounded-xl border p-5 text-center transition-all duration-200 ${
            !s.available
              ? "border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed"
              : selected === s.key
                ? "border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10"
                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          }`}
        >
          <s.icon
            size={24}
            className={`mx-auto mb-3 ${
              selected === s.key ? "text-brand-400" : "text-slate-500"
            }`}
          />
          <span
            className={`text-sm font-semibold ${
              selected === s.key ? "text-white" : "text-slate-300"
            }`}
          >
            {t(`assessment.subject.${s.key}`)}
          </span>
          {!s.available && (
            <span className="block text-xs text-slate-600 mt-1">
              {t("assessment.wizard.coming_soon")}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
