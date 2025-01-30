"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { validatePromoCode } from "@/lib/services/promo-service";
import { useState } from "react";

interface PromoCodeInputProps {
  onValidCode: (code: string) => void;
  onInvalidCode?: () => void;
  className?: string;
}

export function PromoCodeInput({ onValidCode, onInvalidCode, className }: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      const isValid = await validatePromoCode(code);
      
      if (isValid) {
        toast({
          title: "Success",
          description: "Promo code applied successfully!",
        });
        onValidCode(code);
      } else {
        toast({
          title: "Invalid Code",
          description: "Please check your code and try again.",
          variant: "destructive",
        });
        onInvalidCode?.();
      }
    } catch (error) {
      console.error('Promo code validation error:', error);
      toast({
        title: "Error",
        description: "Failed to validate promo code. Please try again.",
        variant: "destructive",
      });
      onInvalidCode?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="uppercase"
          maxLength={10}
          pattern="[A-Z0-9]+"
          title="Promo codes can only contain uppercase letters and numbers"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !code.trim()}>
          {loading ? "Validating..." : "Apply"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Enter a valid promotional code to receive your discount
      </p>
    </form>
  );
}

// Higher-order component for tracking promo code usage
export function withPromoTracking<P extends object>(
  WrappedComponent: React.ComponentType<P & PromoCodeInputProps>
) {
  return function WithPromoTracking(props: P & PromoCodeInputProps) {
    const handleValidCode = async (code: string) => {
      try {
        // Track successful promo code usage
        await fetch('/api/analytics/track-promo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, status: 'success' })
        });
      } catch (error) {
        console.error('Failed to track promo code:', error);
      }

      // Call original onValidCode handler
      props.onValidCode(code);
    };

    return (
      <WrappedComponent
        {...props}
        onValidCode={handleValidCode}
      />
    );
  };
}

// Export tracked version
export const TrackedPromoCodeInput = withPromoTracking(PromoCodeInput);
