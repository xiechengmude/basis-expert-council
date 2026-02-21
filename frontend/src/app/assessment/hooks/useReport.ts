"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getApiBaseUrl } from "@/lib/config";
import type { AssessmentReport } from "../types/assessment";

export function useReport(reportId: string) {
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const API = getApiBaseUrl();

  const fetchReport = useCallback(async () => {
    if (!reportId) return;
    try {
      const res = await fetch(`${API}/api/assessment/report/${reportId}`);
      if (!res.ok) throw new Error("Failed to fetch report");
      const data: AssessmentReport = await res.json();
      setReport(data);
      setLoading(false);

      // Stop polling if report is ready or failed
      if (data.status !== "generating" && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [API, reportId]);

  useEffect(() => {
    if (!reportId) return;

    fetchReport();

    // Poll every 2s while generating
    intervalRef.current = setInterval(fetchReport, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [reportId, fetchReport]);

  return { report, loading, error };
}
