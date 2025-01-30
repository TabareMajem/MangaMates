"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubscriptionModal } from "@/hooks/use-subscription-modal";
import { Crown } from "lucide-react";

interface PremiumPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'line' | 'kakao';
  characterName: string;
}

export function PremiumPreviewDialog({ isOpen, onClose, feature, characterName }: PremiumPreviewDialogProps) {
  const { openModal } = useSubscriptionModal();

  const handleUpgrade = () => {
    openModal();
    onClose();
  };

  const features = {
    line: {
      title: "LINE Integration",
      description: `Chat with ${characterName} anytime through LINE! Create a unique AI companion that understands and supports you.`,
      benefits: [
        "24/7 access to your AI companion",
        "Personalized conversations based on your preferences",
        "Share your companion with friends and family",
        "Custom personality and goal settings",
        "Seamless LINE messaging integration"
      ]
    },
    kakao: {
      title: "Kakao Integration",
      description: `Connect with ${characterName} on Kakao! Experience a unique AI companion tailored to your personality.`,
      benefits: [
        "Always-available AI companion on Kakao",
        "Customizable personality and responses",
        "Share your companion with others",
        "Personalized interaction style",
        "Full Kakao messaging integration"
      ]
    }
  };

  const currentFeature = features[feature];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            {currentFeature.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-300">
            {currentFeature.description}
          </p>
          
          <div className="space-y-2">
            {currentFeature.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Maybe Later
          </Button>
          <Button 
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            Upgrade to Premium
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
