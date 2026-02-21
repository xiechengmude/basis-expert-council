"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

interface AssessmentHeroProps {
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function AssessmentHero({ t }: AssessmentHeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 64px)",
        }}
      />

      {/* Glow blob 1 */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.20) 0%, transparent 70%)",
        }}
      />

      {/* Glow blob 2 */}
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 py-32 w-full text-center">
        <div data-reveal>
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur">
            {t("assessment.hero_badge")}
          </span>

          {/* Heading */}
          <h1 className="mt-6 text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {t("assessment.hero_title")}
          </h1>

          <p className="mt-4 text-2xl lg:text-3xl font-medium text-brand-400">
            {t("assessment.hero_subtitle")}
          </p>

          {/* Description */}
          <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {t("assessment.hero_desc")}
          </p>

          {/* CTA */}
          <div className="flex gap-4 mt-10 flex-wrap items-center justify-center">
            <Link
              href="#assessment-types"
              className="bg-brand-500 hover:bg-brand-400 text-white rounded-full px-8 py-3.5 font-semibold shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-colors"
            >
              {t("assessment.hero_cta")}
              <ArrowRight size={18} />
            </Link>

            <a
              href="#trust"
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {t("assessment.hero_learn_more")}
              <ChevronDown size={18} className="animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
