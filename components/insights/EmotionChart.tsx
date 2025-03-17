"use client";

import { EmotionData } from '@/types/emotion';
import { useState } from 'react';
import {
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

interface EmotionChartProps {
  data: EmotionData['emotions'];
  onEmotionClick?: (emotion: string, value: number) => void;
}

export function EmotionChart({ data, onEmotionClick }: EmotionChartProps) {
  const [activeEmotion, setActiveEmotion] = useState<string | null>(null);

  const chartData = Object.entries(data).map(([key, value]) => ({
    emotion: key.charAt(0).toUpperCase() + key.slice(1),
    value: value * 100
  }));

  const handleClick = (data: any) => {
    const emotion = data.payload.emotion;
    setActiveEmotion(emotion);
    onEmotionClick?.(emotion.toLowerCase(), data.payload.value / 100);
  };

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="emotion"
            tick={{ 
              fill: (props: any) => props.payload.value === activeEmotion ? '#8884d8' : '#666'
            }}
          />
          <Tooltip />
          <Radar
            name="Emotions"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
            onClick={handleClick}
            className="cursor-pointer"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
