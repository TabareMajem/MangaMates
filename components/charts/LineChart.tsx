"use client";

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  height?: number;
  color?: string;
}

export function LineChart({ 
  data, 
  xKey, 
  yKey, 
  height = 300,
  color = "#2563eb"
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <XAxis 
          dataKey={xKey}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
