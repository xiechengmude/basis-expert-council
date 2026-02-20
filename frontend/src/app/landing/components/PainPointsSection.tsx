"use client";

interface Props {
  t: (key: string) => string;
}

const stats = [
  { key: "stat1", color: "text-rose-500" },
  { key: "stat2", color: "text-amber-500" },
  { key: "stat3", color: "text-blue-500" },
  { key: "stat4", color: "text-emerald-500" },
];

export default function PainPointsSection({ t }: Props) {
  return (
    <section id="pain-points" className="bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider text-center">
          {t("pain_label")}
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 text-center">
          {t("pain_title")}
        </h2>
        <p className="mt-4 text-lg text-gray-500 text-center max-w-2xl mx-auto">
          {t("pain_desc")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, i) => (
            <div
              key={stat.key}
              data-reveal
              className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm hover:shadow-md transition"
            >
              <p className={`text-5xl font-extrabold ${stat.color}`}>
                {t(`pain_${stat.key}`)}
              </p>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                {t(`pain_${stat.key}_sub`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
