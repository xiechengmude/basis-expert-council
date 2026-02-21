"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

interface ServiceRecommendationsProps {
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function ServiceRecommendations({
  t,
}: ServiceRecommendationsProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        {t("assessment.report.service_title")}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Free tier */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            {t("assessment.report.service_free")}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {t("assessment.report.service_free_desc")}
          </p>
          <Link
            href="/"
            className="w-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-full px-6 py-2.5 font-medium transition-colors inline-flex items-center justify-center gap-2 text-sm"
          >
            {t("assessment.report.cta_btn")}
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Premium tier */}
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-6 relative overflow-hidden">
          {/* Glow */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-brand-400" />
              <h3 className="text-lg font-semibold text-white">
                {t("assessment.report.service_premium")}
              </h3>
            </div>

            <ul className="space-y-2 mb-4">
              {["f1", "f2", "f3", "f4"].map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <Check size={14} className="text-brand-400 shrink-0" />
                  {t(`assessment.report.service_premium_${key}`)}
                </li>
              ))}
            </ul>

            <Link
              href="/landing#pricing"
              className="w-full bg-brand-500 hover:bg-brand-400 text-white rounded-full px-6 py-2.5 font-semibold shadow-lg shadow-brand-500/25 inline-flex items-center justify-center gap-2 text-sm transition-colors"
            >
              {t("assessment.report.service_premium")}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
