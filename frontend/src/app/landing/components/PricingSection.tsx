"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";

interface Props {
  t: (key: string) => string;
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

export default function PricingSection({ t }: Props) {
  return (
    <section id="pricing" className="bg-gray-50/50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider text-center">
          {t("price_label")}
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 text-center">
          {t("price_title")}
        </h2>
        <p className="mt-4 text-lg text-gray-500 text-center max-w-2xl mx-auto">
          {t("price_desc")}
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16 items-center">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              data-reveal
              className={[
                "bg-white rounded-2xl border p-8 flex flex-col",
                tier.featured
                  ? "scale-105 shadow-xl ring-2 ring-brand-500/20 border-brand-200 relative"
                  : "border-gray-200 shadow-sm",
              ].join(" ")}
            >
              {tier.featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  {t("price_popular")}
                </span>
              )}

              <p className="text-xl font-bold text-gray-900">
                {t(`price_${tier.key}_name`)}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {t(`price_${tier.key}_desc`)}
              </p>

              <ul className="mt-8 space-y-4 flex-1">
                {features.map((f, n) => {
                  const isIncluded = tier.included[n];
                  return (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      {isIncluded ? (
                        <Check className="w-5 h-5 text-brand-500 shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 shrink-0" />
                      )}
                      <span
                        className={
                          isIncluded
                            ? "text-gray-700"
                            : "text-gray-400 line-through"
                        }
                      >
                        {t(`price_${tier.key}_${f}`)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/login"
                className={[
                  "mt-8 block text-center rounded-full py-3 font-semibold transition",
                  tier.featured
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border-2 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white",
                ].join(" ")}
              >
                {t(`price_${tier.key}_btn`)}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
