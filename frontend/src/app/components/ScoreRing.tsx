"use client";

import { useState, useEffect, useRef } from "react";

interface ScoreRingProps {
  score: number;       // 0-100
  size?: number;       // default 160
  color?: string;      // default "#14b8a6"
  animated?: boolean;  // default true
  label?: string;      // text below score, default "/100"
}

export default function ScoreRing({ score, size = 160, color = "#14b8a6", animated = true, label = "/100" }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : Math.round(score));
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(Math.round(score));
      return;
    }
    const target = Math.round(score);
    let current = 0;
    const step = () => {
      current += 1;
      if (current >= target) {
        setDisplayScore(target);
        return;
      }
      setDisplayScore(current);
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [score, animated]);

  const viewBox = 120;
  const cx = viewBox / 2;
  const cy = viewBox / 2;
  const r = 52;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${viewBox} ${viewBox}`} className="w-full h-full -rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${circumference * (1 - score / 100)}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{displayScore}</span>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
    </div>
  );
}
