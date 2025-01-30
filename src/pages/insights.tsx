import { InsightsHeader } from "../components/insights/header";
import { EmotionChart } from "../components/insights/emotion-chart";
import { ThemeCloud } from "../components/insights/theme-cloud";
import { StreakCard } from "../components/insights/streak-card";

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <InsightsHeader />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <EmotionChart />
          <ThemeCloud />
          <StreakCard />
        </div>
      </div>
    </main>
  );
}
