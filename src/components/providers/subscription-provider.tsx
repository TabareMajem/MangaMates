"use client";

import { useEffect } from "react";
import { SubscriptionModal } from "@/components/subscription/subscription-modal";
import { useSubscriptionModal } from "@/hooks/use-subscription-modal";
import { useAuth } from "@/lib/auth/context";

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { isOpen, closeModal } = useSubscriptionModal();

  useEffect(() => {
    // Check subscription status when user changes
    if (user && !user.isPremium) {
      // Logic to check subscription status
    }
  }, [user]);

  return (
    <>
      {children}
      <SubscriptionModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
