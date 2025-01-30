import { getEmotionData } from "@/lib/services/emotion-service";
import { EmotionData } from "@/types/emotion";
import { useQuery } from "@tanstack/react-query";

export function useEmotionData() {
  return useQuery<EmotionData[]>({
    queryKey: ["emotionData"],
    queryFn: getEmotionData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: [],
    retry: 2,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Failed to fetch emotion data:', error);
    }
  });
}

// Fallback implementation if react-query fails to load
export function useEmotionDataFallback() {
  return {
    data: [] as EmotionData[],
    isLoading: false,
    error: null
  };
}
