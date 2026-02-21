"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { X } from "lucide-react";

// ── Types ──────────────────────────────────────────────

export interface ScenarioCard {
  titleKey: string;
  descKey: string;
  promptKey: string;
  icon: string;
  tagKey: string;
}

type FormFieldType = "select" | "multiSelect" | "text" | "textarea";

interface FormFieldOption {
  labelKey: string;
  value: string;
}

interface FormField {
  key: string;
  labelKey: string;
  type: FormFieldType;
  options?: FormFieldOption[];
  required?: boolean;
  placeholderKey?: string;
}

// ── Shared Option Sets ─────────────────────────────────

const GRADE_OPTIONS: FormFieldOption[] = Array.from({ length: 12 }, (_, i) => ({
  labelKey: `welcome.form.grade.g${i + 1}`,
  value: `G${i + 1}`,
}));

const CAMPUS_OPTIONS: FormFieldOption[] = [
  { labelKey: "welcome.form.campus.shenzhen", value: "深圳贝赛思" },
  { labelKey: "welcome.form.campus.guangzhou", value: "广州贝赛思" },
  { labelKey: "welcome.form.campus.hangzhou", value: "杭州贝赛思" },
  { labelKey: "welcome.form.campus.huizhou", value: "惠州贝赛思" },
  { labelKey: "welcome.form.campus.nanjing", value: "南京贝赛思" },
  { labelKey: "welcome.form.campus.chengdu", value: "成都贝赛思" },
  { labelKey: "welcome.form.campus.wuhan", value: "武汉贝赛思" },
];

const SUBJECT_OPTIONS: FormFieldOption[] = [
  { labelKey: "welcome.form.subject.math", value: "Math" },
  { labelKey: "welcome.form.subject.physics", value: "Physics" },
  { labelKey: "welcome.form.subject.chemistry", value: "Chemistry" },
  { labelKey: "welcome.form.subject.biology", value: "Biology" },
  { labelKey: "welcome.form.subject.ela", value: "ELA" },
  { labelKey: "welcome.form.subject.history", value: "History" },
  { labelKey: "welcome.form.subject.worldLang", value: "World Languages" },
  { labelKey: "welcome.form.subject.arts", value: "Arts" },
];

const SCHOOL_TYPE_OPTIONS: FormFieldOption[] = [
  { labelKey: "welcome.form.schoolType.public", value: "公立" },
  { labelKey: "welcome.form.schoolType.international", value: "国际" },
  { labelKey: "welcome.form.schoolType.private", value: "民办" },
];

const ENGLISH_LEVEL_OPTIONS: FormFieldOption[] = [
  { labelKey: "welcome.form.englishLevel.beginner", value: "入门" },
  { labelKey: "welcome.form.englishLevel.intermediate", value: "中级" },
  { labelKey: "welcome.form.englishLevel.advanced", value: "高级" },
];

const SCIENCE_SUBJECT_OPTIONS: FormFieldOption[] = [
  { labelKey: "welcome.form.subject.physics", value: "Physics" },
  { labelKey: "welcome.form.subject.chemistry", value: "Chemistry" },
  { labelKey: "welcome.form.subject.biology", value: "Biology" },
];

const HUM_SUBJECT_OPTIONS: FormFieldOption[] = [
  { labelKey: "welcome.form.subject.ela", value: "ELA" },
  { labelKey: "welcome.form.subject.history", value: "History" },
];

const ASSIGNMENT_TYPE_OPTIONS: FormFieldOption[] = [
  { labelKey: "welcome.form.assignmentType.essay", value: "Essay" },
  { labelKey: "welcome.form.assignmentType.analysis", value: "Analysis" },
  { labelKey: "welcome.form.assignmentType.dbq", value: "DBQ" },
  { labelKey: "welcome.form.assignmentType.reading", value: "Reading" },
];

const EXAM_MONTH_OPTIONS: FormFieldOption[] = [
  { labelKey: "welcome.form.examMonth.may", value: "May" },
  { labelKey: "welcome.form.examMonth.other", value: "Other" },
];

// ── Per-Scenario Form Definitions ──────────────────────

export const SCENARIO_FORMS: Record<string, FormField[]> = {
  // Parent scenarios
  "welcome.parent.admissionPrep.title": [
    { key: "grade", labelKey: "welcome.form.grade", type: "select", options: GRADE_OPTIONS, required: true },
    { key: "campus", labelKey: "welcome.form.campus", type: "select", options: CAMPUS_OPTIONS, required: true },
    { key: "currentSchoolType", labelKey: "welcome.form.schoolType", type: "select", options: SCHOOL_TYPE_OPTIONS, required: true },
    { key: "englishLevel", labelKey: "welcome.form.englishLevel", type: "select", options: ENGLISH_LEVEL_OPTIONS, required: true },
  ],
  "welcome.parent.gradeDiagnosis.title": [
    { key: "grade", labelKey: "welcome.form.grade", type: "select", options: GRADE_OPTIONS, required: true },
    { key: "campus", labelKey: "welcome.form.campus", type: "select", options: CAMPUS_OPTIONS },
    { key: "subjects", labelKey: "welcome.form.subjects", type: "multiSelect", options: SUBJECT_OPTIONS, required: true },
    { key: "currentGPA", labelKey: "welcome.form.gpa", type: "text", placeholderKey: "welcome.form.gpa.placeholder" },
  ],
  "welcome.parent.apSelection.title": [
    { key: "grade", labelKey: "welcome.form.grade", type: "select", options: GRADE_OPTIONS, required: true },
    { key: "interests", labelKey: "welcome.form.interests", type: "multiSelect", options: SUBJECT_OPTIONS, required: true },
    { key: "apsTaken", labelKey: "welcome.form.apsTaken", type: "text", placeholderKey: "welcome.form.apsTaken.placeholder" },
  ],
  "welcome.parent.probation.title": [
    { key: "grade", labelKey: "welcome.form.grade", type: "select", options: GRADE_OPTIONS, required: true },
    { key: "campus", labelKey: "welcome.form.campus", type: "select", options: CAMPUS_OPTIONS },
    { key: "probationSubjects", labelKey: "welcome.form.probationSubjects", type: "multiSelect", options: SUBJECT_OPTIONS, required: true },
    { key: "currentGPA", labelKey: "welcome.form.gpa", type: "text", placeholderKey: "welcome.form.gpa.placeholder" },
  ],
  // Student scenarios
  "welcome.student.math.title": [
    { key: "grade", labelKey: "welcome.form.grade", type: "select", options: GRADE_OPTIONS, required: true },
    { key: "topic", labelKey: "welcome.form.topic", type: "text", placeholderKey: "welcome.form.topic.math.placeholder" },
    { key: "question", labelKey: "welcome.form.question", type: "textarea", placeholderKey: "welcome.form.question.placeholder" },
  ],
  "welcome.student.science.title": [
    { key: "grade", labelKey: "welcome.form.grade", type: "select", options: GRADE_OPTIONS, required: true },
    { key: "scienceSubject", labelKey: "welcome.form.scienceSubject", type: "select", options: SCIENCE_SUBJECT_OPTIONS, required: true },
    { key: "topic", labelKey: "welcome.form.topic", type: "text", placeholderKey: "welcome.form.topic.science.placeholder" },
  ],
  "welcome.student.humanities.title": [
    { key: "grade", labelKey: "welcome.form.grade", type: "select", options: GRADE_OPTIONS, required: true },
    { key: "humSubject", labelKey: "welcome.form.humSubject", type: "select", options: HUM_SUBJECT_OPTIONS, required: true },
    { key: "assignmentType", labelKey: "welcome.form.assignmentType", type: "select", options: ASSIGNMENT_TYPE_OPTIONS, required: true },
  ],
  "welcome.student.apPrep.title": [
    { key: "grade", labelKey: "welcome.form.grade", type: "select", options: GRADE_OPTIONS, required: true },
    { key: "apSubject", labelKey: "welcome.form.apSubject", type: "text", placeholderKey: "welcome.form.apSubject.placeholder", required: true },
    { key: "examMonth", labelKey: "welcome.form.examMonth", type: "select", options: EXAM_MONTH_OPTIONS },
  ],
  // Teacher scenarios
  "welcome.teacher.lessonPlan.title": [
    { key: "subject", labelKey: "welcome.form.teachSubject", type: "select", options: SUBJECT_OPTIONS, required: true },
    { key: "gradeLevel", labelKey: "welcome.form.gradeLevel", type: "select", options: GRADE_OPTIONS, required: true },
    { key: "topic", labelKey: "welcome.form.topic", type: "text", placeholderKey: "welcome.form.topic.lesson.placeholder", required: true },
  ],
  "welcome.teacher.emi.title": [
    { key: "subject", labelKey: "welcome.form.teachSubject", type: "select", options: SUBJECT_OPTIONS, required: true },
    { key: "gradeLevel", labelKey: "welcome.form.gradeLevel", type: "select", options: GRADE_OPTIONS, required: true },
    { key: "challenge", labelKey: "welcome.form.challenge", type: "textarea", placeholderKey: "welcome.form.challenge.placeholder" },
  ],
};

// ── Prompt Enrichment ──────────────────────────────────

const FIELD_LABEL_MAP: Record<string, string> = {
  grade: "年级/Grade",
  campus: "校区/Campus",
  currentSchoolType: "当前学校类型/School Type",
  englishLevel: "英语水平/English Level",
  subjects: "关注学科/Subjects",
  currentGPA: "当前GPA/Current GPA",
  interests: "兴趣学科/Interests",
  apsTaken: "已修AP数量/APs Taken",
  probationSubjects: "保级学科/Probation Subjects",
  topic: "主题/Topic",
  question: "问题描述/Question",
  scienceSubject: "科学学科/Science Subject",
  humSubject: "人文学科/Humanities Subject",
  assignmentType: "作业类型/Assignment Type",
  apSubject: "AP科目/AP Subject",
  examMonth: "考试月份/Exam Month",
  subject: "学科/Subject",
  gradeLevel: "年级/Grade Level",
  challenge: "教学挑战/Challenge",
};

function buildEnrichedPrompt(
  originalPrompt: string,
  formData: Record<string, string | string[]>,
  fields: FormField[],
): string {
  const lines: string[] = [];
  for (const field of fields) {
    const value = formData[field.key];
    if (!value || (Array.isArray(value) && value.length === 0)) continue;
    const label = FIELD_LABEL_MAP[field.key] || field.key;
    const displayValue = Array.isArray(value) ? value.join(", ") : value;
    lines.push(`- ${label}: ${displayValue}`);
  }
  if (lines.length === 0) return originalPrompt;
  return `${originalPrompt}\n\n---\n用户信息 / User Context:\n${lines.join("\n")}`;
}

// ── Component ──────────────────────────────────────────

interface ScenarioFormModalProps {
  onClose: () => void;
  onSubmit: (enrichedPrompt: string) => void;
  scenario: ScenarioCard;
  t: (key: string) => string;
}

export function ScenarioFormModal({
  onClose,
  onSubmit,
  scenario,
  t,
}: ScenarioFormModalProps) {
  const fields = SCENARIO_FORMS[scenario.titleKey];
  const [formData, setFormData] = useState<Record<string, string | string[]>>(
    {},
  );

  // Lock body scroll & handle Escape key
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleChange = useCallback(
    (key: string, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleMultiSelect = useCallback((key: string, value: string) => {
    setFormData((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const isValid = useMemo(() => {
    if (!fields) return true;
    return fields
      .filter((f) => f.required)
      .every((f) => {
        const v = formData[f.key];
        if (Array.isArray(v)) return v.length > 0;
        return typeof v === "string" && v.trim() !== "";
      });
  }, [fields, formData]);

  const handleSubmit = useCallback(() => {
    if (!isValid || !fields) return;
    const originalPrompt = t(scenario.promptKey);
    const enriched = buildEnrichedPrompt(originalPrompt, formData, fields);
    onSubmit(enriched);
  }, [isValid, formData, fields, scenario.promptKey, t, onSubmit]);

  if (!fields) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-6 pt-6 pb-4">
          <span className="text-2xl">{scenario.icon}</span>
          <h3 className="flex-1 text-lg font-semibold text-primary">
            {t(scenario.titleKey)}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 px-6 py-5">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                {t(field.labelKey)}
                {field.required && (
                  <span className="ml-0.5 text-red-500">*</span>
                )}
              </label>

              {field.type === "select" && (
                <select
                  value={(formData[field.key] as string) || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">
                    {t("welcome.form.selectPlaceholder")}
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "multiSelect" && (
                <div className="flex flex-wrap gap-2">
                  {field.options?.map((opt) => {
                    const selected = (
                      (formData[field.key] as string[]) || []
                    ).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleMultiSelect(field.key, opt.value)}
                        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                          selected
                            ? "border-brand-500 bg-brand-600/10 font-medium text-brand-600"
                            : "border-border text-muted-foreground hover:border-brand-400/50"
                        }`}
                      >
                        {t(opt.labelKey)}
                      </button>
                    );
                  })}
                </div>
              )}

              {field.type === "text" && (
                <input
                  type="text"
                  value={(formData[field.key] as string) || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={
                    field.placeholderKey ? t(field.placeholderKey) : ""
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  rows={3}
                  value={(formData[field.key] as string) || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={
                    field.placeholderKey ? t(field.placeholderKey) : ""
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            {t("welcome.form.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("welcome.form.start")}
          </button>
        </div>
      </div>
    </div>
  );
}
