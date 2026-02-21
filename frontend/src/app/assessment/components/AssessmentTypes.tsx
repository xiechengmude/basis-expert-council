"use client";

import { ClipboardList, Stethoscope, Zap, ArrowRight, Clock, Users } from "lucide-react";
import Link from "next/link";

interface AssessmentTypesProps {
  t: (key: string, params?: Record<string, string | number>) => string;
}

const assessmentTypes = [
  {
    key: "pre_admission",
    type: "pre_admission",
    icon: ClipboardList,
    gradient: "from-teal-500/20 to-teal-500/5",
    iconColor: "text-teal-400",
    borderColor: "border-teal-500/20",
    hoverBorder: "hover:border-teal-500/40",
  },
  {
    key: "diagnostic",
    type: "diagnostic",
    icon: Stethoscope,
    gradient: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/40",
  },
  {
    key: "quick",
    type: "quick",
    icon: Zap,
    gradient: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/20",
    hoverBorder: "hover:border-amber-500/40",
  },
];

export default function AssessmentTypes({ t }: AssessmentTypesProps) {
  return (
    <section id="assessment-types" className="bg-slate-900 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {assessmentTypes.map((item) => (
            <div
              key={item.key}
              data-reveal
              className={`group relative rounded-2xl border ${item.borderColor} ${item.hoverBorder} bg-white/[0.03] p-8 flex flex-col transition-all duration-300 hover:bg-white/[0.06] hover:shadow-2xl`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6`}
              >
                <item.icon className={`w-7 h-7 ${item.iconColor}`} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3">
                {t(`assessment.type.${item.key}`)}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                {t(`assessment.type.${item.key}_desc`)}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {t(`assessment.type.${item.key}_meta`)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {t(`assessment.type.${item.key}_audience`)}
                </span>
              </div>

              {/* CTA Button */}
              <Link
                href={`/assessment/start?type=${item.type}`}
                className="w-full text-center rounded-full py-3 font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 group-hover:border-brand-500/40 group-hover:text-brand-400"
              >
                {t("assessment.card_cta")}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
