"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useKyc } from "@/providers/KycGuard";
import { RoleSelector } from "@/app/components/onboarding/RoleSelector";
import { StudentProfileForm } from "@/app/components/onboarding/StudentProfileForm";
import { ParentLinkForm } from "@/app/components/onboarding/ParentLinkForm";
import { TeacherCompleteForm } from "@/app/components/onboarding/TeacherCompleteForm";

type Step = "role" | "profile";
type Role = "student" | "parent" | "teacher";

export default function OnboardingPage() {
  const router = useRouter();
  const { refreshKycStatus } = useKyc();
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4 py-8">
      <div className="w-full max-w-[440px]">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 shadow-lg">
            <Image
              src="/logo-mark-filled.svg"
              alt="BasisPilot"
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            完善你的资料
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            帮助我们为你提供更精准的学习建议
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/60 ring-1 ring-gray-100">
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
      </div>
    </div>
  );
}
