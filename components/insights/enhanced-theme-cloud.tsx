"use client";

import { Card } from "@/components/ui/card";
import { SpringScale } from "@/components/animations/spring-scale";
import { FadeIn } from "@/components/animations/fade-in";
import { useThematicAnalysis } from "@/hooks/use-thematic-analysis";
import { animated, useTrail } from "@react-spring/web";
import { useState } from "react";

export function EnhancedThemeCloud() {
  const { themes } = useThematicAnalysis();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const trail = useTrail(themes.length, {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 300, friction: 20 }
  });

  return (
    <Card className="p-6">
      <FadeIn>
        <h3 className="text-lg font-semibold mb-6">Thematic Analysis</h3>
        <div className="flex flex-wrap gap-3">
          {trail.map((style, index) => (
            <animated.div key={themes[index].id} style={style}>
              <SpringScale>
                <button
                  onClick={() => setSelectedTheme(themes[index].id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedTheme === themes[index].id
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary/10 hover:bg-secondary/20"
                  }`}
                  style={{
                    fontSize: `${Math.max(0.8, themes[index].weight)}rem`
                  }}
                >
                  {themes[index].text}
                </button>
              </SpringScale>
            </animated.div>
          ))}
        </div>
      </FadeIn>
    </Card>
  );
}
