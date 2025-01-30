"use client";

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { twitterService } from "@/lib/services/twitter-service";

export default function TwitterCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState('Connecting to Twitter...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          throw new Error('Invalid callback parameters');
        }

        await twitterService.handleCallback(code, state);
        
        toast({
          title: "Success",
          description: "Twitter account connected successfully!"
        });

        navigate('/social-media');
      } catch (error) {
        console.error('Twitter callback error:', error);
        setStatus('Connection failed. Please try again.');
        
        toast({
          title: "Error",
          description: "Failed to connect Twitter account",
          variant: "destructive"
        });
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f3e7ff] to-[#e7d1ff] dark:from-[#1a0f1f] dark:to-[#150c2e] py-16">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Twitter Connection</h1>
          <p className="text-muted-foreground">{status}</p>
        </Card>
      </div>
    </main>
  );
}
