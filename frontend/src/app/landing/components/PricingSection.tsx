"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";

interface Props {
  t: (key: string) => string;
  onLoginClick?: () => void;
}

const tiers = [
  {
    key: "free",
    featured: false,
    included: [true, true, true, false, false, false],
  },
  {
    key: "prem",
    featured: true,
    included: [true, true, true, true, true, true],
  },
  {
    key: "vip",
    featured: false,
    included: [true, true, true, true, true, true],
  },
];

const features = ["f1", "f2", "f3", "f4", "f5", "f6"];

export default function PricingSection({ t, onLoginClick }: Props) {
  return (
    <section id="pricing" className="bg-slate-900 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider text-center">
          {t("price_label")}
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white text-center">
          {t("price_title")}
        </h2>
        <p className="mt-4 text-lg text-slate-400 text-center max-w-2xl mx-auto">
          {t("price_desc")}
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16 items-center">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              data-reveal
              className={[
                "rounded-2xl border p-8 flex flex-col",
                tier.featured
                  ? "bg-white/[0.06] scale-105 shadow-2xl shadow-brand-500/10 ring-1 ring-brand-500/30 border-brand-500/20 relative"
                  : "bg-white/[0.03] border-white/[0.06]",
              ].join(" ")}
            >
              {tier.featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  {t("price_popular")}
                </span>
              )}

              <p className="text-xl font-bold text-white">
                {t(`price_${tier.key}_name`)}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {t(`price_${tier.key}_desc`)}
              </p>

              <ul className="mt-8 space-y-4 flex-1">
                {features.map((f, n) => {
                  const isIncluded = tier.included[n];
                  return (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      {isIncluded ? (
                        <Check className="w-5 h-5 text-brand-400 shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600 shrink-0" />
                      )}
                      <span
                        className={
                          isIncluded
                            ? "text-slate-300"
                            : "text-slate-600 line-through"
                        }
                      >
                        {t(`price_${tier.key}_${f}`)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {onLoginClick ? (
                <button
                  onClick={onLoginClick}
                  className={[
                    "mt-8 block w-full text-center rounded-full py-3 font-semibold transition",
                    tier.featured
                      ? "bg-brand-500 text-white hover:bg-brand-400"
                      : "border border-white/20 text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  {t(`price_${tier.key}_btn`)}
                </button>
              ) : (
                <Link
                  href="/login"
                  className={[
                    "mt-8 block text-center rounded-full py-3 font-semibold transition",
                    tier.featured
                      ? "bg-brand-500 text-white hover:bg-brand-400"
                      : "border border-white/20 text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  {t(`price_${tier.key}_btn`)}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
