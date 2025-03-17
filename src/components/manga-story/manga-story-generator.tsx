"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mangaStoryService } from "@/lib/services/manga-story";
import { useToast } from "@/hooks/use-toast";
import type { MangaStory } from "@/types/manga";

interface MangaStoryGeneratorProps {
  onClose: () => void;
}

export function MangaStoryGenerator({ onClose }: MangaStoryGeneratorProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Analyzing your profile...");
  const { toast } = useToast();

  useEffect(() => {
    const generateStory = async () => {
      try {
        // Step 1: Profile Analysis
        setProgress(20);
        setStatus("Analyzing your profile...");
        await new Promise(r => setTimeout(r, 1500));

        // Step 2: Story Generation
        setProgress(40);
        setStatus("Crafting your story...");
        await new Promise(r => setTimeout(r, 1500));

        // Step 3: Panel Layout
        setProgress(60);
        setStatus("Designing panel layout...");
        await new Promise(r => setTimeout(r, 1500));

        // Step 4: Image Generation
        setProgress(80);
        setStatus("Generating artwork...");
        const story = await mangaStoryService.generateStory();

        // Step 5: Complete
        setProgress(100);
        setStatus("Story complete!");
        
        toast({
          title: "Success",
          description: "Your manga story has been created!"
        });

        setTimeout(onClose, 1000);
      } catch (error) {
        console.error('Failed to generate story:', error);
        toast({
          title: "Error",
          description: "Failed to generate story",
          variant: "destructive"
        });
      }
    };

    generateStory();
  }, [onClose, toast]);

  return (
    <Card className="max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-sm border-none">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-center">{status}</h3>
        <Progress value={progress} className="h-2" />
      </div>
    </Card>
  );
}
