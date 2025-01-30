"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Card } from '@/components/ui/card';

interface PersonalityRadarProps {
  data: {
    trait: string;
    score: number;
  }[];
  title?: string;
}

export function PersonalityRadar({ data, title }: PersonalityRadarProps) {
  return (
    <Card className="p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--muted-foreground))" />
            <PolarAngleAxis
              dataKey="trait"
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
