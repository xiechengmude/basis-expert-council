"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface AbilityCurveProps {
  data: number[];
}

export default function AbilityCurve({ data }: AbilityCurveProps) {
  const chartData = data.map((value, idx) => ({ idx, value }));

  return (
    <div className="h-10 w-full rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        >
          <defs>
            <linearGradient id="abilityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#14b8a6"
            strokeWidth={1.5}
            fill="url(#abilityGrad)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
