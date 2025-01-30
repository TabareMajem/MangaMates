"use client";

import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export function InsightsHeader() {
  const [period, setPeriod] = useState("30");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Insights</h1>
        <p className="text-muted-foreground">Discover patterns in your journal entries</p>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <Button variant="outline" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
