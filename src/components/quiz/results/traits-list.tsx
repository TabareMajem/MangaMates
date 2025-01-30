"use client";

import { Card } from "@/components/ui/card";

interface TraitsListProps {
  traits: string[];
}

export function TraitsList({ traits }: TraitsListProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Your Key Traits</h3>
      <div className="flex flex-wrap gap-2">
        {traits.map((trait) => (
          <span
            key={trait}
            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
          >
            {trait}
          </span>
        ))}
      </div>
    </Card>
  );
}
