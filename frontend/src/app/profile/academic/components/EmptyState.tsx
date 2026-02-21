"use client";

import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  t: (key: string) => string;
}

export default function EmptyState({ t }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.06]">
        <ClipboardList size={32} className="text-slate-500" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">
        {t("academic.empty.title")}
      </h2>
      <p className="text-sm text-slate-400 mb-8 max-w-md">
        {t("academic.empty.desc")}
      </p>
      <Link
        href="/assessment"
        className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
      >
        {t("academic.empty.cta")}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
