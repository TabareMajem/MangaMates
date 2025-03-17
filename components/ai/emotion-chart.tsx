"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface EmotionChartProps {
  emotions: Record<string, number>;
}

export function EmotionChart({ emotions }: EmotionChartProps) {
  const data = Object.entries(emotions).map(([name, value]) => ({
    name,
    value: Number((value * 100).toFixed(1))
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">{payload[0].name}:</span>
                    <span className="font-medium">{payload[0].value}%</span>
                  </div>
                </div>
              );
            }}
          />
          <Bar
            dataKey="value"
            fill="currentColor"
            className="fill-primary"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
