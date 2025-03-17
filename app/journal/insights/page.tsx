import { InsightsHeader } from "@/components/insights/header";
import { MoodMap } from "@/components/insights/mood-map";
import { ConceptCloud } from "@/components/insights/concept-cloud";
import { StreakCard } from "@/components/insights/streak-card";
import { EmotionChart } from "@/components/insights/emotion-chart";

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <InsightsHeader />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <MoodMap />
          <EmotionChart />
          <ConceptCloud />
          <StreakCard />
        </div>
      </div>
    </main>
  );
}
