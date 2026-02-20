"use client";

interface Props {
  t: (key: string) => string;
}

const steps = [
  { n: 1 },
  { n: 2 },
  { n: 3 },
  { n: 4 },
];

export default function HowItWorksSection({ t }: Props) {
  return (
    <section id="how-it-works" className="bg-slate-950 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider text-center">
          {t("how_label")}
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white text-center">
          {t("how_title")}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {steps.map(({ n }, index) => (
            <div key={n} data-reveal className="relative text-center group">
              {index < 3 && (
                <span className="hidden lg:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] border-t-2 border-dashed border-white/10" />
              )}
              <div className="mx-auto w-14 h-14 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xl font-bold border border-brand-500/30">
                {n}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">
                {t(`how_${n}_h`)}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {t(`how_${n}_p`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
