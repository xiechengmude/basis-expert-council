"use client";

import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          {/* Step circle + label */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                i < current
                  ? "bg-brand-600 text-white shadow-sm"
                  : i === current
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-4 ring-brand-100"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < current ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-[11px] font-medium transition-colors ${
                i <= current ? "text-brand-700" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>

          {/* Connector line */}
          {i < steps.length - 1 && (
            <div className="mx-2 mb-5 flex items-center">
              <div
                className={`h-0.5 w-10 rounded-full transition-colors duration-300 sm:w-14 ${
                  i < current ? "bg-brand-600" : "bg-gray-200"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
