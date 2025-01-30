"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { analyzeJournalEntries } from "@/lib/services/journal-analysis";
import { useCallback, useEffect, useState } from "react";
import { EmotionChart } from "./emotion-chart";

interface JournalAnalysisProps {
  entries: string[];
}

interface Analysis {
  emotions: Record<string, number>;
  themes: string[];
  insights: string;
  timestamp: string;
}

export function JournalAnalysis({ entries }: JournalAnalysisProps) {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  const analyzeEntries = useCallback(async () => {
    if (entries.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const result = await analyzeJournalEntries(entries);
      setAnalysis(result);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze journal entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [entries, toast]);

  useEffect(() => {
    analyzeEntries();
  }, [analyzeEntries]);

  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (!analysis) return null;

  return (
    <Card className="p-6">
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="emotions">Emotions</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="prose dark:prose-invert">
            <h3 className="text-lg font-semibold">AI Insights</h3>
            <p className="text-muted-foreground">{analysis.insights}</p>
          </div>
        </TabsContent>

        <TabsContent value="emotions">
          <EmotionChart emotions={analysis.emotions} />
        </TabsContent>

        <TabsContent value="themes">
          <div className="space-y-2">
            {analysis.themes.map((theme, index) => (
              <div
                key={index}
                className="rounded-lg bg-muted p-2 text-sm text-muted-foreground"
              >
                {theme}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function AnalysisSkeleton() {
  return (
    <Card className="p-6 space-y-4">
      <Skeleton className="h-8 w-[200px]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </Card>
  );
}
