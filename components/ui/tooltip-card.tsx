"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TooltipCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TooltipCard({ children, className }: TooltipCardProps) {
  return (
    <Card className={cn(
      "p-3 bg-background/95 backdrop-blur-sm border-primary/10 shadow-lg",
      "animate-in fade-in-0 zoom-in-95 duration-200",
      className
    )}>
      {children}
    </Card>
  );
}
