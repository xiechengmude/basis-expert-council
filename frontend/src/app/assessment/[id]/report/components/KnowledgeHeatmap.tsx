"use client";

interface KnowledgeHeatmapProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  topicScores: Record<
    string,
    { correct: number; total: number; accuracy: number }
  >;
}

function getMasteryColor(accuracy: number): string {
  if (accuracy >= 80) return "bg-green-500/30 border-green-500/30 text-green-300";
  if (accuracy >= 60) return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300";
  return "bg-red-500/20 border-red-500/30 text-red-300";
}

export default function KnowledgeHeatmap({
  t,
  topicScores,
}: KnowledgeHeatmapProps) {
  const topics = Object.entries(topicScores);

  if (topics.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        {t("assessment.report.heatmap_title")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {topics.map(([topic, scores]) => {
          const acc = Math.round(scores.accuracy);
          return (
            <div
              key={topic}
              className={`rounded-xl border p-4 text-center ${getMasteryColor(acc)}`}
            >
              <p className="text-sm font-medium mb-1">{topic}</p>
              <p className="text-2xl font-bold">{acc}%</p>
              <p className="text-xs opacity-70 mt-1">
                {scores.correct}/{scores.total}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
