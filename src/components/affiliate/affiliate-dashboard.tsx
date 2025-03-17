"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { affiliateService } from "@/lib/services/affiliate";
import { DollarSign, TrendingUp, Building } from "lucide-react";

export function AffiliateDashboard() {
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
      const data = await affiliateService.getPartnerStats(user!.id);
      setStats(data);
    } catch (error) {
      console.error('Failed to load affiliate stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalEarnings = stats?.commissions?.reduce(
    (sum: number, commission: any) => sum + commission.amount,
    0
  ) || 0;

  const pendingPayments = stats?.commissions?.filter(
    (c: any) => c.status === 'pending'
  ).length || 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Affiliate Dashboard</h2>
          <p className="text-muted-foreground">
            Track your earnings and performance
          </p>
        </div>
        <Building className="h-6 w-6 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-4 bg-primary/10">
          <DollarSign className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Total Earnings</p>
          <p className="text-2xl font-bold">¥{totalEarnings.toLocaleString()}</p>
        </Card>

        <Card className="p-4 bg-primary/10">
          <TrendingUp className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Commission Rate</p>
          <p className="text-2xl font-bold">{(stats?.commission_rate * 100)}%</p>
        </Card>

        <Card className="p-4 bg-primary/10">
          <DollarSign className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Pending Payments</p>
          <p className="text-2xl font-bold">{pendingPayments}</p>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Commissions</h3>
          <div className="space-y-2">
            {stats?.commissions?.slice(0, 5).map((commission: any) => (
              <div
                key={commission.id}
                className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg"
              >
                <div>
                  <p className="font-medium">¥{commission.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(commission.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  commission.status === 'paid'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {commission.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline">View All Transactions</Button>
        </div>
      </div>
    </Card>
  );
}
