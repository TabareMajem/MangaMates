"use client";

import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEmotionalTrends } from "@/hooks/use-emotional-trends";

export function EmotionTrendChart() {
  const { trends } = useEmotionalTrends();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Emotional Journey</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trends}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="joy" stroke="#10B981" />
            <Line type="monotone" dataKey="gratitude" stroke="#6366F1" />
            <Line type="monotone" dataKey="energy" stroke="#F59E0B" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
