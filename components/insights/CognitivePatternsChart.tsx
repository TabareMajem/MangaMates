"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useCognitivePatterns } from "@/hooks/use-cognitive-patterns";

export function CognitivePatternsChart() {
  const { patterns } = useCognitivePatterns();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Thought Patterns</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={patterns}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="positive" fill="#10B981" stackId="stack" />
            <Bar dataKey="negative" fill="#EF4444" stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
