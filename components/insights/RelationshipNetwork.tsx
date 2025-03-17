"use client";

import { Card } from "@/components/ui/card";
import { useRelationshipAnalysis } from "@/hooks/use-relationship-analysis";

export function RelationshipNetwork() {
  const { relationships } = useRelationshipAnalysis();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Relationship Dynamics</h3>
      <div className="grid grid-cols-2 gap-4">
        {relationships.map((rel) => (
          <div
            key={rel.id}
            className="p-4 rounded-lg bg-secondary/10"
            style={{
              borderColor: `hsl(${rel.quality * 120}, 70%, 50%)`,
              borderWidth: "2px"
            }}
          >
            <p className="font-medium">{rel.type}</p>
            <div className="mt-2 space-y-1">
              {rel.patterns.map((pattern, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  {pattern}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
