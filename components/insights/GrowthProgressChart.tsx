"use client";

import { Card } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useGrowthAnalysis } from "@/hooks/use-growth-analysis";

export function GrowthProgressChart() {
  const { growthData } = useGrowthAnalysis();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Personal Growth Trajectory</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="growthScore"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
