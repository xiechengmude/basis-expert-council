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
  iconColor: string;
}

const features: Feature[] = [
  { key: "tutor", Icon: BookOpen, iconColor: "text-brand-400" },
  { key: "ap", Icon: FlaskConical, iconColor: "text-purple-400" },
  { key: "prob", Icon: AlertTriangle, iconColor: "text-rose-400" },
  { key: "diag", Icon: BarChart3, iconColor: "text-amber-400" },
  { key: "plan", Icon: GraduationCap, iconColor: "text-blue-400" },
  { key: "onb", Icon: UserPlus, iconColor: "text-emerald-400" },
];

export default function FeaturesSection({ t }: Props) {
  return (
    <section id="features" className="bg-slate-950 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider text-center">
          {t("feat_label")}
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white text-center">
          {t("feat_title")}
        </h2>
        <p
          className="mt-4 text-lg text-slate-400 text-center max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{ __html: t("feat_desc") }}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map(({ key, Icon, iconColor }) => (
            <div
              key={key}
              data-reveal
              className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6 transition hover:bg-white/[0.06] hover:border-white/10 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {t(`feat_${key}_h`)}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {t(`feat_${key}_p`)}
              </p>
              <span className="mt-4 inline-flex rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-400">
                {t(`feat_${key}_tag`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
