"use client";

import Link from "next/link";

interface AssessmentFooterProps {
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function AssessmentFooter({ t }: AssessmentFooterProps) {
  return (
    <footer className="bg-slate-950 border-t border-white/[0.06] py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>{t("assessment.footer_powered")}</p>
        <Link
          href="/landing"
          className="text-slate-400 hover:text-white transition-colors"
        >
          {t("assessment.nav_home")}
        </Link>
      </div>
    </footer>
  );
}
