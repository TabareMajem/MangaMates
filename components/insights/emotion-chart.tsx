"use client";

import { Card } from "@/components/ui/card";
import { useEmotionData } from "@/hooks/use-emotion-data";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function EmotionChart() {
  const { emotionData } = useEmotionData();

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Emotional Journey</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={emotionData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="joy" stroke="#10B981" />
            <Line type="monotone" dataKey="sadness" stroke="#6366F1" />
            <Line type="monotone" dataKey="anxiety" stroke="#F59E0B" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
