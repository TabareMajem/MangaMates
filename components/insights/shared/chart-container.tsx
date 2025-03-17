"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useChartAnimation } from "@/hooks/use-chart-animation";
import { animated } from "@react-spring/web";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  controls?: boolean;
}

export function ChartContainer({
  title,
  children,
  className,
  controls = true
}: ChartContainerProps) {
  const { springs, handleZoomIn, handleZoomOut, handleReset } = useChartAnimation();

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        {controls && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <animated.div className="h-[300px]" style={springs}>
        {children}
      </animated.div>
    </Card>
  );
}
