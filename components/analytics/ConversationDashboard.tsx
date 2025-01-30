"use client";

import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getConversationStats } from "@/lib/services/analytics-service";
import type { ConversationStats } from "@/types/analytics";
import { startOfDay, subDays } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { LineChart } from "../charts/LineChart";

interface ConversationDashboardProps {
  userId: string;
  className?: string;
}

interface ChartData {
  date: string;
  messages: number;
  responses: number;
  sentiment: number;
}

export function ConversationDashboard({ userId, className }: ConversationDashboardProps) {
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: startOfDay(subDays(new Date(), 30)),
    end: startOfDay(new Date())
  });
  const { toast } = useToast();

  const loadStats = useCallback(async () => {
    try {
      const data = await getConversationStats(userId, {
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString()
      });
      setStats(data);
    } catch (error) {
      console.error('Failed to load conversation stats:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, dateRange, toast]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleDateChange = (date: Date | null, type: 'start' | 'end') => {
    if (!date) return;

    setDateRange(prev => ({
      ...prev,
      [type]: startOfDay(date)
    }));
  };

  const formatChartData = (stats: ConversationStats): ChartData[] => {
    return Object.entries(stats.dailyStats).map(([date, data]) => ({
      date,
      messages: data.messageCount,
      responses: data.responseCount,
      sentiment: data.averageSentiment
    }));
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats) return null;

  const chartData = formatChartData(stats);

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Conversation Analytics</h2>
        <div className="flex gap-4">
          <DatePicker
            date={dateRange.start}
            onChange={(date) => handleDateChange(date, 'start')}
            placeholder="Start date"
          />
          <DatePicker
            date={dateRange.end}
            onChange={(date) => handleDateChange(date, 'end')}
            placeholder="End date"
            disabled={(date) => date > new Date() || date < dateRange.start}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatsCard
          title="Total Messages"
          value={stats.totalMessages}
          description="Total messages sent and received"
        />
        <StatsCard
          title="Average Response Time"
          value={`${stats.averageResponseTime.toFixed(1)}s`}
          description="Average time to respond"
        />
        <StatsCard
          title="Sentiment Score"
          value={stats.averageSentiment.toFixed(2)}
          description="Average conversation sentiment"
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Message Volume Trends</h3>
        <div className="h-[300px]">
          <LineChart
            data={chartData}
            xKey="date"
            yKey="messages"
            color="#2563eb"
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Topics</h3>
          <div className="space-y-4">
            {stats.topTopics.map((topic, index) => (
              <TopicItem
                key={topic.name}
                topic={topic}
                rank={index + 1}
              />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
          <div className="h-[300px]">
            <LineChart
              data={chartData}
              xKey="date"
              yKey="sentiment"
              color="#10b981"
            />
          </div>
        </Card>
      </div>
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

interface TopicItemProps {
  topic: {
    name: string;
    count: number;
    sentiment: number;
  };
  rank: number;
}

function TopicItem({ topic, rank }: TopicItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-muted-foreground">
          {rank}
        </span>
        <div>
          <p className="font-medium">{topic.name}</p>
          <p className="text-sm text-muted-foreground">
            {topic.count} mentions
          </p>
        </div>
      </div>
      <div className="text-sm font-medium">
        Sentiment: {topic.sentiment.toFixed(2)}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

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
