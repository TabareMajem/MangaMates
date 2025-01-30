"use client";

import { Card } from "@/components/ui/card";
import { useThematicAnalysis } from "@/hooks/use-thematic-analysis";

export function ThemeCloud() {
  const { themes } = useThematicAnalysis();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Common Themes</h3>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <span
            key={theme.id}
            className="px-3 py-1 rounded-full text-sm"
            style={{
              backgroundColor: `hsla(${theme.score * 255}, 70%, 50%, 0.1)`,
              color: `hsla(${theme.score * 255}, 70%, 50%, 1)`,
              fontSize: `${Math.max(0.8, theme.weight)}rem`
            }}
          >
            {theme.text}
          </span>
        ))}
      </div>
    </Card>
  );
}
