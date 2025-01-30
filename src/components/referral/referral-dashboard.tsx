"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { referralService } from "@/lib/services/referral";
import { Copy, Gift } from "lucide-react";

export function ReferralDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const data = await referralService.getReferralStats(user!.id);
      setStats(data);
    } catch (error) {
      console.error('Failed to load referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!stats?.code) return;
    
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/signup?ref=${stats.code}`
      );
      toast({
        title: "Success",
        description: "Referral link copied to clipboard!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy referral link",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Referrals</h2>
        <Gift className="h-6 w-6 text-primary" />
      </div>

      <div className="space-y-6">
        {/* Referral Code */}
        <div className="bg-secondary/10 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Referral Code</p>
              <p className="text-xl font-mono">{stats?.code || 'No code yet'}</p>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/10 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Referrals</p>
            <p className="text-2xl font-bold">{stats?.total_referrals || 0}</p>
          </div>
          <div className="bg-secondary/10 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Rewards Earned</p>
            <p className="text-2xl font-bold">¥{stats?.rewards_earned || 0}</p>
          </div>
        </div>

        {/* Recent Referrals */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Referrals</h3>
          <div className="space-y-2">
            {stats?.referrals?.map((referral: any) => (
              <div
                key={referral.referred.id}
                className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
              >
                <div>
                  <p className="font-medium">{referral.referred.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  referral.status === 'completed' 
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {referral.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
