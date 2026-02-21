"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  t: (key: string) => string;
}

export default function AssessmentBannerSection({ t }: Props) {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 64px)",
        }}
      />

      <div
        data-reveal
        className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12"
      >
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {t("assess_banner_title")}
          </h2>
          <p className="mt-3 text-base text-slate-400 max-w-lg">
            {t("assess_banner_desc")}
          </p>
        </div>

        {/* Right: CTA */}
        <Link
          href="/assessment"
          className="shrink-0 bg-brand-500 hover:bg-brand-400 text-white rounded-full px-8 py-3.5 font-semibold shadow-lg shadow-brand-500/25 inline-flex items-center gap-2 transition-colors"
        >
          {t("assess_banner_cta")}
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
