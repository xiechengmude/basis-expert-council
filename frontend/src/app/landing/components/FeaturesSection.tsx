"use client";

import {
  BookOpen,
  FlaskConical,
  AlertTriangle,
  BarChart3,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  t: (key: string) => string;
}

interface Feature {
  key: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  borderAccent: string;
}

const features: Feature[] = [
  {
    key: "tutor",
    Icon: BookOpen,
    iconBg: "bg-brand-50",
    iconColor: "text-brand-600",
    borderAccent: "border-brand-200",
  },
  {
    key: "ap",
    Icon: FlaskConical,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    borderAccent: "border-purple-200",
  },
  {
    key: "prob",
    Icon: AlertTriangle,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    borderAccent: "border-rose-200",
  },
  {
    key: "diag",
    Icon: BarChart3,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    borderAccent: "border-amber-200",
  },
  {
    key: "plan",
    Icon: GraduationCap,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    borderAccent: "border-blue-200",
  },
  {
    key: "onb",
    Icon: UserPlus,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderAccent: "border-emerald-200",
  },
];

export default function FeaturesSection({ t }: Props) {
  return (
    <section id="features" className="bg-gray-50/50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider text-center">
          {t("feat_label")}
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 text-center">
          {t("feat_title")}
        </h2>
        <p
          className="mt-4 text-lg text-gray-500 text-center max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{ __html: t("feat_desc") }}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map(({ key, Icon, iconBg, iconColor, borderAccent }) => (
            <div
              key={key}
              data-reveal
              className="bg-white rounded-2xl border border-gray-100 p-6 transition hover:border-brand-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
              >
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {t(`feat_${key}_h`)}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {t(`feat_${key}_p`)}
              </p>
              <span className="mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {t(`feat_${key}_tag`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
