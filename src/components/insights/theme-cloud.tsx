"use client";

import { Card } from "../ui/card";
import { useState } from "react";

const mockThemes = [
  { id: 1, text: "gratitude", weight: 1.4 },
  { id: 2, text: "family", weight: 1.2 },
  { id: 3, text: "work", weight: 1.0 },
  { id: 4, text: "health", weight: 1.1 },
  { id: 5, text: "growth", weight: 0.9 }
];

export function ThemeCloud() {
  const [themes] = useState(mockThemes);
  
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Common Themes</h2>
      <div className="min-h-[300px] rounded-lg bg-secondary/50 p-4">
        <div className="flex h-full flex-wrap items-center justify-center gap-2">
          {themes.map((theme) => (
            <span
              key={theme.id}
              className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              style={{ fontSize: `${Math.max(0.8, theme.weight)}rem` }}
            >
              {theme.text}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
