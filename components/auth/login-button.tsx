"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";
import { LineIcon, TwitterIcon, InstagramIcon } from "@/components/icons";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface LoginButtonProps {
  provider: 'line' | 'twitter' | 'instagram' | 'kakao';
  className?: string;
}

export function LoginButton({ provider, className }: LoginButtonProps) {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signIn(provider);
    // No need to set loading to false as we'll be redirected
  };

  const getIcon = () => {
    switch (provider) {
      case 'line':
        return <LineIcon className="h-5 w-5 mr-2" />;
      case 'twitter':
        return <TwitterIcon className="h-5 w-5 mr-2" />;
      case 'instagram':
        return <InstagramIcon className="h-5 w-5 mr-2" />;
      case 'kakao':
        return null; // Add KakaoIcon if needed
    }
  };

  const getLabel = () => {
    switch (provider) {
      case 'line':
        return "Sign in with LINE";
      case 'twitter':
        return "Sign in with Twitter";
      case 'instagram':
        return "Sign in with Instagram";
      case 'kakao':
        return "Sign in with Kakao";
    }
  };

  return (
    <Button 
      variant="outline" 
      className={className}
      onClick={handleLogin}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        getIcon()
      )}
      {getLabel()}
    </Button>
  );
} 