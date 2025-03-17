import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { CharacterGrid } from "@/components/character/character-grid";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Yokaizen 思記</h1>
          </div>
          
          <p className="max-w-[42rem] text-lg text-muted-foreground">
            Begin your journey of self-reflection and emotional well-being with AI-enhanced journaling.
            Discover insights, track your growth, and nurture your mental health.
          </p>

          <div className="flex gap-4">
            <Link href="/journal">
              <Button size="lg" className="font-medium">
                Start Journaling
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="font-medium">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-3">
            <Card className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Daily Reflection</h3>
              <p className="text-muted-foreground">
                Thoughtful prompts and AI-powered insights to guide your daily journaling practice.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Emotional Insights</h3>
              <p className="text-muted-foreground">
                Track your emotional journey with advanced sentiment analysis and personalized feedback.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Mindfulness Tools</h3>
              <p className="text-muted-foreground">
                Access guided breathing exercises and meditation tools to enhance your well-being.
              </p>
            </Card>
          </div>

          <section className="py-12">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8">Your Characters</h2>
              <CharacterGrid />
            </div>
          </section>

          <Link href="/characters/create">
            <Button className="mt-4">
              Create New Character
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
