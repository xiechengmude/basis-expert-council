"use client";

interface ProgressBarProps {
  label: string;
  value: number;       // 0-100
  showPercentage?: boolean; // default true
  size?: "sm" | "md";  // h-2 or h-3, default "md"
}

function getMasteryColor(value: number): string {
  if (value >= 70) return "bg-green-500";
  if (value >= 50) return "bg-yellow-500";
  if (value >= 30) return "bg-orange-500";
  return "bg-red-500";
}

function getMasteryTextColor(value: number): string {
  if (value >= 70) return "text-green-400";
  if (value >= 50) return "text-yellow-400";
  if (value >= 30) return "text-orange-400";
  return "text-red-400";
}

export default function ProgressBar({ label, value, showPercentage = true, size = "md" }: ProgressBarProps) {
  const barHeight = size === "sm" ? "h-2" : "h-3";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-300">{label}</span>
        {showPercentage && (
          <span className={`text-sm font-medium ${getMasteryTextColor(value)}`}>
            {Math.round(value)}%
          </span>
        )}
      </div>
      <div className={`w-full ${barHeight} bg-white/[0.06] rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getMasteryColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
