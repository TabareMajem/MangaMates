"use client";

import { useAuth } from "@/lib/auth/context";
import { LineButton } from "../messaging/line-button";
import { KakaoButton } from "../messaging/kakao-button";

interface MessagingButtonsProps {
  characterId: string;
  characterName: string;
  onMessagingClick: (type: 'line' | 'kakao') => void;
}

export function MessagingButtons({ 
  characterId, 
  characterName, 
  onMessagingClick 
}: MessagingButtonsProps) {
  const { user } = useAuth();

  return (
    <div className="flex gap-2">
      <LineButton 
        characterId={characterId} 
        characterName={characterName}
        onClick={() => onMessagingClick('line')}
        isPremium={user?.isPremium}
      />
      <KakaoButton 
        characterId={characterId} 
        characterName={characterName}
        onClick={() => onMessagingClick('kakao')}
        isPremium={user?.isPremium}
      />
    </div>
  );
}
