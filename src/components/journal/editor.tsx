"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { useJournalEntry } from "../../hooks/use-journal-entry";

export function JournalEditor() {
  const [content, setContent] = useState("");
  const { saveEntry, saving } = useJournalEntry();

  return (
    <Card className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-primary/20 p-2">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <p className="text-lg text-muted-foreground">
          What's on your mind today?
        </p>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        className="mb-6 min-h-[300px] text-lg"
      />
      <div className="flex justify-end">
        <Button 
          onClick={() => saveEntry(content)}
          disabled={saving}
          className="px-6"
        >
          {saving ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </Card>
  );
}
