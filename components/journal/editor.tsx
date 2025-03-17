"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDailyPrompt } from "@/hooks/use-daily-prompt";
import { useJournalEntry } from "@/hooks/use-journal-entry";
import { Sparkles } from "lucide-react";

export function JournalEditor() {
  const [content, setContent] = useState("");
  const { prompt } = useDailyPrompt();
  const { saveEntry } = useJournalEntry();

  return (
    <Card className="glass-card p-8 border-none">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-primary/20 p-2">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <p className="text-lg text-muted-foreground">{prompt}</p>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        className="mb-6 min-h-[300px] bg-background/50 text-lg border-primary/20 focus:border-primary/40 transition-colors"
      />
      <div className="flex justify-end">
        <Button 
          onClick={() => saveEntry(content)}
          className="px-6 py-2 text-base bg-primary hover:bg-primary/90 transition-colors"
        >
          Save Entry
        </Button>
      </div>
    </Card>
  );
}
