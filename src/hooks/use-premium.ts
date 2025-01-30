"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { useToast } from "./use-toast";

export function usePremium() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/subscription/status?userId=${user.id}`);
        const data = await response.json();
        setIsPremium(data.isPremium);
      } catch (error) {
        console.error('Error checking premium status:', error);
        toast({
          title: "Error",
          description: "Failed to check premium status",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user, toast]);

  return {
    isPremium,
    loading,
    checkStatus: () => setLoading(true) // Trigger a refresh
  };
}
