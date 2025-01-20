"use client";

import { GrowthProgressChart } from "@/components/insights/GrowthProgressChart";
import { InsightsViewer } from '@/components/insights/InsightsViewer';
import { InteractiveEmotionChart } from "@/components/insights/InteractiveEmotionChart";
import { InteractiveThemeCloud } from "@/components/insights/InteractiveThemeCloud";
import { MindsetRadarChart } from "@/components/insights/MindsetRadarChart";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEmotionData, useEmotionDataFallback } from "@/hooks/use-emotion-data";
import { useAuth } from "@/lib/auth/context";
import { EmotionData } from "@/types/emotion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function InsightsContent() {
  const { data, isLoading, error } = useEmotionData();
  const fallback = useEmotionDataFallback();

  const emotionData = (error ? fallback.data : (data ?? [])) as EmotionData[];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Insights</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <InteractiveEmotionChart data={emotionData} />
        <InteractiveThemeCloud />
        <MindsetRadarChart />
        <GrowthProgressChart />
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please sign in to view insights</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Your Insights</h1>
        <InsightsViewer userId={user.id} />
        <InsightsContent />
      </div>
    </QueryClientProvider>
  );
}