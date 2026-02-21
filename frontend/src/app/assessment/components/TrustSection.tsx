"use client";

import { BrainCircuit, GraduationCap, FileBarChart, BadgeCheck } from "lucide-react";

interface TrustSectionProps {
  t: (key: string, params?: Record<string, string | number>) => string;
}

const features = [
  {
    key: "adaptive",
    icon: BrainCircuit,
    iconColor: "text-teal-400",
    bgColor: "from-teal-500/20 to-teal-500/5",
  },
  {
    key: "aligned",
    icon: GraduationCap,
    iconColor: "text-blue-400",
    bgColor: "from-blue-500/20 to-blue-500/5",
  },
  {
    key: "report",
    icon: FileBarChart,
    iconColor: "text-purple-400",
    bgColor: "from-purple-500/20 to-purple-500/5",
  },
  {
    key: "free",
    icon: BadgeCheck,
    iconColor: "text-amber-400",
    bgColor: "from-amber-500/20 to-amber-500/5",
  },
];

export default function TrustSection({ t }: TrustSectionProps) {
  return (
    <section id="trust" className="bg-slate-950 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2
          data-reveal
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
        >
          {t("assessment.trust_title")}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((item) => (
            <div
              key={item.key}
              data-reveal
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 text-center"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.bgColor} flex items-center justify-center mx-auto mb-4`}
              >
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t(`assessment.trust_${item.key}`)}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t(`assessment.trust_${item.key}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
