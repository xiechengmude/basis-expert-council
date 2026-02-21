"use client";

import Link from "next/link";
import { Brain, ArrowRight, MessageCircle } from "lucide-react";

interface MemoryEmptyStateProps {
  t: (key: string) => string;
}

export default function MemoryEmptyState({ t }: MemoryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-teal-500/10 border border-white/[0.06]">
        <div className="relative">
          <Brain size={32} className="text-slate-500" />
          <MessageCircle size={16} className="text-violet-500 absolute -bottom-1 -right-2" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">
        {t("memory.empty.title")}
      </h2>
      <p className="text-sm text-slate-400 mb-8 max-w-md">
        {t("memory.empty.desc")}
      </p>
      <Link
        href="/chat"
        className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
      >
        {t("memory.empty.cta")}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
