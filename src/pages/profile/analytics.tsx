"use client";

import { Card } from "@/components/ui/card";
import { EmotionChart } from "@/components/insights/emotion-chart";
import { ThemeCloud } from "@/components/insights/theme-cloud";
import { StreakCard } from "@/components/insights/streak-card";

export default function ProfileAnalyticsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <EmotionChart />
          <ThemeCloud />
          <StreakCard />
        </div>
      </div>
    </main>
  );
}
