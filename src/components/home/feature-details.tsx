"use client";

import { Card } from "@/components/ui/card";
import { features } from "@/config/features";
import { Bot, Brain, Share2, BookOpen, Film } from "lucide-react";
import { useSpring, animated } from "@react-spring/web";

const featureIcons = {
  journal: BookOpen,
  profile: Brain,
  social: Share2,
  aiAgent: Bot,
  recommendations: Film
};

const featureImages = {
  journal: "https://images.unsplash.com/photo-1612686635542-2244ed9f8ddc",
  profile: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516",
  social: "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
  aiAgent: "https://images.unsplash.com/photo-1635805737707-575885ab0820",
  recommendations: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586"
};

export function FeatureDetails() {
  const [props] = useSpring(() => ({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: { tension: 300, friction: 20 }
  }));

  return (
    <section className="py-24 bg-white/5">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            How It Works
          </span>
        </h2>

        <div className="space-y-16">
          {Object.entries(features).map(([key, feature], index) => {
            const Icon = featureIcons[key as keyof typeof featureIcons];
            const isEven = index % 2 === 0;
            
            return (
              <animated.div key={key} style={props}>
                <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-none">
                  <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch`}>
                    {/* Feature Image */}
                    <div className="w-full md:w-1/2 relative">
                      <div className="aspect-[4/3]">
                        <img 
                          src={featureImages[key as keyof typeof featureImages]}
                          alt={feature.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      </div>
                    </div>

                    {/* Feature Content */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                      </div>

                      <p className="text-muted-foreground mb-8">{feature.description}</p>

                      <div className="grid gap-4">
                        {feature.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>{detail}</span>
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
