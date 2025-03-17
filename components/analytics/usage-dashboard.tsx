"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsageAnalytics, type UsageMetrics, type UsageTrend } from "@/lib/analytics/usage-analytics";
import { useAuth } from "@/lib/auth/context";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function UsageDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [trends, setTrends] = useState<UsageTrend[]>([]);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const [metricsData, trendsData] = await Promise.all([
        UsageAnalytics.getUserMetrics(user.id),
        UsageAnalytics.getUsageTrends(user.id, timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90)
      ]);

      setMetrics(metricsData);
      setTrends(trendsData);
    };

    loadData();
  }, [user, timeframe]);

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Entries</h3>
          <p className="text-2xl font-bold">{metrics.totalEntries}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">AI Analyses</h3>
          <p className="text-2xl font-bold">{metrics.aiAnalyses}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Character Chats</h3>
          <p className="text-2xl font-bold">{metrics.characterChats}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Storage Used</h3>
          <p className="text-2xl font-bold">{(metrics.storageUsed / 1024 / 1024).toFixed(1)} MB</p>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1 rounded-md ${
                timeframe === '7d' ? 'bg-primary text-white' : 'bg-secondary'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1 rounded-md ${
                timeframe === '30d' ? 'bg-primary text-white' : 'bg-secondary'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimeframe('90d')}
              className={`px-3 py-1 rounded-md ${
                timeframe === '90d' ? 'bg-primary text-white' : 'bg-secondary'
              }`}
            >
              90D
            </button>
          </div>

          <TabsContent value="activity" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="entries" stroke="#10b981" />
                <Line type="monotone" dataKey="aiCalls" stroke="#6366f1" />
                <Line type="monotone" dataKey="characterChats" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
