"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface EmotionData {
  date: string;
  emotions: Record<string, number>;
}

interface EmotionChartProps {
  data: EmotionData[];
}

const COLORS = {
  happy: '#4CAF50',
  sad: '#2196F3',
  angry: '#F44336',
  neutral: '#9E9E9E',
  excited: '#FF9800',
  anxious: '#673AB7',
  calm: '#00BCD4'
};

export function EmotionChart({ data }: EmotionChartProps) {
  // Aggregate emotions across all dates
  const aggregatedEmotions = data.reduce((acc, entry) => {
    Object.entries(entry.emotions).forEach(([emotion, value]) => {
      acc[emotion] = (acc[emotion] || 0) + value;
    });
    return acc;
  }, {} as Record<string, number>);

  // Convert to format needed for recharts
  const chartData = Object.entries(aggregatedEmotions).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[entry.name as keyof typeof COLORS] || '#999999'} 
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
