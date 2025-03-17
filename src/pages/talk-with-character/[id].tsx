"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { PRESET_CHARACTERS, TrialManager } from "@/data/preset-characters";
import { BackButton } from "@/components/layout/back-button";
import { ChatInterface } from '@/components/chat/chat-interface';
import { useAuth } from "@/lib/auth/context";
import { useSubscriptionModal } from "@/hooks/use-subscription-modal";

export default function CharacterChatPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { openModal } = useSubscriptionModal();
  const character = PRESET_CHARACTERS.find(char => char.id === id);

  useEffect(() => {
    if (!user?.isAnonymous) {
      // Start trial for non-premium users
      TrialManager.startTrial(user?.id || 'anonymous');
    }
  }, [user]);

  if (!character) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-8">
        <div className="container mx-auto px-4">
          <BackButton />
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Character Not Found</h2>
            <p className="text-muted-foreground">This character doesn't exist or has been removed.</p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-8">
      <div className="container mx-auto px-4">
        <BackButton />
        <ChatInterface initialMessages={character.initialMessages} />
      </div>
    </main>
  );
}
