"use client";

import { TooltipCard } from "@/components/ui/tooltip-card";
import { AnimatedValue } from "./animated-value";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <TooltipCard>
      <p className="font-medium mb-2">{label}</p>
      {payload.map((item: any) => (
        <div key={item.name} className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm">
            {item.name}:{" "}
            <AnimatedValue 
              value={item.value * 100} 
              format={(v) => `${Math.round(v)}%`}
            />
          </span>
        </div>
      ))}
    </TooltipCard>
  );
}
