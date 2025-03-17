"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface ProgressChartProps {
  data: Array<{
    date: string;
    value: number;
    label: string;
  }>;
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#82ca9d"
            name="Progress"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
