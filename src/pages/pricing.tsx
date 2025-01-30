import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStripe } from "@/hooks/use-stripe";
import { Check } from "lucide-react";

const features = {
  free: [
    "AI Manga Character Journal",
    "Basic Character Insights",
    "Personality Quiz",
    "Basic Profile"
  ],
  premium: [
    "Create Custom AI Agents",
    "LINE & Kakao Integration",
    "Social Media Analysis",
    "Advanced Psychological Profile",
    "Manga & Anime Recommendations",
    "Priority Support"
  ]
};

export default function PricingPage() {
  const { startCheckout, loading } = useStripe();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <p className="text-muted-foreground mb-6">Basic features</p>
            <ul className="space-y-3 mb-6">
              {features.free.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card className="p-6 border-primary">
            <h2 className="text-2xl font-bold mb-2">Premium</h2>
            <div className="mb-6">
              <span className="text-3xl font-bold">¥1,000</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              {[...features.free, ...features.premium].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full" 
              onClick={() => startCheckout()}
              disabled={loading}
            >
              {loading ? "Processing..." : "Upgrade Now"}
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
