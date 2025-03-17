import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Pencil, Brain, MessageCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              Otaku Mirror
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Begin your journey of self-discovery through AI-enhanced journaling and personality insights
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {/* Character Chat Button */}
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Link to="/character/list" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat with Characters
              </Link>
            </Button>

            {/* Journal Button */}
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
            >
              <Link to="/journal" className="flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Journal
              </Link>
            </Button>

            {/* Start Assessment Button */}
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Link to="/personality-quiz" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Start Assessment
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
