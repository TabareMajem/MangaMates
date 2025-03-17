"use client";

import { ReferralDashboard } from "@/components/referral/referral-dashboard";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ReferralPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/signin?redirect=/referral');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-16">
      <div className="container mx-auto px-4">
        <ReferralDashboard />
        
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Share Your Code</h3>
                  <p className="text-muted-foreground">Share your unique referral code with friends</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Friends Sign Up</h3>
                  <p className="text-muted-foreground">When they join using your code, they get a bonus</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Earn Rewards</h3>
                  <p className="text-muted-foreground">You earn rewards for each successful referral</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
