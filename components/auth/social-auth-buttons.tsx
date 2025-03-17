"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { LineIcon, TwitterIcon, InstagramIcon } from "@/components/icons";

export function SocialAuthButtons() {
  const { signIn } = useAuth();

  return (
    <div className="flex flex-col space-y-3">
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 bg-[#06C755] text-white hover:bg-[#06C755]/90"
        onClick={() => signIn('line')}
      >
        <LineIcon className="h-5 w-5" />
        <span>Continue with LINE</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
        onClick={() => signIn('twitter')}
      >
        <TwitterIcon className="h-5 w-5" />
        <span>Continue with Twitter</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white"
        onClick={() => signIn('instagram')}
      >
        <InstagramIcon className="h-5 w-5" />
        <span>Continue with Instagram</span>
      </Button>
    </div>
  );
} 