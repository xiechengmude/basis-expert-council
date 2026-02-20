"use client";

import React from "react";
import { Zap, Crown, AlertTriangle } from "lucide-react";
import type { QuotaInfo } from "@/app/hooks/useUser";
import { getPlanName } from "@/app/hooks/useUser";

interface QuotaBannerProps {
  quota: QuotaInfo | null;
  className?: string;
}

export function QuotaBanner({ quota, className = "" }: QuotaBannerProps) {
  if (!quota) return null;

  const isUnlimited = quota.daily_limit === -1;
  const isLow = !isUnlimited && quota.remaining <= 3 && quota.remaining > 0;
  const isExhausted = !isUnlimited && quota.remaining <= 0;
  const isPriority = quota.priority;

  if (isExhausted) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm ${className}`}
      >
        <AlertTriangle size={14} className="shrink-0 text-red-500" />
        <span className="text-red-700">
          今日对话次数已用完（{quota.used_today}/{quota.daily_limit}）
        </span>
        <a
          href="/landing#pricing"
          className="ml-auto shrink-0 rounded-md bg-red-500 px-2 py-0.5 text-xs text-white hover:bg-red-600"
        >
          升级会员
        </a>
      </div>
    );
  }

  if (isLow) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm ${className}`}
      >
        <Zap size={14} className="shrink-0 text-amber-500" />
        <span className="text-amber-700">
          今日剩余 {quota.remaining} 次对话（{quota.used_today}/{quota.daily_limit}）
        </span>
        <a
          href="/landing#pricing"
          className="ml-auto shrink-0 rounded-md border border-amber-300 px-2 py-0.5 text-xs text-amber-700 hover:bg-amber-100"
        >
          升级
        </a>
      </div>
    );
  }

  // Normal state — compact display
  return (
    <div
      className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}
    >
      {isPriority && <Crown size={12} className="text-amber-500" />}
      <span>
        {getPlanName(quota.plan)}
        {!isUnlimited && ` · 今日 ${quota.used_today}/${quota.daily_limit}`}
        {isUnlimited && " · 无限对话"}
      </span>
    </div>
  );
}
