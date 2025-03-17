import { Button } from "@/components/ui/button";
import { lineMessagingService } from "@/lib/services/line-messaging";

interface LineButtonProps {
  characterId: string;
  characterName: string;
  onClick?: () => void;
  isPremium?: boolean;
}

export function LineButton({ characterId, characterName, onClick, isPremium }: LineButtonProps) {
  const handleClick = async () => {
    if (!isPremium) {
      onClick?.();
      return;
    }

    try {
      const { authUrl } = await lineMessagingService.createIntegration(
        characterId,
        characterName
      );
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to connect LINE bot:', error);
    }
  };

  return (
    <Button 
      onClick={handleClick}
      className="bg-[#00B900] hover:bg-[#00B900]/90 text-white gap-2"
    >
      <img src="/images/line-logo.svg" alt="LINE" className="w-4 h-4" />
      Add to LINE
    </Button>
  );
}
