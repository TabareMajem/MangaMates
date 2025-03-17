import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Brain, 
  LineChart, 
  Sparkles,
  ArrowRight 
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "AI-Enhanced Journaling",
    description: "Write your thoughts with intelligent prompts and real-time emotional analysis"
  },
  {
    icon: Brain,
    title: "Personalized Insights",
    description: "Get deep psychological insights about your thoughts, emotions, and patterns"
  },
  {
    icon: LineChart,
    title: "Track Your Growth",
    description: "Visualize your emotional journey and personal development over time"
  },
  {
    icon: Sparkles,
    title: "Manga Character Matching",
    description: "Find manga characters that match your personality and writing style"
  }
];

export function JournalFeatures() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#1a0f1f]/50 to-[#150c2e]/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            AI-Powered Journal Experience
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Transform your journaling practice with AI-enhanced insights and manga-inspired guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 bg-white/5 backdrop-blur-sm border-none">
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="group">
            <Link to="/journal">
              Start Journaling
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
