import { Card } from "@/components/ui/card";
import { Brain, Heart, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Enhanced Insights",
    description: "Our advanced AI analyzes your entries to provide meaningful patterns and personalized insights."
  },
  {
    icon: Heart,
    title: "Emotional Well-being",
    description: "Track your emotional journey with sentiment analysis and guided mindfulness exercises."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your journal entries are encrypted and secure. We prioritize your privacy and data protection."
  }
];

export function Features() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Key Features</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6">
            <feature.icon className="mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
