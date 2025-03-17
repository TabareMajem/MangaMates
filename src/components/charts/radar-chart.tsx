"use client";

import {
  ResponsiveContainer,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';

interface RadarChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

export function RadarChart({ data }: RadarChartProps) {
  const chartData = data.labels.map((label, index) => ({
    trait: label,
    value: data.datasets[0].data[index]
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadar data={chartData}>
        <PolarGrid stroke="hsl(var(--muted-foreground))" />
        <PolarAngleAxis
          dataKey="trait"
          tick={{ fill: "currentColor", fontSize: 12 }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
