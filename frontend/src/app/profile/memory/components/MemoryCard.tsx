"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Clock } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  tutoring: "bg-blue-500/15 text-blue-400",
  college_planning: "bg-purple-500/15 text-purple-400",
  onboarding: "bg-cyan-500/15 text-cyan-400",
  exam_prep: "bg-orange-500/15 text-orange-400",
  grade: "bg-green-500/15 text-green-400",
  assessment: "bg-teal-500/15 text-teal-400",
  preference: "bg-pink-500/15 text-pink-400",
  goal: "bg-amber-500/15 text-amber-400",
  other: "bg-slate-500/15 text-slate-400",
};

const IMPORTANCE_COLORS: Record<string, string> = {
  high: "bg-red-500/15 text-red-400",
  medium: "bg-yellow-500/15 text-yellow-400",
  low: "bg-slate-500/15 text-slate-400",
};

interface MemoryItem {
  id: string;
  memory: string;
  category: string;
  subject: string;
  importance: string;
  timestamp: string;
  expires_at?: string | null;
}

interface MemoryCardProps {
  item: MemoryItem;
  selected: boolean;
  onToggleSelect: () => void;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  t: (key: string) => string;
}

export default function MemoryCard({
  item,
  selected,
  onToggleSelect,
  onUpdate,
  onDelete,
  t,
}: MemoryCardProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.memory);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editContent.trim() || editContent === item.memory) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await onUpdate(item.id, editContent.trim());
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(item.id);
    setConfirming(false);
  };

  // Calculate days until expiry
  let expiryText = "";
  if (item.expires_at) {
    const diff = new Date(item.expires_at).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      expiryText = t("memory.expired");
    } else {
      expiryText = t("memory.expires").replace("{days}", String(days));
    }
  }

  const catColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other;
  const impColor = IMPORTANCE_COLORS[item.importance] || IMPORTANCE_COLORS.medium;

  return (
    <div className={`rounded-xl border bg-white/[0.03] p-4 transition-colors ${selected ? "border-violet-500/40 bg-violet-500/5" : "border-white/[0.06]"}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500"
        />

        <div className="flex-1 min-w-0">
          {/* Content */}
          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded-lg border border-white/[0.1] bg-white/[0.06] px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-50"
                >
                  <Check size={12} />
                  {t("memory.action.save")}
                </button>
                <button
                  onClick={() => { setEditing(false); setEditContent(item.memory); }}
                  className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-3 py-1 text-xs text-slate-300 hover:bg-white/[0.1]"
                >
                  <X size={12} />
                  {t("memory.action.cancel")}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-200 leading-relaxed">{item.memory}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${catColor}`}>
              {t(`memory.category.${item.category}`)}
            </span>
            {item.subject !== "general" && (
              <span className="inline-flex items-center rounded-full bg-slate-500/15 px-2 py-0.5 text-[10px] font-medium text-slate-400 capitalize">
                {item.subject}
              </span>
            )}
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${impColor}`}>
              {t(`memory.importance.${item.importance}`)}
            </span>
            {expiryText && (
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                <Clock size={10} />
                {expiryText}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {!editing && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors"
              title={t("memory.action.edit")}
            >
              <Pencil size={14} />
            </button>
            {confirming ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDelete}
                  className="rounded-md p-1.5 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-white/[0.06] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                title={t("memory.action.delete")}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
