"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  t: (key: string) => string;
}

const questions = ["q1", "q2", "q3", "q4", "q5"];

export default function FAQSection({ t }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider text-center">
          {t("faq_label")}
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 text-center">
          {t("faq_title")}
        </h2>

        <div className="mt-16 space-y-4">
          {questions.map((q, i) => (
            <div
              key={q}
              className="border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm"
            >
              <button
                type="button"
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-gray-900">
                  {t(`faq_${q}`)}
                </span>
                <ChevronDown
                  className={[
                    "w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0",
                    openIndex === i ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: openIndex === i ? "500px" : "0px" }}
              >
                <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                  {t(`faq_a${i + 1}`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
