"use client";

import React, { useState } from "react";
import { Users, GraduationCap, BookOpen, Briefcase } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useI18n } from "@/i18n";
import {
  ScenarioFormModal,
  SCENARIO_FORMS,
  type ScenarioCard,
} from "./ScenarioFormModal";

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const SCENARIOS: Record<string, ScenarioCard[]> = {
  parent: [
    { titleKey: "welcome.parent.admissionPrep.title", descKey: "welcome.parent.admissionPrep.desc", promptKey: "welcome.parent.admissionPrep.prompt", icon: "🎯", tagKey: "welcome.parent.admissionPrep.tag" },
    { titleKey: "welcome.parent.gradeDiagnosis.title", descKey: "welcome.parent.gradeDiagnosis.desc", promptKey: "welcome.parent.gradeDiagnosis.prompt", icon: "📊", tagKey: "welcome.parent.gradeDiagnosis.tag" },
    { titleKey: "welcome.parent.apSelection.title", descKey: "welcome.parent.apSelection.desc", promptKey: "welcome.parent.apSelection.prompt", icon: "📚", tagKey: "welcome.parent.apSelection.tag" },
    { titleKey: "welcome.parent.probation.title", descKey: "welcome.parent.probation.desc", promptKey: "welcome.parent.probation.prompt", icon: "🆘", tagKey: "welcome.parent.probation.tag" },
    { titleKey: "welcome.parent.collegePlan.title", descKey: "welcome.parent.collegePlan.desc", promptKey: "welcome.parent.collegePlan.prompt", icon: "🎓", tagKey: "welcome.parent.collegePlan.tag" },
    { titleKey: "welcome.parent.schoolCompare.title", descKey: "welcome.parent.schoolCompare.desc", promptKey: "welcome.parent.schoolCompare.prompt", icon: "⚖️", tagKey: "welcome.parent.schoolCompare.tag" },
    { titleKey: "welcome.parent.summerPlan.title", descKey: "welcome.parent.summerPlan.desc", promptKey: "welcome.parent.summerPlan.prompt", icon: "☀️", tagKey: "welcome.parent.summerPlan.tag" },
  ],
  student: [
    { titleKey: "welcome.student.homework.title", descKey: "welcome.student.homework.desc", promptKey: "welcome.student.homework.prompt", icon: "✏️", tagKey: "welcome.student.homework.tag" },
    { titleKey: "welcome.student.math.title", descKey: "welcome.student.math.desc", promptKey: "welcome.student.math.prompt", icon: "🔢", tagKey: "welcome.student.math.tag" },
    { titleKey: "welcome.student.science.title", descKey: "welcome.student.science.desc", promptKey: "welcome.student.science.prompt", icon: "🔬", tagKey: "welcome.student.science.tag" },
    { titleKey: "welcome.student.humanities.title", descKey: "welcome.student.humanities.desc", promptKey: "welcome.student.humanities.prompt", icon: "📝", tagKey: "welcome.student.humanities.tag" },
    { titleKey: "welcome.student.apPrep.title", descKey: "welcome.student.apPrep.desc", promptKey: "welcome.student.apPrep.prompt", icon: "🎓", tagKey: "welcome.student.apPrep.tag" },
    { titleKey: "welcome.student.examCram.title", descKey: "welcome.student.examCram.desc", promptKey: "welcome.student.examCram.prompt", icon: "⚡", tagKey: "welcome.student.examCram.tag" },
    { titleKey: "welcome.student.essayReview.title", descKey: "welcome.student.essayReview.desc", promptKey: "welcome.student.essayReview.prompt", icon: "📄", tagKey: "welcome.student.essayReview.tag" },
    { titleKey: "welcome.student.studyPlan.title", descKey: "welcome.student.studyPlan.desc", promptKey: "welcome.student.studyPlan.prompt", icon: "📅", tagKey: "welcome.student.studyPlan.tag" },
  ],
  teacher: [
    { titleKey: "welcome.teacher.lessonPlan.title", descKey: "welcome.teacher.lessonPlan.desc", promptKey: "welcome.teacher.lessonPlan.prompt", icon: "🎪", tagKey: "welcome.teacher.lessonPlan.tag" },
    { titleKey: "welcome.teacher.emi.title", descKey: "welcome.teacher.emi.desc", promptKey: "welcome.teacher.emi.prompt", icon: "💬", tagKey: "welcome.teacher.emi.tag" },
    { titleKey: "welcome.teacher.diffInstruction.title", descKey: "welcome.teacher.diffInstruction.desc", promptKey: "welcome.teacher.diffInstruction.prompt", icon: "📊", tagKey: "welcome.teacher.diffInstruction.tag" },
    { titleKey: "welcome.teacher.parentMeeting.title", descKey: "welcome.teacher.parentMeeting.desc", promptKey: "welcome.teacher.parentMeeting.prompt", icon: "🤝", tagKey: "welcome.teacher.parentMeeting.tag" },
    { titleKey: "welcome.teacher.strugglingStudent.title", descKey: "welcome.teacher.strugglingStudent.desc", promptKey: "welcome.teacher.strugglingStudent.prompt", icon: "🆘", tagKey: "welcome.teacher.strugglingStudent.tag" },
    { titleKey: "welcome.teacher.classroomWow.title", descKey: "welcome.teacher.classroomWow.desc", promptKey: "welcome.teacher.classroomWow.prompt", icon: "✨", tagKey: "welcome.teacher.classroomWow.tag" },
  ],
  consultant: [
    { titleKey: "welcome.consultant.leadResearch.title", descKey: "welcome.consultant.leadResearch.desc", promptKey: "welcome.consultant.leadResearch.prompt", icon: "📋", tagKey: "welcome.consultant.leadResearch.tag" },
    { titleKey: "welcome.consultant.icebreaker.title", descKey: "welcome.consultant.icebreaker.desc", promptKey: "welcome.consultant.icebreaker.prompt", icon: "🗣️", tagKey: "welcome.consultant.icebreaker.tag" },
    { titleKey: "welcome.consultant.needsAssess.title", descKey: "welcome.consultant.needsAssess.desc", promptKey: "welcome.consultant.needsAssess.prompt", icon: "🔍", tagKey: "welcome.consultant.needsAssess.tag" },
    { titleKey: "welcome.consultant.objection.title", descKey: "welcome.consultant.objection.desc", promptKey: "welcome.consultant.objection.prompt", icon: "🛡️", tagKey: "welcome.consultant.objection.tag" },
    { titleKey: "welcome.consultant.closing.title", descKey: "welcome.consultant.closing.desc", promptKey: "welcome.consultant.closing.prompt", icon: "🤝", tagKey: "welcome.consultant.closing.tag" },
    { titleKey: "welcome.consultant.afterSales.title", descKey: "welcome.consultant.afterSales.desc", promptKey: "welcome.consultant.afterSales.prompt", icon: "💬", tagKey: "welcome.consultant.afterSales.tag" },
  ],
};

const TAB_KEYS: { value: string; labelKey: string; icon: typeof Users }[] = [
  { value: "parent", labelKey: "welcome.role.parent", icon: Users },
  { value: "student", labelKey: "welcome.role.student", icon: GraduationCap },
  { value: "teacher", labelKey: "welcome.role.teacher", icon: BookOpen },
  { value: "consultant", labelKey: "welcome.role.consultant", icon: Briefcase },
];

export function WelcomeScreen({ onSendMessage, disabled }: WelcomeScreenProps) {
  const [activeTab, setActiveTab] = useState("parent");
  const [selectedScenario, setSelectedScenario] = useState<ScenarioCard | null>(null);
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
        className="w-full max-w-3xl"
      >
        <TabsList className="mx-auto mb-6 grid w-full max-w-md grid-cols-4">
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
                  onClick={() => {
                    if (SCENARIO_FORMS[card.titleKey]) {
                      setSelectedScenario(card);
                    } else {
                      onSendMessage(t(card.promptKey));
                    }
                  }}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-brand-600/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="mt-0.5 text-xl leading-none">
                    {card.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-primary group-hover:text-brand-600">
                        {t(card.titleKey)}
                      </h3>
                      <span className="inline-flex shrink-0 items-center rounded-full bg-brand-600/10 px-2 py-0.5 text-[10px] font-medium text-brand-600">
                        {t(card.tagKey)}
                      </span>
                    </div>
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

      {selectedScenario && (
        <ScenarioFormModal
          onClose={() => setSelectedScenario(null)}
          onSubmit={(enrichedPrompt) => {
            onSendMessage(enrichedPrompt);
            setSelectedScenario(null);
          }}
          scenario={selectedScenario}
          t={t}
        />
      )}
    </div>
  );
}
