"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useKyc } from "@/providers/KycGuard";
import { RoleSelector } from "@/app/components/onboarding/RoleSelector";
import { StudentProfileForm } from "@/app/components/onboarding/StudentProfileForm";
import { ParentLinkForm } from "@/app/components/onboarding/ParentLinkForm";
import { TeacherCompleteForm } from "@/app/components/onboarding/TeacherCompleteForm";

type Step = "role" | "profile";
type Role = "student" | "parent" | "teacher";

export default function OnboardingPage() {
  const router = useRouter();
  const { kycCompleted, refreshKycStatus } = useKyc();
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);

  const isEditMode = kycCompleted === true;

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
            {isEditMode ? "更新你的资料" : "完善你的资料"}
          </h1>
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-gray-500">
            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            {isEditMode
              ? "修改你的学习画像，获得更精准的 AI 建议"
              : "帮助我们为你提供更精准的 AI 学习建议"}
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-sm sm:p-8">
          {step === "role" && (
            <RoleSelector onSelect={handleRoleSelected} />
          )}

          {step === "profile" && role === "student" && (
            <StudentProfileForm
              onComplete={handleComplete}
              onBack={handleBackToRole}
            />
          )}

          {step === "profile" && role === "parent" && (
            <ParentLinkForm
              onComplete={handleComplete}
              onBack={handleBackToRole}
            />
          )}

          {step === "profile" && role === "teacher" && (
            <TeacherCompleteForm
              onComplete={handleComplete}
              onBack={handleBackToRole}
            />
          )}
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          这些信息仅用于个性化推荐，你随时可以在设置中修改
        </p>

        {/* Edit mode: back to main page link */}
        {isEditMode && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              返回主页
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
