"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Share2, RotateCcw, Check } from "lucide-react";
import PdfExportButton from "./PdfExportButton";

interface ReportActionsProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  shareToken?: string;
  reportContainerId: string;
}

export default function ReportActions({
  t,
  shareToken,
  reportContainerId,
}: ReportActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareUrl = shareToken
      ? `${window.location.origin}/assessment/shared/${shareToken}`
      : window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareToken]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <PdfExportButton t={t} containerId={reportContainerId} />

      <button
        onClick={handleShare}
        className="border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-full px-6 py-3 font-medium transition-colors inline-flex items-center justify-center gap-2"
      >
        {copied ? (
          <>
            <Check size={16} className="text-green-400" />
            {t("assessment.report.copied")}
          </>
        ) : (
          <>
            <Share2 size={16} />
            {t("assessment.report.share")}
          </>
        )}
      </button>

      <Link
        href="/assessment"
        className="border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-full px-6 py-3 font-medium transition-colors inline-flex items-center justify-center gap-2"
      >
        <RotateCcw size={16} />
        {t("assessment.report.retake_btn")}
      </Link>
    </div>
  );
}
