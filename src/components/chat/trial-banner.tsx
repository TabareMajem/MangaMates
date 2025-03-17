"use client";

import { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscriptionModal } from "@/hooks/use-subscription-modal";
import { TrialManager } from "@/data/preset-characters";
import { useAuth } from "@/lib/auth/context";

export function TrialBanner() {
  const { user } = useAuth();
  const { openModal } = useSubscriptionModal();
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const remaining = TrialManager.getRemainingTime(user?.id || 'anonymous');
      setRemainingTime(Math.floor(remaining / 1000)); // Convert to seconds
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [user]);

  if (remainingTime <= 0) return null;

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Crown className="h-5 w-5 text-primary animate-pulse" />
        <span className="text-sm">
          Trial time remaining: <span className="font-medium">{minutes}:{seconds.toString().padStart(2, '0')}</span>
        </span>
      </div>
      <Button 
        size="sm" 
        onClick={openModal}
        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
      >
        Upgrade Now
      </Button>
    </div>
  );
}
