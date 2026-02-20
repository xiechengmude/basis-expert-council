"use client";

interface Props {
  t: (key: string) => string;
}

const stats = [
  { key: "stat1", color: "text-rose-400" },
  { key: "stat2", color: "text-amber-400" },
  { key: "stat3", color: "text-blue-400" },
  { key: "stat4", color: "text-emerald-400" },
];

export default function PainPointsSection({ t }: Props) {
  return (
    <section id="pain-points" className="bg-slate-900 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider text-center">
          {t("pain_label")}
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white text-center">
          {t("pain_title")}
        </h2>
        <p className="mt-4 text-lg text-slate-400 text-center max-w-2xl mx-auto">
          {t("pain_desc")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {stats.map((stat) => (
            <div
              key={stat.key}
              data-reveal
              className="bg-white/[0.04] rounded-2xl border border-white/10 p-8 text-center backdrop-blur-sm hover:bg-white/[0.07] transition"
            >
              <p className={`text-5xl font-extrabold ${stat.color}`}>
                {t(`pain_${stat.key}`)}
              </p>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                {t(`pain_${stat.key}_sub`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
