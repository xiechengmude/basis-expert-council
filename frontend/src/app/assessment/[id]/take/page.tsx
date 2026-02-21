"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { getApiBaseUrl } from "@/lib/config";

interface Question {
  id: string;
  stem: string;
  options?: { key: string; text: string }[];
  type: "mcq" | "fill_in" | "short_answer" | "essay" | "experiment";
  image_url?: string;
}

interface AnswerResponse {
  is_correct: boolean | null;
  score: number | null;
  next_question: Question | null;
  progress: { current: number; total: number };
  is_last: boolean;
  agent_feedback?: string;
}

type FeedbackState = "correct" | "incorrect" | "scored" | null;

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const sessionId = params.id as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [progress, setProgress] = useState({ current: 1, total: 15 });
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [agentFeedback, setAgentFeedback] = useState<string | null>(null);
  const [agentScore, setAgentScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const [timeLimitSec, setTimeLimitSec] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [transitioning, setTransitioning] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [timeExpired, setTimeExpired] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoCompleteRef = useRef(false);

  // Countdown timer
  useEffect(() => {
    if (remainingSec === null) return;

    timerRef.current = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev === null) return null;
        const next = prev - 1;
        if (next <= 0) {
          setTimeExpired(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [remainingSec !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-complete when time expires
  useEffect(() => {
    if (!timeExpired || autoCompleteRef.current || completing) return;
    autoCompleteRef.current = true;
    handleTimeExpired();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeExpired]);

  async function handleTimeExpired() {
    setCompleting(true);
    try {
      const apiBase = getApiBaseUrl();
      const completeRes = await fetch(
        `${apiBase}/api/assessment/${sessionId}/complete`,
        { method: "POST" },
      );
      if (!completeRes.ok) throw new Error(`HTTP ${completeRes.status}`);
      const completeData = await completeRes.json();
      router.push(
        `/assessment/${sessionId}/report${completeData.report_id ? `?report_id=${completeData.report_id}` : ""}`,
      );
    } catch {
      setError(t("assessment.quiz.error"));
      setCompleting(false);
      autoCompleteRef.current = false;
    }
  }

  // Load first question from session storage or fetch via a status endpoint
  useEffect(() => {
    const stored = sessionStorage.getItem(
      `assessment_${sessionId}_first_question`,
    );
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setQuestion(data.first_question);
        if (data.total_estimated) {
          setProgress({ current: 1, total: data.total_estimated });
        }
        if (data.time_limit_sec) {
          setTimeLimitSec(data.time_limit_sec);
          setRemainingSec(data.time_limit_sec);
        }
        sessionStorage.removeItem(`assessment_${sessionId}_first_question`);
      } catch {
        fetchFirstQuestion();
        return;
      }
    } else {
      fetchFirstQuestion();
      return;
    }
    setInitialLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function fetchFirstQuestion() {
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(
        `${apiBase}/api/assessment/${sessionId}/status`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setQuestion(data.current_question);
      if (data.progress) setProgress(data.progress);
      if (data.time_limit_sec) {
        setTimeLimitSec(data.time_limit_sec);
        setRemainingSec(data.time_limit_sec);
      }
    } catch {
      setError(t("assessment.quiz.error"));
    } finally {
      setInitialLoading(false);
    }
  }

  const formatTime = useCallback((sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  // Timer color: green > 50%, yellow 20-50%, red < 20%
  const timerColor = useCallback(() => {
    if (remainingSec === null || timeLimitSec === null)
      return "text-slate-500";
    const ratio = remainingSec / timeLimitSec;
    if (ratio <= 0.1) return "text-red-400 animate-pulse";
    if (ratio <= 0.2) return "text-red-400";
    if (ratio <= 0.5) return "text-amber-400";
    return "text-emerald-400";
  }, [remainingSec, timeLimitSec]);

  const remainingQuestions = progress.total - progress.current;
  const showEncouragement = remainingQuestions <= 2 && remainingQuestions >= 0;
  const progressPercent = Math.min(
    (progress.current / progress.total) * 100,
    100,
  );

  // Check if question type is subjective (needs textarea)
  const isSubjective =
    question?.type === "short_answer" ||
    question?.type === "essay" ||
    question?.type === "experiment";

  async function doSubmitAnswer(answer: string) {
    if (submitting || !question) return;
    setSubmitting(true);
    setError("");
    setAgentFeedback(null);
    setAgentScore(null);

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(
        `${apiBase}/api/assessment/${sessionId}/answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_id: question.id,
            answer,
            time_spent_sec: timeSpent,
          }),
        },
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: AnswerResponse = await res.json();

      // Show feedback
      if (data.agent_feedback) {
        // Subjective question with agent scoring
        setAgentFeedback(data.agent_feedback);
        setAgentScore(data.score);
        setFeedback("scored");
      } else if (data.is_correct !== null) {
        setFeedback(data.is_correct ? "correct" : "incorrect");
      }

      // Wait for feedback animation, then advance
      const feedbackDelay = data.agent_feedback ? 3000 : 500;
      setTimeout(async () => {
        setFeedback(null);
        setAgentFeedback(null);
        setAgentScore(null);

        if (data.is_last || !data.next_question) {
          setCompleting(true);
          try {
            const completeRes = await fetch(
              `${apiBase}/api/assessment/${sessionId}/complete`,
              { method: "POST" },
            );
            if (!completeRes.ok)
              throw new Error(`HTTP ${completeRes.status}`);
            const completeData = await completeRes.json();
            router.push(
              `/assessment/${sessionId}/report${completeData.report_id ? `?report_id=${completeData.report_id}` : ""}`,
            );
          } catch {
            setError(t("assessment.quiz.error"));
            setCompleting(false);
          }
        } else {
          setTransitioning(true);
          setTimeout(() => {
            setQuestion(data.next_question);
            setProgress(data.progress);
            setSelectedAnswer("");
            setQuestionStartTime(Date.now());
            setTransitioning(false);
          }, 300);
        }
      }, feedbackDelay);
    } catch {
      setError(t("assessment.quiz.error"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitAnswer() {
    if (!selectedAnswer || submitting || !question) return;
    await doSubmitAnswer(selectedAnswer);
  }

  // MCQ: auto-submit after selection with delay
  function handleOptionSelect(key: string) {
    if (submitting || feedback) return;
    setSelectedAnswer(key);
    setTimeout(() => {
      doSubmitAnswer(key);
    }, 200);
  }

  // Loading / completing overlay
  if (initialLoading || completing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-400 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-300">
            {completing
              ? timeExpired
                ? t("assessment.quiz.time_up")
                : t("assessment.quiz.completing")
              : t("assessment.start_loading")}
          </p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-400">
            {error || t("assessment.quiz.error")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          {/* Progress bar */}
          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300 font-medium">
              {t("assessment.quiz.progress", {
                current: progress.current,
                total: progress.total,
              })}
            </span>

            {showEncouragement && (
              <span className="text-brand-400 font-medium animate-pulse">
                {t("assessment.quiz.finishing")}
              </span>
            )}

            {/* Countdown timer */}
            <span className={`flex items-center gap-1.5 font-mono ${timerColor()}`}>
              <Clock size={14} />
              {remainingSec !== null ? formatTime(remainingSec) : "--:--"}
              {remainingSec !== null &&
                timeLimitSec !== null &&
                remainingSec / timeLimitSec <= 0.2 && (
                  <AlertTriangle size={14} className="ml-0.5" />
                )}
            </span>
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div
          className={`max-w-3xl w-full transition-all duration-300 ${
            transitioning
              ? "opacity-0 translate-x-8"
              : "opacity-100 translate-x-0"
          }`}
        >
          {/* Question stem */}
          <div className="mb-8">
            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
              {question.stem}
            </p>
            {question.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={question.image_url}
                alt="Question image"
                className="mt-4 rounded-xl max-w-full max-h-64 object-contain"
              />
            )}
          </div>

          {/* Answer area */}
          {question.type === "mcq" && question.options ? (
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option.key;
                let borderColor = "border-white/10 hover:border-white/20";
                let bgColor = "bg-white/[0.03] hover:bg-white/[0.06]";

                if (isSelected && feedback === "correct") {
                  borderColor = "border-green-500/50";
                  bgColor = "bg-green-500/10";
                } else if (isSelected && feedback === "incorrect") {
                  borderColor = "border-red-500/50";
                  bgColor = "bg-red-500/10";
                } else if (isSelected) {
                  borderColor = "border-brand-500/50";
                  bgColor = "bg-brand-500/10";
                }

                return (
                  <button
                    key={option.key}
                    onClick={() => handleOptionSelect(option.key)}
                    disabled={submitting || feedback !== null}
                    className={`w-full text-left rounded-xl border ${borderColor} ${bgColor} px-5 py-4 transition-all duration-200 flex items-center gap-4 group`}
                  >
                    <span
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${
                        isSelected
                          ? "border-brand-500 text-brand-400 bg-brand-500/10"
                          : "border-white/20 text-slate-400 group-hover:border-white/40"
                      }`}
                    >
                      {option.key}
                    </span>
                    <span className="text-slate-200 text-base">
                      {option.text}
                    </span>

                    {isSelected && feedback === "correct" && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto shrink-0" />
                    )}
                    {isSelected && feedback === "incorrect" && (
                      <XCircle className="w-5 h-5 text-red-400 ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : isSubjective ? (
            /* Short answer / essay / experiment — textarea */
            <div>
              <textarea
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder={
                  question.type === "essay"
                    ? t("assessment.quiz.essay_placeholder")
                    : t("assessment.quiz.short_answer_placeholder")
                }
                disabled={submitting || feedback !== null}
                rows={question.type === "essay" ? 8 : 4}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-colors placeholder:text-slate-600 resize-y"
              />
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>{selectedAnswer.length} {t("assessment.quiz.chars")}</span>
              </div>
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer.trim() || submitting}
                className="mt-3 w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full px-8 py-3.5 font-semibold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {t("assessment.quiz.scoring")}
                  </>
                ) : (
                  t("assessment.quiz.submit_answer")
                )}
              </button>
            </div>
          ) : (
            /* Fill-in answer */
            <div>
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="..."
                disabled={submitting || feedback !== null}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-colors placeholder:text-slate-600"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && selectedAnswer) {
                    handleSubmitAnswer();
                  }
                }}
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || submitting}
                className="mt-4 w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full px-8 py-3.5 font-semibold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {t("assessment.quiz.submitting")}
                  </>
                ) : (
                  t("assessment.quiz.submit_answer")
                )}
              </button>
            </div>
          )}

          {/* Agent scoring feedback card */}
          {feedback === "scored" && agentFeedback && (
            <div className="mt-6 rounded-xl bg-brand-500/10 border border-brand-500/20 px-5 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-brand-400" />
                <span className="text-sm font-semibold text-brand-300">
                  AI {t("assessment.quiz.scoring_result")}
                </span>
                {agentScore !== null && (
                  <span className="ml-auto text-sm font-mono text-brand-400">
                    {Math.round(agentScore * 100)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {agentFeedback}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
