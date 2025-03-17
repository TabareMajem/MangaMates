"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Star, Heart, Trophy, ArrowRight } from "lucide-react";
import { useSpring, animated } from "@react-spring/web";

const assessments = [
  {
    id: 'values',
    title: 'Values Assessment',
    description: 'Discover your core values and find characters that share your principles',
    icon: Star,
    href: '/personality-quiz/values',
    color: 'from-pink-500 to-rose-500',
    animeRef: 'Inspired by Kimetsu no Yaiba'
  },
  {
    id: 'big-five',
    title: 'Big Five Personality',
    description: 'Understand yourself through the scientific Big Five model',
    icon: Brain,
    href: '/personality-quiz/big-five',
    color: 'from-violet-500 to-purple-500',
    animeRef: 'Style of Death Note'
  },
  {
    id: 'strengths',
    title: 'Strengths Finder',
    description: 'Identify your unique strengths and talents',
    icon: Trophy,
    href: '/personality-quiz/strengths',
    color: 'from-amber-500 to-orange-500',
    animeRef: 'Like My Hero Academia'
  },
  {
    id: 'mental-health',
    title: 'Mental Health Check',
    description: 'Reflect on your emotional well-being',
    icon: Heart,
    href: '/personality-quiz/mental-health',
    color: 'from-emerald-500 to-teal-500',
    animeRef: 'Inspired by A Silent Voice'
  }
];

export function AssessmentShowcase() {
  const [props] = useSpring(() => ({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: { tension: 300, friction: 20 }
  }));

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Japanese-style decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-sakura-pattern opacity-5" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-wave-pattern opacity-5 transform rotate-180" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              心の旅 - Journey of the Heart
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Begin your path of self-discovery through our comprehensive assessments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {assessments.map((assessment) => (
            <Link key={assessment.id} to={assessment.href}>
              <animated.div style={props}>
                <Card className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-none hover:bg-white/20 transition-all duration-300">
                  <div className="p-6 relative">
                    {/* Japanese pattern background */}
                    <div className="absolute inset-0 bg-sakura-pattern opacity-5" />
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${assessment.color} flex items-center justify-center shadow-lg mb-6`}>
                        <assessment.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3">{assessment.title}</h3>
                      <p className="text-muted-foreground mb-6">{assessment.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary/80">{assessment.animeRef}</span>
                        <Button 
                          variant="ghost" 
                          className="group bg-white/10 hover:bg-white/20"
                        >
                          Start Journey
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>

                    {/* Decorative corner elements */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/20" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20" />
                  </div>
                </Card>
              </animated.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
