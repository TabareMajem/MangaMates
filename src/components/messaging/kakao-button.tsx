import { Button } from "@/components/ui/button";
import { kakaoMessagingService } from "@/lib/services/kakao-messaging";

interface KakaoButtonProps {
  characterId: string;
  characterName: string;
  onClick?: () => void;
  isPremium?: boolean;
}

export function KakaoButton({ characterId, characterName, onClick, isPremium }: KakaoButtonProps) {
  const handleClick = async () => {
    if (!isPremium) {
      onClick?.();
      return;
    }

    try {
      const { authUrl } = await kakaoMessagingService.createIntegration(
        characterId,
        characterName
      );
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to connect Kakao bot:', error);
    }
  };

  return (
    <Button 
      onClick={handleClick}
      className="bg-[#FEE500] hover:bg-[#FEE500]/90 text-black gap-2"
    >
      <img src="/images/kakao-logo.svg" alt="Kakao" className="w-4 h-4" />
      Add to Kakao
    </Button>
  );
}
