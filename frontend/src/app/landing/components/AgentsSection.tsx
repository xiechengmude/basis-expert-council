"use client";

interface Props {
  t: (key: string) => string;
}

const agents = [
  { key: "math", emoji: "🔢", topBorderColor: "border-t-brand-400" },
  { key: "sci",  emoji: "🔬", topBorderColor: "border-t-purple-400" },
  { key: "hum",  emoji: "📚", topBorderColor: "border-t-amber-400" },
  { key: "cur",  emoji: "🗓️", topBorderColor: "border-t-blue-400" },
  { key: "pro",  emoji: "🚨", topBorderColor: "border-t-rose-400" },
  { key: "biz",  emoji: "💼", topBorderColor: "border-t-slate-400" },
];

export default function AgentsSection({ t }: Props) {
  return (
    <section id="agents" className="py-24 px-4 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider text-center">
          {t("agent_label")}
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white text-center">
          {t("agent_title")}
        </h2>
        <p className="mt-4 text-lg text-slate-400 text-center max-w-2xl mx-auto">
          {t("agent_desc")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {agents.map(({ key, emoji, topBorderColor }) => {
            const rawTags = t(`ag_${key}_tags`);
            const tags = rawTags.split(",").map((tag) => tag.trim()).filter(Boolean);

            return (
              <div
                key={key}
                data-reveal
                className={`bg-white/[0.04] rounded-2xl border border-white/10 border-t-4 ${topBorderColor} p-6 backdrop-blur-sm hover:bg-white/[0.07] transition`}
              >
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="text-lg font-semibold text-white">
                  {t(`ag_${key}_h`)}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {t(`ag_${key}_p`)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
