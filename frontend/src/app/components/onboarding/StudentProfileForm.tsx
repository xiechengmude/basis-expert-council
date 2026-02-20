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

interface StudentProfileFormProps {
  onComplete: () => void;
  onBack: () => void;
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
  "其他 BASIS 校区",
];

const GRADES = [
  "G1", "G2", "G3", "G4", "G5", "G6",
  "G7", "G8", "G9", "G10", "G11", "G12",
];

const ENROLLMENT_YEARS = Array.from({ length: 9 }, (_, i) => 2018 + i);

const AP_COURSE_GROUPS: { group: string; courses: string[] }[] = [
  {
    group: "数学与计算机",
    courses: [
      "AP Calculus AB", "AP Calculus BC", "AP Statistics",
      "AP Computer Science A", "AP Computer Science Principles",
    ],
  },
  {
    group: "自然科学",
    courses: [
      "AP Physics 1", "AP Physics 2", "AP Physics C: Mech", "AP Physics C: E&M",
      "AP Chemistry", "AP Biology", "AP Environmental Science",
    ],
  },
  {
    group: "人文社科",
    courses: [
      "AP English Language", "AP English Literature",
      "AP US History", "AP World History", "AP European History",
      "AP Psychology", "AP Human Geography",
      "AP Microeconomics", "AP Macroeconomics",
    ],
  },
  {
    group: "语言与艺术",
    courses: [
      "AP Chinese", "AP Spanish", "AP French",
      "AP Art History", "AP Music Theory", "AP Studio Art",
    ],
  },
];

const SUBJECTS = [
  "数学", "物理", "化学", "生物", "英语",
  "历史", "地理", "经济", "计算机科学",
  "中文", "西班牙语", "法语", "音乐", "美术",
];

const SUB_STEPS = ["学校信息", "课程信息", "学习偏好"];
const SUB_STEP_ICONS = [School, BookOpen, Brain];

export function StudentProfileForm({ onComplete, onBack }: StudentProfileFormProps) {
  const [subStep, setSubStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1: School info
  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState("");
  const [enrollmentYear, setEnrollmentYear] = useState<number | "">("");

  // Step 2: Course info
  const [apCourses, setApCourses] = useState<string[]>([]);
  const [currentGpa, setCurrentGpa] = useState("");

  // Step 3: Learning prefs
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [strongSubjects, setStrongSubjects] = useState<string[]>([]);

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
        setError(data.error || "保存画像失败");
        return;
      }

      const kycRes = await fetchWithAuth("/api/user/complete-kyc", {
        method: "POST",
      });

      if (!kycRes.ok) {
        const data = await kycRes.json();
        setError(data.error || "完成 KYC 失败");
        return;
      }

      onComplete();
    } catch {
      setError("网络连接失败");
    } finally {
      setSubmitting(false);
    }
  };

  const StepIcon = SUB_STEP_ICONS[subStep];

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
              <h3 className="text-base font-semibold text-gray-900">学校信息</h3>
              <p className="text-xs text-gray-400">帮助我们匹配你的校区课程体系</p>
            </div>
          </div>

          <div className="space-y-4 rounded-xl bg-gray-50/80 p-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                所在学校 <span className="text-red-500">*</span>
              </label>
              <select
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              >
                <option value="">请选择学校</option>
                {BASIS_SCHOOLS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  年级 <span className="text-red-500">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                >
                  <option value="">选择年级</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  入学年份
                </label>
                <select
                  value={enrollmentYear}
                  onChange={(e) => setEnrollmentYear(e.target.value ? parseInt(e.target.value) : "")}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                >
                  <option value="">选择年份</option>
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
              <h3 className="text-base font-semibold text-gray-900">课程信息</h3>
              <p className="text-xs text-gray-400">可选填，帮助 AI 了解你的学术方向</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                AP 课程（点击选择，可多选）
              </label>
              <div className="max-h-[280px] space-y-3 overflow-y-auto rounded-xl bg-gray-50/80 p-4">
                {AP_COURSE_GROUPS.map(({ group, courses }) => (
                  <div key={group}>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {group}
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
                  已选 {apCourses.length} 门课程
                </p>
              )}
            </div>

            <div className="rounded-xl bg-gray-50/80 p-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                当前 GPA（可选，0 ~ 4.00）
              </label>
              <input
                type="number"
                min="0"
                max="4"
                step="0.01"
                placeholder="例如 3.85"
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
              <h3 className="text-base font-semibold text-gray-900">学习偏好</h3>
              <p className="text-xs text-gray-400">可选填，AI 将据此优化辅导策略</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-red-50/60 p-4">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                需要加强的科目
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => {
                  const isSelected = weakSubjects.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleTag(weakSubjects, setWeakSubjects, s)}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                        isSelected
                          ? "bg-red-500 text-white shadow-sm"
                          : "border border-red-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-600"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-green-50/60 p-4">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                擅长的科目
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => {
                  const isSelected = strongSubjects.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleTag(strongSubjects, setStrongSubjects, s)}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                        isSelected
                          ? "bg-green-500 text-white shadow-sm"
                          : "border border-green-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-600"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {s}
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
          上一步
        </button>

        {subStep < 2 ? (
          <button
            type="button"
            onClick={() => setSubStep(subStep + 1)}
            disabled={subStep === 0 && !canProceedStep0}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            下一步
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
                提交中...
              </>
            ) : (
              "完成设置"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
