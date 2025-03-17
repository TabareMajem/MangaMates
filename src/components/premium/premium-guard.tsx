"use client";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth/context";
import { TrialManager } from "@/lib/services/trial-manager";

interface PremiumGuardProps {
  children: React.ReactNode;
}

export function PremiumGuard({ children }: PremiumGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      // Redirect to sign in if not authenticated
      navigate(`/auth/signin?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    if (!user.isPremium) {
      // Check trial status
      const trialActive = TrialManager.isTrialActive(user.id);
      
      if (!trialActive) {
        // If no active trial, start one for registered users
        if (!TrialManager.hasUsedTrial(user.id)) {
          TrialManager.startTrial(user.id);
        } else {
          // If trial already used, redirect to premium preview
          navigate(`/premium-preview?from=${encodeURIComponent(location.pathname)}`);
        }
      }
    }
  }, [user, navigate, location]);

  if (!user) return null;

  // Allow access if user is premium or has active trial
  if (user.isPremium || TrialManager.isTrialActive(user.id)) {
    return <>{children}</>;
  }

  return null;
}
