"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getReferralStats, ReferralStats } from "@/lib/services/referral-service";
import { useCallback, useEffect, useState } from "react";
import { LineChart } from "../charts/LineChart";

interface ReferralDashboardProps {
  userId: string;
  className?: string;
}

interface ChartData {
  date: string;
  referrals: number;
  conversions: number;
}

export function ReferralDashboard({ userId, className }: ReferralDashboardProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadStats = useCallback(async () => {
    try {
      const data = await getReferralStats(userId);
      setStats(data);
    } catch (error) {
      console.error('Failed to load referral stats:', error);
      toast({
        title: "Error",
        description: "Failed to load referral statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const formatChartData = (stats: ReferralStats): ChartData[] => {
    return Object.entries(stats.dailyStats).map(([date, data]) => ({
      date,
      referrals: data.referrals,
      conversions: data.conversions
    }));
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats) return null;

  const chartData = formatChartData(stats);

  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatsCard
          title="Total Referrals"
          value={stats.totalReferrals}
          description="Total number of referred users"
        />
        <StatsCard
          title="Conversions"
          value={stats.totalConversions}
          description="Number of successful conversions"
        />
        <StatsCard
          title="Earnings"
          value={`$${stats.totalEarnings.toFixed(2)}`}
          description="Total referral earnings"
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Referral Trends</h3>
        <div className="h-[300px]">
          <LineChart
            data={chartData}
            xKey="date"
            yKey="referrals"
            color="#2563eb"
          />
        </div>
      </Card>

      <Card className="p-6 mt-4">
        <h3 className="text-lg font-semibold mb-4">Recent Referrals</h3>
        <div className="space-y-4">
          {stats.recentReferrals.map((referral) => (
            <ReferralItem
              key={referral.id}
              referral={referral}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
}

function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <Card className="p-6">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </Card>
  );
}

interface ReferralItemProps {
  referral: {
    id: string;
    referredUser: string;
    status: 'pending' | 'converted';
    date: string;
    reward?: number;
  };
}

function ReferralItem({ referral }: ReferralItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div>
        <p className="font-medium">{referral.referredUser}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(referral.date).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm ${
          referral.status === 'converted' ? 'text-green-600' : 'text-yellow-600'
        }`}>
          {referral.status === 'converted' ? 'Converted' : 'Pending'}
        </span>
        {referral.reward && (
          <span className="text-sm font-medium">
            ${referral.reward.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-32 mt-2" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <Skeleton className="h-[300px]" />
      </Card>
    </div>
  );
}
