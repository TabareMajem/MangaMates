"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";
import { usePersonalizedPrompts } from "@/hooks/use-personalized-prompts";

export function PersonalizedPrompt() {
  const { currentPrompt, generateNewPrompt } = usePersonalizedPrompts();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Writing Prompt</h3>
        <Button variant="ghost" size="sm" onClick={generateNewPrompt}>
          <RefreshCw className="h-4 w-4 mr-2" />
          New Prompt
        </Button>
      </div>
      <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-lg">
        <Sparkles className="h-5 w-5 text-primary mt-1" />
        <p className="text-lg text-muted-foreground">{currentPrompt}</p>
      </div>
    </Card>
  );
}
