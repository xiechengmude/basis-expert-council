"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getBasisToken, fetchWithAuth } from "@/app/hooks/useUser";
import { useI18n } from "@/i18n";

interface KycContextType {
  kycCompleted: boolean | null;
  refreshKycStatus: () => Promise<void>;
}

const KycContext = createContext<KycContextType>({
  kycCompleted: null,
  refreshKycStatus: async () => {},
});

export function useKyc() {
  return useContext(KycContext);
}

/** Routes that do not require KYC completion */
const KYC_WHITELIST = ["/login", "/landing", "/onboarding"];

export function KycGuard({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [kycCompleted, setKycCompleted] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  const isWhitelisted = KYC_WHITELIST.some((p) => pathname.startsWith(p));

  const fetchKycStatus = useCallback(async () => {
    const token = getBasisToken();
    if (!token) {
      setKycCompleted(null);
      setChecking(false);
      return;
    }

    try {
      const res = await fetchWithAuth("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setKycCompleted(Boolean(data.kyc_completed));
      } else {
        setKycCompleted(null);
      }
    } catch {
      setKycCompleted(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    fetchKycStatus();
  }, [fetchKycStatus]);

  // Redirect logic after KYC status is known
  useEffect(() => {
    if (checking) return;

    const token = getBasisToken();
    if (!token) return; // Not logged in — let AuthProvider/middleware handle

    if (kycCompleted === false && !isWhitelisted) {
      router.replace("/onboarding");
    }
    // Note: users who completed KYC can still visit /onboarding to update their profile
  }, [checking, kycCompleted, isWhitelisted, pathname, router]);

  // Loading state
  if (checking && !isWhitelisted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-600" />
          <p className="mt-3 text-sm text-gray-400">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <KycContext.Provider value={{ kycCompleted, refreshKycStatus: fetchKycStatus }}>
      {children}
    </KycContext.Provider>
  );
}
