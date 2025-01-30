"use client";

import { Card } from "@/components/ui/card";
import { useConceptData } from "@/hooks/use-concept-data";

export function ConceptCloud() {
  const { concepts } = useConceptData();
  
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Common Themes</h2>
      <div className="min-h-[300px] rounded-lg bg-secondary/50 p-4">
        <div className="flex h-full flex-wrap items-center justify-center gap-2">
          {concepts.map((concept) => (
            <span
              key={concept.id}
              className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              style={{ fontSize: `${Math.max(0.8, concept.weight)}rem` }}
            >
              {concept.text}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
