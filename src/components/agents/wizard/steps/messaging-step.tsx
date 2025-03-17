"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth/context";
import type { MessagingProvider } from "@/types/messaging";

interface MessagingStepProps {
  onNext: () => void;
  onBack: () => void;
  onConfigChange: (config: MessagingProvider) => void;
}

export function MessagingStep({ onNext, onBack, onConfigChange }: MessagingStepProps) {
  const { user } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<'line' | 'kakao'>('line');
  const [config, setConfig] = useState({
    accessToken: '',
    channelId: '',
    apiKey: ''
  });

  if (!user?.isPremium) {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold mb-4">Premium Feature</h3>
        <p className="text-muted-foreground mb-6">
          Messaging integration is available for premium users only.
          <br />
          <a href="/pricing" className="text-primary hover:underline">
            Upgrade to Premium
          </a>
        </p>
        <Button onClick={onNext}>Continue Without Messaging</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          variant={selectedProvider === 'line' ? 'default' : 'outline'}
          onClick={() => setSelectedProvider('line')}
          className="flex-1"
        >
          LINE
        </Button>
        <Button
          variant={selectedProvider === 'kakao' ? 'default' : 'outline'}
          onClick={() => setSelectedProvider('kakao')}
          className="flex-1"
        >
          Kakao
        </Button>
      </div>

      <div className="space-y-4">
        {selectedProvider === 'line' ? (
          <>
            <div className="space-y-2">
              <Label>Channel Access Token</Label>
              <Input
                value={config.accessToken}
                onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                placeholder="Enter your LINE Channel Access Token"
              />
            </div>
            <div className="space-y-2">
              <Label>Channel ID</Label>
              <Input
                value={config.channelId}
                onChange={(e) => setConfig({ ...config, channelId: e.target.value })}
                placeholder="Enter your LINE Channel ID"
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="Enter your Kakao API Key"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={() => {
            onConfigChange({
              type: selectedProvider,
              enabled: true,
              config: {
                accessToken: config.accessToken,
                ...(selectedProvider === 'line' ? { channelId: config.channelId } : {}),
                ...(selectedProvider === 'kakao' ? { apiKey: config.apiKey } : {})
              }
            });
            onNext();
          }}
          disabled={!config.accessToken || (selectedProvider === 'line' && !config.channelId) || (selectedProvider === 'kakao' && !config.apiKey)}
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
