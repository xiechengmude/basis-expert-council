"use client";

import { useMemo } from "react";

interface MisconceptionPanelProps {
  misconceptions: Array<{
    id: string;
    count: number;
    description_zh?: string;
  }>;
  t: (key: string) => string;
}

export default function MisconceptionPanel({
  misconceptions,
  t,
}: MisconceptionPanelProps) {
  const sorted = useMemo(
    () => [...misconceptions].sort((a, b) => b.count - a.count),
    [misconceptions],
  );

  if (sorted.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        {t("mistakes.misconceptions.title")}
      </h2>

      <div className="space-y-3">
        {sorted.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            {/* Count badge */}
            <span className="shrink-0 inline-flex items-center justify-center min-w-[28px] h-7 rounded-full bg-red-400/15 text-red-400 text-xs font-semibold px-2">
              {item.count}
            </span>

            <div className="min-w-0 flex-1">
              {/* Misconception ID */}
              <div className="text-sm font-medium text-white mb-0.5">
                {item.id}
              </div>

              {/* Description */}
              {item.description_zh && (
                <div className="text-xs text-slate-400 leading-relaxed">
                  {item.description_zh}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
