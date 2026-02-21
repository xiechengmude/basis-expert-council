"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { LoginModal } from "@/app/components/LoginModal";

const LandingPage = dynamic(() => import("@/app/landing/LandingContent"), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
    </div>
  ),
});

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  // After login succeeds (user changes from null → object), redirect to /chat
  const [prevUser, setPrevUser] = useState(user);
  useEffect(() => {
    if (!prevUser && user) {
      router.push("/chat?assistantId=basis-expert");
    }
    setPrevUser(user);
  }, [user, prevUser, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  const handleLoginClick = () => {
    if (user) {
      // Already logged in — go directly to chat
      router.push("/chat?assistantId=basis-expert");
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <>
      <LandingPage onLoginClick={handleLoginClick} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
