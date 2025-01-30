"use client";

import { EmotionChart } from "@/components/charts/EmotionChart";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";

interface EmotionData {
  date: string;
  emotions: Record<string, number>;
}

export function InteractiveEmotionChart({ data }: { data: EmotionData[] }) {
  const [_selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    // TODO: Implement date filtering
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Emotion Trends</h3>
        <DatePicker
          onChange={handleDateChange}
          placeholder="Filter by date"
        />
      </div>
      <EmotionChart data={data} />
    </Card>
  );
}
