"use client";

import React, { useState, useMemo } from "react";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useI18n } from "@/i18n";

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

interface ScenarioCard {
  titleKey: string;
  descKey: string;
  promptKey: string;
  icon: string;
}

const SCENARIOS: Record<string, ScenarioCard[]> = {
  parent: [
    { titleKey: "welcome.parent.admissionPrep.title", descKey: "welcome.parent.admissionPrep.desc", promptKey: "welcome.parent.admissionPrep.prompt", icon: "🎯" },
    { titleKey: "welcome.parent.gradeDiagnosis.title", descKey: "welcome.parent.gradeDiagnosis.desc", promptKey: "welcome.parent.gradeDiagnosis.prompt", icon: "📊" },
    { titleKey: "welcome.parent.apSelection.title", descKey: "welcome.parent.apSelection.desc", promptKey: "welcome.parent.apSelection.prompt", icon: "📚" },
    { titleKey: "welcome.parent.probation.title", descKey: "welcome.parent.probation.desc", promptKey: "welcome.parent.probation.prompt", icon: "🆘" },
  ],
  student: [
    { titleKey: "welcome.student.math.title", descKey: "welcome.student.math.desc", promptKey: "welcome.student.math.prompt", icon: "🔢" },
    { titleKey: "welcome.student.science.title", descKey: "welcome.student.science.desc", promptKey: "welcome.student.science.prompt", icon: "🔬" },
    { titleKey: "welcome.student.humanities.title", descKey: "welcome.student.humanities.desc", promptKey: "welcome.student.humanities.prompt", icon: "📝" },
    { titleKey: "welcome.student.apPrep.title", descKey: "welcome.student.apPrep.desc", promptKey: "welcome.student.apPrep.prompt", icon: "🎓" },
  ],
  teacher: [
    { titleKey: "welcome.teacher.lessonPlan.title", descKey: "welcome.teacher.lessonPlan.desc", promptKey: "welcome.teacher.lessonPlan.prompt", icon: "📋" },
    { titleKey: "welcome.teacher.emi.title", descKey: "welcome.teacher.emi.desc", promptKey: "welcome.teacher.emi.prompt", icon: "🌐" },
  ],
};

const TAB_KEYS: { value: string; labelKey: string; icon: typeof Users }[] = [
  { value: "parent", labelKey: "welcome.role.parent", icon: Users },
  { value: "student", labelKey: "welcome.role.student", icon: GraduationCap },
  { value: "teacher", labelKey: "welcome.role.teacher", icon: BookOpen },
];

export function WelcomeScreen({ onSendMessage, disabled }: WelcomeScreenProps) {
  const [activeTab, setActiveTab] = useState("parent");
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center px-4 py-8 sm:py-12">
      {/* Hero */}
      <div className="mb-8 text-center sm:mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          {t("welcome.title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {t("welcome.subtitle")}
        </p>
      </div>

      {/* Role Tabs + Scenario Cards */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-2xl"
      >
        <TabsList className="mx-auto mb-6 grid w-full max-w-sm grid-cols-3">
          {TAB_KEYS.map(({ value, labelKey, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="gap-1.5"
            >
              <Icon size={16} />
              {t(labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_KEYS.map(({ value }) => (
          <TabsContent key={value} value={value}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SCENARIOS[value].map((card) => (
                <button
                  key={card.titleKey}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSendMessage(t(card.promptKey))}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-brand-600/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="mt-0.5 text-xl leading-none">
                    {card.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-primary group-hover:text-brand-600">
                      {t(card.titleKey)}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {t(card.descKey)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
