"use client";

import { Card } from "@/components/ui/card";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { useMindsetAnalysis } from "@/hooks/use-mindset-analysis";

export function MindsetRadarChart() {
  const { mindsetData } = useMindsetAnalysis();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Mindset Analysis</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={mindsetData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="attribute" />
            <Radar
              name="Current"
              dataKey="score"
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
