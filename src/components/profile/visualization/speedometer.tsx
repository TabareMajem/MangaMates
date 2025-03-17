"use client";

import { Card } from "@/components/ui/card";
import ReactSpeedometer from "react-d3-speedometer";

interface SpeedometerProps {
  value: number;
  label?: string;
  min?: number;
  max?: number;
  segments?: number;
}

export function ProfileSpeedometer({
  value,
  label,
  min = 0,
  max = 100,
  segments = 5
}: SpeedometerProps) {
  const colors = [
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--destructive))"
  ];

  return (
    <Card className="p-4">
      {label && (
        <h3 className="text-sm font-medium text-center mb-4">{label}</h3>
      )}
      <div className="flex justify-center">
        <ReactSpeedometer
          value={value}
          minValue={min}
          maxValue={max}
          segments={segments}
          currentValueText=""
          customSegmentLabels={[]}
          segmentColors={colors}
          needleColor="hsl(var(--primary))"
          width={200}
          height={120}
        />
      </div>
    </Card>
  );
}
