"use client";

import { Card } from "@/components/ui/card";
import { features } from "@/config/features";
import { useSpring, animated } from "@react-spring/web";
import { Bot, Brain, Share2, BookOpen, Film } from "lucide-react";

const featureIcons = {
  journal: BookOpen,
  profile: Brain,
  social: Share2,
  aiAgent: Bot,
  mangaStory: Film
};

const animeImages = {
  journal: "https://images.unsplash.com/photo-1612686635542-2244ed9f8ddc",
  profile: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516",
  social: "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
  aiAgent: "https://images.unsplash.com/photo-1635805737707-575885ab0820",
  mangaStory: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586"
};

export function HowItWorksSection() {
  const [props] = useSpring(() => ({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: { tension: 300, friction: 20 }
  }));

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <animated.div style={props} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Your Journey Begins Here
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our AI-powered features help you explore your personality
          </p>
        </animated.div>

        <div className="space-y-8">
          {Object.entries(features).map(([key, feature], index) => {
            const Icon = featureIcons[key as keyof typeof featureIcons];
            const isEven = index % 2 === 0;

            return (
              <animated.div key={key} style={props}>
                <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-none">
                  <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Manga Panel */}
                    <div className="w-full md:w-1/2 relative">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img 
                          src={animeImages[key as keyof typeof animeImages]}
                          alt={feature.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        {/* Manga-style Speech Bubble */}
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg transform rotate-2 shadow-xl">
                          <p className="text-sm font-medium text-black">
                            {feature.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feature Details */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                      </div>

                      <p className="text-muted-foreground mb-6">{feature.description}</p>

                      <div className="space-y-3">
                        {feature.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </animated.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
