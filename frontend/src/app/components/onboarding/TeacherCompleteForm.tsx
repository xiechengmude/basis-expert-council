"use client";

import { useState } from "react";
import { Loader2, BookOpen, ChevronLeft, BarChart2, FileText } from "lucide-react";
import { fetchWithAuth } from "@/app/hooks/useUser";
import { useI18n } from "@/i18n";

interface TeacherCompleteFormProps {
  onComplete: () => void;
  onBack: () => void;
}

export function TeacherCompleteForm({ onComplete, onBack }: TeacherCompleteFormProps) {
  const { t } = useI18n();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetchWithAuth("/api/user/complete-kyc", {
        method: "POST",
      });
      if (res.ok) {
        onComplete();
      } else {
        const data = await res.json();
        setError(data.error || t("teacher.error.failed"));
      }
    } catch {
      setError(t("teacher.error.network"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-sm">
          <BookOpen className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{t("teacher.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {t("teacher.subtitle")}
        </p>
      </div>

      <div className="space-y-3 rounded-xl bg-blue-50/60 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-200">
            <BarChart2 className="h-3 w-3 text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{t("teacher.aiTeaching.title")}</p>
            <p className="text-xs text-gray-500">{t("teacher.aiTeaching.desc")}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-200">
            <FileText className="h-3 w-3 text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{t("teacher.reports.title")}</p>
            <p className="text-xs text-gray-500">{t("teacher.reports.desc")}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("teacher.back")}
        </button>
        <button
          type="button"
          onClick={handleComplete}
          disabled={submitting}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("teacher.processing")}
            </>
          ) : (
            t("teacher.start")
          )}
        </button>
      </div>
    </div>
  );
}
