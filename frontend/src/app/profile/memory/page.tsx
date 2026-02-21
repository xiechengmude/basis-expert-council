"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, ArrowLeft, Search, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { useUser, fetchWithAuth } from "@/app/hooks/useUser";
import MemoryStats from "./components/MemoryStats";
import MemoryCard from "./components/MemoryCard";
import MemoryEmptyState from "./components/MemoryEmptyState";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MemoryItem {
  id: string;
  memory: string;
  category: string;
  subject: string;
  importance: string;
  timestamp: string;
  expires_at?: string | null;
}

interface MemoryStats {
  total: number;
  by_category: Record<string, number>;
  by_subject: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MemoryPage() {
  const { t } = useI18n();
  const { profile, loading: userLoading } = useUser();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [stats, setStats] = useState<MemoryStats>({ total: 0, by_category: {}, by_subject: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MemoryItem[] | null>(null);
  const [searching, setSearching] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Confirm delete all
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set("category", categoryFilter);
      if (subjectFilter) params.set("subject", subjectFilter);
      const qs = params.toString() ? `?${params.toString()}` : "";
      const res = await fetchWithAuth(`/api/memory${qs}`);
      if (res.ok) {
        const json = await res.json();
        setMemories(json.memories || []);
        setStats(json.stats || { total: 0, by_category: {}, by_subject: {} });
      } else {
        setError("Failed to load memories");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, subjectFilter]);

  useEffect(() => {
    if (userLoading) return;
    if (!profile) {
      setLoading(false);
      return;
    }
    fetchMemories();
  }, [profile, userLoading, fetchMemories]);

  // Search
  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const res = await fetchWithAuth(`/api/memory/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = await res.json();
        setSearchResults(json.memories || []);
      }
    } catch {
      // silent
    } finally {
      setSearching(false);
    }
  };

  // Update memory
  const handleUpdate = async (id: string, content: string) => {
    try {
      const res = await fetchWithAuth(`/api/memory/${id}`, {
        method: "PUT",
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setMemories((prev) =>
          prev.map((m) => (m.id === id ? { ...m, memory: content } : m))
        );
        if (searchResults) {
          setSearchResults((prev) =>
            prev?.map((m) => (m.id === id ? { ...m, memory: content } : m)) ?? null
          );
        }
      }
    } catch {
      // silent
    }
  };

  // Delete single memory
  const handleDelete = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/memory/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m.id !== id));
        setSearchResults((prev) => prev?.filter((m) => m.id !== id) ?? null);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      }
    } catch {
      // silent
    }
  };

  // Batch delete
  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    try {
      const res = await fetchWithAuth("/api/memory/batch-delete", {
        method: "POST",
        body: JSON.stringify({ memory_ids: Array.from(selectedIds) }),
      });
      if (res.ok) {
        setMemories((prev) => prev.filter((m) => !selectedIds.has(m.id)));
        setSearchResults((prev) => prev?.filter((m) => !selectedIds.has(m.id)) ?? null);
        setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - selectedIds.size) }));
        setSelectedIds(new Set());
      }
    } catch {
      // silent
    }
  };

  // Delete all
  const handleDeleteAll = async () => {
    try {
      const res = await fetchWithAuth("/api/memory/all", { method: "DELETE" });
      if (res.ok) {
        setMemories([]);
        setSearchResults(null);
        setStats({ total: 0, by_category: {}, by_subject: {} });
        setSelectedIds(new Set());
        setConfirmDeleteAll(false);
      }
    } catch {
      // silent
    }
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const displayItems = searchResults ?? memories;
  const allCategories = Object.keys(stats.by_category);
  const allSubjects = Object.keys(stats.by_subject);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  const isEmpty = stats.total === 0 && !searchResults;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top nav */}
      <div className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/chat" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-semibold text-white">
            {t("memory.title")}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-6 text-sm text-red-400">
            {error}
          </div>
        )}

        {isEmpty ? (
          <MemoryEmptyState t={t} />
        ) : (
          <>
            {/* Stats */}
            <MemoryStats stats={stats} t={t} />

            {/* Search bar */}
            <div className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value.trim()) setSearchResults(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={t("memory.search.placeholder")}
                  className="w-full rounded-lg border border-white/[0.1] bg-white/[0.06] pl-10 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              {searching && <Loader2 size={16} className="animate-spin text-violet-400 self-center" />}
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap gap-2 mb-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-white/[0.1] bg-white/[0.06] px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="">{t("memory.filter.all_categories")}</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`memory.category.${cat}`)}
                  </option>
                ))}
              </select>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="rounded-lg border border-white/[0.1] bg-white/[0.06] px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="">{t("memory.filter.all_subjects")}</option>
                {allSubjects.map((subj) => (
                  <option key={subj} value={subj} className="capitalize">
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk actions bar */}
            {displayItems.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (selectedIds.size === displayItems.length) {
                        setSelectedIds(new Set());
                      } else {
                        setSelectedIds(new Set(displayItems.map((m) => m.id)));
                      }
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {selectedIds.size === displayItems.length
                      ? t("memory.action.deselect_all")
                      : t("memory.action.select_all")}
                  </button>
                  {selectedIds.size > 0 && (
                    <button
                      onClick={handleBatchDelete}
                      className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={12} />
                      {t("memory.action.batch_delete")} ({selectedIds.size})
                    </button>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {displayItems.length} / {stats.total}
                </span>
              </div>
            )}

            {/* Memory list */}
            <div className="space-y-3">
              {displayItems.map((item) => (
                <MemoryCard
                  key={item.id}
                  item={item}
                  selected={selectedIds.has(item.id)}
                  onToggleSelect={() => toggleSelect(item.id)}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  t={t}
                />
              ))}
            </div>

            {/* Delete all button */}
            {stats.total > 0 && (
              <div className="mt-10 border-t border-white/[0.06] pt-6">
                {confirmDeleteAll ? (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-red-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-red-300">{t("memory.action.delete_all_confirm")}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={handleDeleteAll}
                            className="rounded-md bg-red-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-500"
                          >
                            {t("memory.action.delete_all")}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteAll(false)}
                            className="rounded-md bg-white/[0.06] px-4 py-1.5 text-xs text-slate-300 hover:bg-white/[0.1]"
                          >
                            {t("memory.action.cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteAll(true)}
                    className="inline-flex items-center gap-2 rounded-md border border-red-500/20 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                    {t("memory.action.delete_all")}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
