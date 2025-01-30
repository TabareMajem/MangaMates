"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer } from "./shared/chart-container";
import { ChartTooltip } from "./shared/chart-tooltip";
import { useEmotionalTrends } from "@/hooks/use-emotional-trends";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function EnhancedEmotionChart() {
  const { trends } = useEmotionalTrends();
  const [timeRange, setTimeRange] = useState("30");

  const filteredTrends = trends.slice(-parseInt(timeRange));

  return (
    <ChartContainer 
      title="Emotional Journey"
      className="relative"
    >
      <div className="absolute top-6 right-24 z-10">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredTrends}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={ChartTooltip} />
          <Legend />
          <Line
            type="monotone"
            dataKey="joy"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="gratitude"
            stroke="#6366F1"
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
