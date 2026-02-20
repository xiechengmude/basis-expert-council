"use client";

import { useEffect } from "react";
import { useLandingI18n } from "./i18n";
import LandingNav from "./components/LandingNav";
import HeroSection from "./components/HeroSection";
import PainPointsSection from "./components/PainPointsSection";
import FeaturesSection from "./components/FeaturesSection";
import AgentsSection from "./components/AgentsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import LandingFooter from "./components/LandingFooter";

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

export default function LandingPage() {
  const { locale, setLocale, t } = useLandingI18n();
  useScrollReveal();

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      <LandingNav t={t} locale={locale} setLocale={setLocale} />
      <HeroSection t={t} />
      <PainPointsSection t={t} />
      <FeaturesSection t={t} />
      <AgentsSection t={t} />
      <HowItWorksSection t={t} />
      <PricingSection t={t} />
      <FAQSection t={t} />
      <CTASection t={t} />
      <LandingFooter t={t} />
    </div>
  );
}
