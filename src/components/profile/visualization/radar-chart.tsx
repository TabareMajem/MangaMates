"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface RadarChartProps {
  data: {
    trait: string;
    score: number;
  }[];
  config?: {
    color?: string;
    fillOpacity?: number;
  };
}

export function ProfileRadarChart({ data, config = {} }: RadarChartProps) {
  const {
    color = "hsl(var(--primary))",
    fillOpacity = 0.2
  } = config;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid className="text-muted-foreground" />
        <PolarAngleAxis
          dataKey="trait"
          tick={{ fill: "currentColor", fontSize: 12 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke={color}
          fill={color}
          fillOpacity={fillOpacity}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
