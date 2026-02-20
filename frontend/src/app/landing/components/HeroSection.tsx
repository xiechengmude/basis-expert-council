"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Clock, Globe, ShieldCheck } from "lucide-react";

interface HeroSectionProps {
  t: (key: string) => string;
}

export default function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
          background: "radial-gradient(circle, rgba(20,184,166,0.20) 0%, transparent 70%)",
        }}
      />

      {/* Glow blob 2 */}
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Bottom fade — blends into dark PainPoints section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div data-reveal>
            {/* Badge pill */}
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur">
              {t("hero_badge")}
            </span>

            {/* Heading */}
            <h1
              className="mt-6 text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
              dangerouslySetInnerHTML={{ __html: t("hero_title") }}
            />

            {/* Description */}
            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl">
              {t("hero_desc")}
            </p>

            {/* CTA buttons */}
            <div className="flex gap-4 mt-10 flex-wrap items-center">
              <Link
                href="/login"
                className="bg-brand-500 hover:bg-brand-400 text-white rounded-full px-8 py-3.5 font-semibold shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-colors"
              >
                {t("hero_btn_assess")}
                <ArrowRight size={18} />
              </Link>

              <a
                href="#features"
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {t("hero_btn_more")}
                <ChevronDown size={18} className="animate-bounce" />
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-16 flex gap-8 flex-wrap text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {t("trust_247")}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe size={14} />
                {t("trust_bilingual")}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} />
                {t("trust_campuses")}
              </span>
            </div>
          </div>

          {/* Right column — hidden on mobile */}
          <div className="hidden lg:block">
            {/* Glassmorphism card */}
            <div className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
              {/* macOS dots */}
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>

              {/* Header bar */}
              <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                <span>BasisPilot</span>
                <span>·</span>
                <span>Navigator</span>
                <span className="flex-1" />
                <div className="rounded-full bg-green-500/40 w-2 h-2" />
              </div>

              {/* Chat bubble — user */}
              <div className="bg-brand-500/20 rounded-2xl rounded-br-md p-4 mb-3 text-sm text-slate-300">
                {t("chat_user")}
              </div>

              {/* Chat bubble — AI */}
              <div className="bg-white/[0.06] rounded-2xl rounded-bl-md p-4 mb-3">
                <p className="text-xs text-brand-400 font-medium mb-2">
                  BasisPilot · Navigator
                </p>
                <p
                  className="text-sm text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("chat_ai") }}
                />
              </div>

              {/* Typing indicator */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{t("chat_delegating")}</span>
                <div
                  className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
