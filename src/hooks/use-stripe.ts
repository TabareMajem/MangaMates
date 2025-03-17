"use client";

import { useState } from "react";
import { useToast } from "./use-toast";

export function useStripe() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startCheckout = async () => {
    try {
      setLoading(true);
      
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_monthly_premium',
          currency: 'jpy',
          amount: 1000
        }),
      });

      const { url } = await response.json();
      
      // Redirect to checkout
      window.location.href = url;
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { startCheckout, loading };
}
