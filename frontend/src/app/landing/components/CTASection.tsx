"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  t: (key: string) => string;
  onLoginClick?: () => void;
}

export default function CTASection({ t, onLoginClick }: Props) {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 64px)",
        }}
      />

      <div
        data-reveal
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2
          className="text-3xl md:text-4xl font-bold text-white"
          dangerouslySetInnerHTML={{ __html: t("cta_title") }}
        />
        <p className="mt-6 text-lg text-slate-400">{t("cta_desc")}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          {onLoginClick ? (
            <button
              onClick={onLoginClick}
              className="bg-brand-500 hover:bg-brand-400 text-white rounded-full px-8 py-3.5 font-semibold inline-flex items-center gap-2 transition"
            >
              {t("cta_btn_start")}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-brand-500 hover:bg-brand-400 text-white rounded-full px-8 py-3.5 font-semibold inline-flex items-center gap-2 transition"
            >
              {t("cta_btn_start")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          {onLoginClick ? (
            <button
              onClick={onLoginClick}
              className="border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-full px-8 py-3.5 font-semibold transition"
            >
              {t("cta_btn_demo")}
            </button>
          ) : (
            <Link
              href="/login"
              className="border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-full px-8 py-3.5 font-semibold transition"
            >
              {t("cta_btn_demo")}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
