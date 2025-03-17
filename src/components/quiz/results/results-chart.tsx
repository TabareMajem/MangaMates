"use client";

import { Card } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface ResultsChartProps {
  scores: Record<string, number>;
}

export function ResultsChart({ scores }: ResultsChartProps) {
  const data = Object.entries(scores).map(([key, value]) => ({
    trait: key,
    value: value * 100
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="trait" />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
