"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlatformConnectorProps {
  onConnect: (platform: string, handle: string) => Promise<void>;
}

export function PlatformConnector({ onConnect }: PlatformConnectorProps) {
  const [platform, setPlatform] = useState<'instagram' | 'twitter' | null>(null);
  const [handle, setHandle] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!platform || !handle) return;
    
    try {
      setLoading(true);
      await onConnect(platform, handle);
      toast({
        title: "Success",
        description: `Connected to ${platform} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect platform",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex gap-4 justify-center mb-6">
        <Button
          variant={platform === 'instagram' ? 'default' : 'outline'}
          onClick={() => setPlatform('instagram')}
          className="gap-2"
        >
          <Instagram className="h-5 w-5" />
          Instagram
        </Button>
        <Button
          variant={platform === 'twitter' ? 'default' : 'outline'}
          onClick={() => setPlatform('twitter')}
          className="gap-2"
        >
          <Twitter className="h-5 w-5" />
          Twitter
        </Button>
      </div>

      {platform && (
        <div className="space-y-4">
          <Input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder={`Enter your ${platform} handle`}
            className="text-center"
          />
          <Button 
            onClick={handleConnect} 
            className="w-full"
            disabled={loading || !handle}
          >
            {loading ? "Connecting..." : "Connect Account"}
          </Button>
        </div>
      )}
    </Card>
  );
}
