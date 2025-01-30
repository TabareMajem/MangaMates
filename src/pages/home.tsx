import { Hero } from "@/components/home/hero";
import { FeatureShowcase } from "@/components/home/feature-showcase";
import { AssessmentShowcase } from "@/components/home/assessment-showcase";
import { HowItWorksSection } from "@/components/home/how-it-works";
import { AuthSection } from "@/components/home/auth-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f3e7ff] to-[#e7d1ff] dark:from-[#1a0f1f] dark:to-[#150c2e]">
      <Hero />
      <FeatureShowcase />
      <HowItWorksSection />
      <AssessmentShowcase />
      <AuthSection />
    </main>
  );
}
