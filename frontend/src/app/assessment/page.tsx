"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n";
import AssessmentNav from "./components/AssessmentNav";
import AssessmentHero from "./components/AssessmentHero";
import AssessmentTypes from "./components/AssessmentTypes";
import TrustSection from "./components/TrustSection";
import AssessmentFooter from "./components/AssessmentFooter";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("opacity-0", "translate-y-6");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

export default function AssessmentLandingPage() {
  const { t } = useI18n();
  useScrollReveal();

  return (
    <div className="min-h-screen bg-slate-950 text-gray-900 scroll-smooth">
      <AssessmentNav t={t} />
      <AssessmentHero t={t} />
      <AssessmentTypes t={t} />
      <TrustSection t={t} />
      <AssessmentFooter t={t} />
    </div>
  );
}
