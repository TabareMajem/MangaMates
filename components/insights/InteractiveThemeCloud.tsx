"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThematicAnalysis } from "@/hooks/use-thematic-analysis";
import { useState } from "react";
import { Filter } from "lucide-react";

export function InteractiveThemeCloud() {
  const { themes } = useThematicAnalysis();
  const [filter, setFilter] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const filteredThemes = themes.filter(theme => {
    if (filter === "high") return theme.score > 0.7;
    if (filter === "medium") return theme.score >= 0.4 && theme.score <= 0.7;
    if (filter === "low") return theme.score < 0.4;
    return true;
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Common Themes</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "high" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("high")}
          >
            High Impact
          </Button>
          <Button
            variant={filter === "medium" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("medium")}
          >
            Medium
          </Button>
          <Button
            variant={filter === "low" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("low")}
          >
            Low Impact
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedTheme(theme.id)}
            className="px-3 py-1 rounded-full text-sm transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: `hsla(${theme.score * 255}, 70%, 50%, ${
                selectedTheme === theme.id ? 0.3 : 0.1
              })`,
              color: `hsla(${theme.score * 255}, 70%, 50%, 1)`,
              fontSize: `${Math.max(0.8, theme.weight)}rem`,
              transform: selectedTheme === theme.id ? "scale(1.1)" : "scale(1)"
            }}
          >
            {theme.text}
          </button>
        ))}
      </div>
      {selectedTheme && (
        <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
          <h4 className="font-medium mb-2">Theme Details</h4>
          <p className="text-sm text-muted-foreground">
            {themes.find(t => t.id === selectedTheme)?.description}
          </p>
        </div>
      )}
    </Card>
  );
}
