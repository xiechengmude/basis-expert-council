"use client";

interface MistakeFiltersProps {
  subjects: string[];
  selectedSubject: string | null;
  selectedStatus: string | null;
  sortBy: "time" | "count";
  onSubjectChange: (s: string | null) => void;
  onStatusChange: (s: string | null) => void;
  onSortChange: (s: "time" | "count") => void;
  t: (key: string) => string;
}

const SELECT_CLASS =
  "bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500";

export default function MistakeFilters({
  subjects,
  selectedSubject,
  selectedStatus,
  sortBy,
  onSubjectChange,
  onStatusChange,
  onSortChange,
  t,
}: MistakeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Subject filter */}
      <select
        value={selectedSubject || ""}
        onChange={(e) => onSubjectChange(e.target.value || null)}
        className={SELECT_CLASS}
      >
        <option value="">{t("mistakes.filter.all_subjects")}</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {t(`academic.subject.${s}`)}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={selectedStatus || ""}
        onChange={(e) => onStatusChange(e.target.value || null)}
        className={SELECT_CLASS}
      >
        <option value="">{t("mistakes.filter.all_statuses")}</option>
        <option value="new">{t("mistakes.status.new")}</option>
        <option value="reviewing">{t("mistakes.status.reviewing")}</option>
        <option value="mastered">{t("mistakes.status.mastered")}</option>
        <option value="regressed">{t("mistakes.status.regressed")}</option>
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as "time" | "count")}
        className={SELECT_CLASS}
      >
        <option value="time">{t("mistakes.sort.by_time")}</option>
        <option value="count">{t("mistakes.sort.by_count")}</option>
      </select>
    </div>
  );
}
