"use client";

import { useState } from "react";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  School,
  BookOpen,
  Brain,
  Check,
} from "lucide-react";
import { fetchWithAuth } from "@/app/hooks/useUser";
import { StepIndicator } from "./StepIndicator";
import { useI18n } from "@/i18n";

export interface StudentProfileData {
  school_name?: string;
  grade?: string;
  enrollment_year?: number;
  ap_courses?: string[];
  current_gpa?: number;
  weak_subjects?: string[];
  strong_subjects?: string[];
}

interface StudentProfileFormProps {
  onComplete: () => void;
  onBack: () => void;
  initialData?: StudentProfileData | null;
}

const BASIS_SCHOOLS = [
  "BASIS Bilingual Shenzhen",
  "BASIS International Shenzhen",
  "BASIS International Guangzhou",
  "BASIS International Hangzhou",
  "BASIS International Nanjing",
  "BASIS International Chengdu",
  "BASIS International Wuhan",
  "BASIS International Huizhou",
  "BASIS International Beijing",
];

const GRADES = [
  "G1", "G2", "G3", "G4", "G5", "G6",
  "G7", "G8", "G9", "G10", "G11", "G12",
];

const ENROLLMENT_YEARS = Array.from({ length: 9 }, (_, i) => 2018 + i);

const AP_COURSE_GROUP_KEYS: { groupKey: string; courses: string[] }[] = [
  {
    groupKey: "student.group.math",
    courses: [
      "AP Calculus AB", "AP Calculus BC", "AP Statistics",
      "AP Computer Science A", "AP Computer Science Principles",
    ],
  },
  {
    groupKey: "student.group.science",
    courses: [
      "AP Physics 1", "AP Physics 2", "AP Physics C: Mech", "AP Physics C: E&M",
      "AP Chemistry", "AP Biology", "AP Environmental Science",
    ],
  },
  {
    groupKey: "student.group.humanities",
    courses: [
      "AP English Language", "AP English Literature",
      "AP US History", "AP World History", "AP European History",
      "AP Psychology", "AP Human Geography",
      "AP Microeconomics", "AP Macroeconomics",
    ],
  },
  {
    groupKey: "student.group.languages",
    courses: [
      "AP Chinese", "AP Spanish", "AP French",
      "AP Art History", "AP Music Theory", "AP Studio Art",
    ],
  },
];

// Subject keys map to i18n keys like "subject.math"
const SUBJECT_KEYS = [
  "subject.math", "subject.physics", "subject.chemistry", "subject.biology", "subject.english",
  "subject.history", "subject.geography", "subject.economics", "subject.cs",
  "subject.chinese", "subject.spanish", "subject.french", "subject.music", "subject.art",
];

export function StudentProfileForm({ onComplete, onBack, initialData }: StudentProfileFormProps) {
  const { t } = useI18n();
  const [subStep, setSubStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const SUB_STEPS = [t("student.step.school"), t("student.step.courses"), t("student.step.preferences")];

  // Step 1: School info
  const [schoolName, setSchoolName] = useState(initialData?.school_name ?? "");
  const [grade, setGrade] = useState(initialData?.grade ?? "");
  const [enrollmentYear, setEnrollmentYear] = useState<number | "">(initialData?.enrollment_year ?? "");

  // Step 2: Course info
  const [apCourses, setApCourses] = useState<string[]>(initialData?.ap_courses ?? []);
  const [currentGpa, setCurrentGpa] = useState(initialData?.current_gpa != null ? String(initialData.current_gpa) : "");

  // Step 3: Learning prefs — store translated labels for display, but send translated values
  const [weakSubjects, setWeakSubjects] = useState<string[]>(initialData?.weak_subjects ?? []);
  const [strongSubjects, setStrongSubjects] = useState<string[]>(initialData?.strong_subjects ?? []);

  const toggleTag = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const canProceedStep0 = schoolName && grade;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const profileRes = await fetchWithAuth("/api/student/profile", {
        method: "PUT",
        body: JSON.stringify({
          school_name: schoolName,
          grade,
          enrollment_year: enrollmentYear || undefined,
          ap_courses: apCourses.length > 0 ? apCourses : undefined,
          current_gpa: currentGpa ? parseFloat(currentGpa) : undefined,
          weak_subjects: weakSubjects.length > 0 ? weakSubjects : undefined,
          strong_subjects: strongSubjects.length > 0 ? strongSubjects : undefined,
        }),
      });

      if (!profileRes.ok) {
        const data = await profileRes.json();
        setError(data.error || t("student.error.saveFailed"));
        return;
      }

      const kycRes = await fetchWithAuth("/api/user/complete-kyc", {
        method: "POST",
      });

      if (!kycRes.ok) {
        const data = await kycRes.json();
        setError(data.error || t("student.error.kycFailed"));
        return;
      }

      onComplete();
    } catch {
      setError(t("student.error.network"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <StepIndicator steps={SUB_STEPS} current={subStep} />

      {/* Sub-step 0: School info */}
      {subStep === 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
              <School className="h-4 w-4 text-brand-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{t("student.school.title")}</h3>
              <p className="text-xs text-gray-400">{t("student.school.desc")}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-xl bg-gray-50/80 p-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                {t("student.label.school")} <span className="text-red-500">*</span>
              </label>
              <select
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              >
                <option value="">{t("student.placeholder.school")}</option>
                {BASIS_SCHOOLS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value={t("student.otherCampus")}>{t("student.otherCampus")}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  {t("student.label.grade")} <span className="text-red-500">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                >
                  <option value="">{t("student.placeholder.grade")}</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  {t("student.label.enrollmentYear")}
                </label>
                <select
                  value={enrollmentYear}
                  onChange={(e) => setEnrollmentYear(e.target.value ? parseInt(e.target.value) : "")}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                >
                  <option value="">{t("student.placeholder.enrollmentYear")}</option>
                  {ENROLLMENT_YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-step 1: Course info */}
      {subStep === 1 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{t("student.courses.title")}</h3>
              <p className="text-xs text-gray-400">{t("student.courses.desc")}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                {t("student.label.apCourses")}
              </label>
              <div className="max-h-[280px] space-y-3 overflow-y-auto rounded-xl bg-gray-50/80 p-4">
                {AP_COURSE_GROUP_KEYS.map(({ groupKey, courses }) => (
                  <div key={groupKey}>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {t(groupKey)}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {courses.map((c) => {
                        const isSelected = apCourses.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleTag(apCourses, setApCourses, c)}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                              isSelected
                                ? "bg-brand-600 text-white shadow-sm"
                                : "border border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-600"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                            {c.replace("AP ", "")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {apCourses.length > 0 && (
                <p className="mt-2 text-xs text-brand-600">
                  {t("student.apSelected", { count: apCourses.length })}
                </p>
              )}
            </div>

            <div className="rounded-xl bg-gray-50/80 p-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                {t("student.label.gpa")}
              </label>
              <input
                type="number"
                min="0"
                max="4"
                step="0.01"
                placeholder={t("student.placeholder.gpa")}
                value={currentGpa}
                onChange={(e) => setCurrentGpa(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sub-step 2: Learning prefs */}
      {subStep === 2 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
              <Brain className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{t("student.prefs.title")}</h3>
              <p className="text-xs text-gray-400">{t("student.prefs.desc")}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-red-50/60 p-4">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                {t("student.label.weakSubjects")}
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_KEYS.map((key) => {
                  const label = t(key);
                  const isSelected = weakSubjects.includes(label);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleTag(weakSubjects, setWeakSubjects, label)}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                        isSelected
                          ? "bg-red-500 text-white shadow-sm"
                          : "border border-red-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-600"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-green-50/60 p-4">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                {t("student.label.strongSubjects")}
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_KEYS.map((key) => {
                  const label = t(key);
                  const isSelected = strongSubjects.includes(label);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleTag(strongSubjects, setStrongSubjects, label)}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                        isSelected
                          ? "bg-green-500 text-white shadow-sm"
                          : "border border-green-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-600"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => (subStep === 0 ? onBack() : setSubStep(subStep - 1))}
          className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("student.prevStep")}
        </button>

        {subStep < 2 ? (
          <button
            type="button"
            onClick={() => setSubStep(subStep + 1)}
            disabled={subStep === 0 && !canProceedStep0}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("student.nextStep")}
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("student.submitting")}
              </>
            ) : (
              t("student.complete")
            )}
          </button>
        )}
      </div>
    </div>
  );
}
