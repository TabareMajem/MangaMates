"use client";

import { useState } from "react";
import { useToast } from "./use-toast";
import { usePremium } from "./use-premium";

export function useSocialAnalysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { isPremium } = usePremium();
  const { toast } = useToast();

  const analyzePlatform = async (platform: string, handle: string) => {
    if (!isPremium) {
      toast({
        title: "Premium Required",
        description: "This feature requires a premium subscription",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/social/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, handle })
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze social media",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzePlatform,
    results,
    loading
  };
}
