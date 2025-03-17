"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const providers = [
  { id: "line", name: "LINE", color: "bg-[#00B900] hover:bg-[#00B900]/90" },
  { id: "kakao", name: "Kakao", color: "bg-[#FEE500] hover:bg-[#FEE500]/90 text-black" },
  { id: "google", name: "Google", color: "bg-white hover:bg-gray-50 text-black" },
  { id: "twitter", name: "Twitter", color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90" },
  { id: "instagram", name: "Instagram", color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90" }
];

export function SocialAuth() {
  const { toast } = useToast();

  const handleSocialLogin = async (providerId: string) => {
    try {
      // TODO: Implement actual social auth
      const authUrl = `/api/auth/${providerId}`;
      window.location.href = authUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          onClick={() => handleSocialLogin(provider.id)}
          className={`w-full ${provider.color}`}
        >
          Continue with {provider.name}
        </Button>
      ))}
    </div>
  );
}
