"use client";

import { useState, useCallback } from "react";
import { getApiBaseUrl } from "@/lib/config";
import type {
  SessionState,
  AnswerResult,
} from "../types/assessment";

export function useQuiz() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = getApiBaseUrl();

  const startSession = useCallback(
    async (
      subject: string,
      gradeLevel: string,
      anonymousId: string,
      goal?: string,
    ): Promise<SessionState | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/assessment/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            grade_level: gradeLevel,
            anonymous_id: anonymousId,
            goal,
          }),
        });
        if (!res.ok) throw new Error("Failed to start session");
        const data: SessionState = await res.json();
        setSession(data);
        return data;
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [API],
  );

  const submitAnswer = useCallback(
    async (
      sessionId: string,
      questionId: number,
      answer: string,
      timeSpentSec: number,
    ): Promise<AnswerResult | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API}/api/assessment/${sessionId}/answer`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question_id: questionId,
              answer,
              time_spent_sec: timeSpentSec,
            }),
          },
        );
        if (!res.ok) throw new Error("Failed to submit answer");
        const data: AnswerResult = await res.json();

        // Update session state
        setSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            current_question: data.next_question,
            total_answered: prev.total_answered + 1,
            correct_count: prev.correct_count + (data.is_correct ? 1 : 0),
            ability_history: data.ability_history,
            current_difficulty: data.current_difficulty,
            status: data.session_complete ? "completed" : "in_progress",
          };
        });

        return data;
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [API],
  );

  const resumeSession = useCallback(
    async (sessionId: string): Promise<SessionState | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/assessment/${sessionId}`);
        if (!res.ok) throw new Error("Failed to resume session");
        const data: SessionState = await res.json();
        setSession(data);
        return data;
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [API],
  );

  const completeSession = useCallback(
    async (sessionId: string): Promise<{ report_id: string } | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API}/api/assessment/${sessionId}/complete`,
          { method: "POST" },
        );
        if (!res.ok) throw new Error("Failed to complete session");
        const data = await res.json();
        return data;
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [API],
  );

  return {
    session,
    loading,
    error,
    startSession,
    submitAnswer,
    resumeSession,
    completeSession,
  };
}
