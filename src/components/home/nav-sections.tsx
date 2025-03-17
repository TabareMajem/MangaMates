"use client";

import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Crown, Bot, Share2, UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

const sections = [
  {
    id: 'ai-agent',
    title: 'AI Agent Creator',
    description: 'Create your own AI manga character companion',
    icon: Bot,
    href: '/agents/create',
    premium: true
  },
  {
    id: 'social',
    title: 'Social Media Analyzer',
    description: 'Analyze your social media personality',
    icon: Share2,
    href: '/social-media',
    premium: true
  },
  {
    id: 'profile',
    title: 'Profile Insights',
    description: 'View your personalized analysis',
    icon: UserCircle,
    href: '/profile-insights',
    premium: false
  },
  {
    id: 'premium',
    title: 'Premium Features',
    description: 'Unlock all features and capabilities',
    icon: Crown,
    href: '/pricing',
    premium: false
  }
];

export function NavSections() {
  const { user } = useAuth();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Explore Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => (
            <Link key={section.id} to={section.href}>
              <Card className="p-6 h-full bg-white/10 backdrop-blur-sm border-none hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <section.icon className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{section.description}</p>
                {section.premium && !user?.isPremium && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-primary">
                    <Crown className="h-4 w-4" />
                    <span>Premium Feature</span>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
