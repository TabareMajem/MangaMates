"use client";

import { Card } from "@/components/ui/card";

interface SpeedometerProps {
  value: number;
  label?: string;
  min?: number;
  max?: number;
  segments?: number;
}

export function Speedometer({
  value,
  label,
  min = 0,
  max = 100,
  segments = 5
}: SpeedometerProps) {
  // Calculate percentage for the gauge
  const percentage = ((value - min) / (max - min)) * 100;
  const rotation = (percentage / 100) * 180; // 180 degrees for half circle

  return (
    <Card className="p-4">
      {label && (
        <h3 className="text-sm font-medium text-center mb-4">{label}</h3>
      )}
      <div className="relative w-48 h-24 mx-auto">
        {/* Gauge background */}
        <div className="absolute w-full h-full rounded-t-full bg-secondary/20" />
        
        {/* Gauge fill */}
        <div 
          className="absolute w-full h-full rounded-t-full bg-primary origin-bottom"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          }}
        />
        
        {/* Value indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <span className="text-2xl font-bold">{Math.round(value)}</span>
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>
    </Card>
  );
}
