"use client";

import { Card } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const mockData = [
  { date: "Mon", joy: 0.8, sadness: 0.2, anxiety: 0.3 },
  { date: "Tue", joy: 0.6, sadness: 0.4, anxiety: 0.5 },
  { date: "Wed", joy: 0.7, sadness: 0.3, anxiety: 0.2 },
  { date: "Thu", joy: 0.9, sadness: 0.1, anxiety: 0.1 },
  { date: "Fri", joy: 0.75, sadness: 0.25, anxiety: 0.4 }
];

export function EmotionChart() {
  const [data] = useState(mockData);

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Emotional Journey</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
