"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSubscriptionModal } from "@/hooks/use-subscription-modal";
import { Crown, MessageCircle, Bot, Share2, Brain } from "lucide-react";

export default function PremiumPreviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { openModal } = useSubscriptionModal();
  const fromPath = searchParams.get('from') || '/';

  const features = [
    {
      icon: MessageCircle,
      title: "AI Character Chat",
      description: "Have meaningful conversations with your favorite characters"
    },
    {
      icon: Bot,
      title: "Create Custom AI Agents",
      description: "Design your own AI companions with unique personalities"
    },
    {
      icon: Share2,
      title: "Social Media Analysis",
      description: "Get deep insights into your online personality"
    },
    {
      icon: Brain,
      title: "Advanced Psychological Profile",
      description: "Receive detailed personality analysis and recommendations"
    }
  ];

  const handleUpgrade = () => {
    openModal();
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="p-8 bg-black/20 backdrop-blur-sm border-none">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Premium Features</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Unlock the full potential of your experience with premium access
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 bg-white/5">
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-4 items-center">
            <Button 
              onClick={handleUpgrade}
              className="w-full max-w-md bg-gradient-to-r from-pink-500 to-purple-500"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="text-muted-foreground"
            >
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
