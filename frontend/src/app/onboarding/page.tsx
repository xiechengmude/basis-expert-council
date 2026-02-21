"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, Loader2 } from "lucide-react";
import { useKyc } from "@/providers/KycGuard";
import { useUser } from "@/app/hooks/useUser";
import { RoleSelector } from "@/app/components/onboarding/RoleSelector";
import { StudentProfileForm } from "@/app/components/onboarding/StudentProfileForm";
import type { StudentProfileData } from "@/app/components/onboarding/StudentProfileForm";
import { ParentLinkForm } from "@/app/components/onboarding/ParentLinkForm";
import { TeacherCompleteForm } from "@/app/components/onboarding/TeacherCompleteForm";
import { useI18n } from "@/i18n";

type Step = "role" | "profile";
type Role = "student" | "parent" | "teacher";
const VALID_ROLES: Role[] = ["student", "parent", "teacher"];

export default function OnboardingPage() {
  const router = useRouter();
  const { kycCompleted, refreshKycStatus } = useKyc();
  const { profile, loading: profileLoading } = useUser();
  const { t } = useI18n();
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [studentInitialData, setStudentInitialData] = useState<StudentProfileData | null>(null);
  const [initialized, setInitialized] = useState(false);

  const isEditMode = kycCompleted === true;

  // Pre-populate from existing profile
  useEffect(() => {
    if (profileLoading || initialized) return;
    if (profile) {
      const savedRole = profile.user.role as Role;
      if (VALID_ROLES.includes(savedRole)) {
        setRole(savedRole);
        // In edit mode, skip directly to profile step
        if (isEditMode) {
          setStep("profile");
        }
      }
      if (savedRole === "student" && profile.student_profile) {
        setStudentInitialData(profile.student_profile as StudentProfileData);
      }
    }
    setInitialized(true);
  }, [profileLoading, profile, isEditMode, initialized]);

  const handleRoleSelected = (selectedRole: Role) => {
    setRole(selectedRole);
    setStep("profile");
  };

  const handleComplete = async () => {
    await refreshKycStatus();
    router.replace("/");
  };

  const handleBackToRole = () => {
    setStep("role");
    setRole(null);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-brand-50 via-white to-gray-50 px-4 py-8">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-brand-100/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-50/50 blur-2xl" />

      <div className="relative w-full max-w-[480px]">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <Image
            src="/logo-mark.svg"
            alt="BasisPilot"
            width={64}
            height={64}
            className="mx-auto mb-4 h-16 w-16 drop-shadow-lg"
          />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {isEditMode ? t("onboarding.title.edit") : t("onboarding.title.new")}
          </h1>
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-gray-500">
            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            {isEditMode
              ? t("onboarding.subtitle.edit")
              : t("onboarding.subtitle.new")}
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-sm sm:p-8">
          {!initialized ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            </div>
          ) : step === "role" ? (
            <RoleSelector onSelect={handleRoleSelected} defaultRole={role ?? undefined} />
          ) : null}

          {initialized && step === "profile" && role === "student" && (
            <StudentProfileForm
              onComplete={handleComplete}
              onBack={handleBackToRole}
              initialData={studentInitialData}
            />
          )}

          {initialized && step === "profile" && role === "parent" && (
            <ParentLinkForm
              onComplete={handleComplete}
              onBack={handleBackToRole}
            />
          )}

          {initialized && step === "profile" && role === "teacher" && (
            <TeacherCompleteForm
              onComplete={handleComplete}
              onBack={handleBackToRole}
            />
          )}
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          {t("onboarding.footer")}
        </p>

        {/* Edit mode: back to main page link */}
        {isEditMode && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              {t("onboarding.backToHome")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
