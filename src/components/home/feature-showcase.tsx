"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Brain, Share2, Bot, Film, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { useSpring, animated } from "@react-spring/web";

const features = [
  {
    id: 'journal',
    title: 'AI-Enhanced Journal',
    description: 'Write with intelligent prompts and real-time analysis',
    icon: BookOpen,
    href: '/journal',
    premium: false,
    image: 'https://images.unsplash.com/photo-1612686635542-2244ed9f8ddc',
    animeRef: 'Like Your Lie in April'
  },
  {
    id: 'profile',
    title: 'Personality Insights',
    description: 'Discover your manga personality type',
    icon: Brain,
    href: '/personality-quiz',
    premium: false,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516',
    animeRef: 'Style of Death Note'
  },
  {
    id: 'manga-story',
    title: 'Personal Manga Story',
    description: 'Create your own manga story',
    icon: Film,
    href: '/manga-story',
    premium: true,
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586',
    animeRef: 'Like Your Story in Panels'
  },
  {
    id: 'chat',
    title: 'Talk with Characters',
    description: 'Chat with AI manga characters',
    icon: MessageCircle,
    href: '/talk-with-character',
    premium: true,
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820',
    animeRef: 'Interactive like Visual Novels'
  },
  {
    id: 'social',
    title: 'Social Media Analysis',
    description: 'Understand your online personality',
    icon: Share2,
    href: '/social-media',
    premium: true,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
    animeRef: 'Insights like Kimi ni Todoke'
  },
  {
    id: 'ai-agent',
    title: 'Create AI Agent',
    description: 'Design your own manga companion',
    icon: Bot,
    href: '/agents/create',
    premium: true,
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
    animeRef: 'Like having your own Stand'
  }
];

export function FeatureShowcase() {
  const { user } = useAuth();
  const [props] = useSpring(() => ({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: { tension: 300, friction: 20 }
  }));

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 gradient-text">
          Explore Our Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link key={feature.id} to={feature.href}>
              <animated.div style={props}>
                <Card className="group relative overflow-hidden bg-black/20 backdrop-blur-sm border-none">
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {feature.premium && !user?.isPremium && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 rounded-full text-xs font-medium">
                        Premium
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-white/80 text-sm mb-4">
                        {feature.description}
                      </p>
                      <p className="text-xs text-primary/80">
                        {feature.animeRef}
                      </p>
                    </div>
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
