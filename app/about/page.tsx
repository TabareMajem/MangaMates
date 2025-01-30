import { AboutHero } from "@/components/about/hero";
import { Features } from "@/components/about/features";
import { Privacy } from "@/components/about/privacy";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <AboutHero />
      <Features />
      <Privacy />
    </main>
  );
}
