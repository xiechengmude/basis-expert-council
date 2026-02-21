"use client";

import { Clock } from "lucide-react";

interface QuizTimerProps {
  elapsedSec: number;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QuizTimer({ elapsedSec }: QuizTimerProps) {
  return (
    <span className="text-slate-500 flex items-center gap-1.5 text-sm">
      <Clock size={14} />
      {formatTime(elapsedSec)}
    </span>
  );
}
