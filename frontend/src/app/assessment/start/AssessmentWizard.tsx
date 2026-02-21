"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n";
import { useAnonymousId } from "../hooks/useAnonymousId";
import { useQuiz } from "../hooks/useQuiz";
import AssessmentNav from "../components/AssessmentNav";
import GradeSelector from "./components/GradeSelector";
import SubjectSelector from "./components/SubjectSelector";
import GoalSelector from "./components/GoalSelector";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const STEPS = ["grade", "subject", "goal"] as const;

export default function AssessmentWizard() {
  const { t } = useI18n();
  const router = useRouter();
  const anonymousId = useAnonymousId();
  const { startSession, loading } = useQuiz();

  const [step, setStep] = useState(0);
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  const canProceed =
    (step === 0 && grade !== "") ||
    (step === 1 && subject !== "") ||
    (step === 2 && goal !== "");

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleBegin = async () => {
    if (!anonymousId) return;
    setError("");
    const session = await startSession(subject, grade, anonymousId, goal);
    if (session) {
      router.push(`/assessment/${session.session_id}/take`);
    } else {
      setError(t("assessment.start_error"));
    }
  };

  const stepLabels = [
    t("assessment.wizard.step_grade"),
    t("assessment.wizard.step_subject"),
    t("assessment.wizard.step_goal"),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <AssessmentNav t={t} />

      <div className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {STEPS.map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  i <= step
                    ? "bg-brand-500 text-white"
                    : "bg-white/[0.06] text-slate-500 border border-white/10"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm hidden sm:block ${
                  i <= step ? "text-white" : "text-slate-500"
                }`}
              >
                {stepLabels[i]}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-12 h-px ${
                    i < step ? "bg-brand-500" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          {t("assessment.wizard.title")}
        </h1>
        <p className="text-slate-400 text-center mb-10">
          {stepLabels[step]}
        </p>

        {/* Step Content */}
        <div className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-2xl p-8">
          {step === 0 && (
            <GradeSelector t={t} selected={grade} onSelect={setGrade} />
          )}
          {step === 1 && (
            <SubjectSelector t={t} selected={subject} onSelect={setSubject} />
          )}
          {step === 2 && (
            <GoalSelector t={t} selected={goal} onSelect={setGoal} />
          )}

          {error && (
            <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              {t("assessment.wizard.back")}
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                {t("assessment.wizard.next")}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleBegin}
                disabled={!canProceed || loading}
                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t("assessment.wizard.loading")}
                  </>
                ) : (
                  <>
                    {t("assessment.wizard.begin")}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
