"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

interface EmotionTimelineProps {
  data: {
    date: string;
    joy: number;
    sadness: number;
    anxiety: number;
  }[];
  title?: string;
}

export function EmotionTimeline({ data, title }: EmotionTimelineProps) {
  return (
    <Card className="p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="joy" 
              stroke="#10B981" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="sadness" 
              stroke="#6366F1" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="anxiety" 
              stroke="#F59E0B" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
