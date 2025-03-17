"use client";

import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card className="p-6 bg-gradient-to-br from-secondary/50 to-background border-none">
      <h2 className="text-2xl font-semibold text-primary mb-6">Journal Calendar</h2>
      <div className="rounded-lg bg-white/50 p-4 shadow-inner">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
        />
      </div>
    </Card>
  );
}
