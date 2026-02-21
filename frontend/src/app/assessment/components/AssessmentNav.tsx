"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AssessmentNavProps {
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function AssessmentNav({ t }: AssessmentNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/landing" className="flex items-center gap-2.5 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mark.svg"
              alt="BasisPilot logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold text-lg text-white">
              {t("assessment.nav_brand")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/landing"
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              {t("assessment.nav_home")}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full px-5 py-2 text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              {t("assessment.nav_login")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
