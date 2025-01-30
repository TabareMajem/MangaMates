"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";
import { useStripe } from "@/hooks/use-stripe";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { startCheckout, loading } = useStripe();
  
  const handleUpgrade = async () => {
    await startCheckout();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-300">
            Get access to premium features and enhance your experience:
          </p>
          
          <ul className="space-y-2">
            {[
              "Chat with AI Manga Characters",
              "Social Media Analysis",
              "Create Custom AI Agents",
              "LINE & Kakao Integration",
              "Advanced Psychological Profile"
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} disabled={loading}>
            {loading ? "Processing..." : "Upgrade Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
