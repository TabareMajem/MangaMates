"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useJournalStats } from "@/lib/hooks/use-journal-stats";
import { Calendar, TrendingUp, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

export function JournalSidebar() {
  const { streak, totalEntries } = useJournalStats();

  return (
    <div className="space-y-4">
      <Card className="glass-card p-4">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold gradient-text">Yokaizen</h2>
        </div>
        <nav className="space-y-1">
          <Link href="/calendar">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </Link>
          <Link href="/journal/insights">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
              <TrendingUp className="mr-2 h-4 w-4" />
              Insights
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>
      </Card>
      
      <Card className="glass-card p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <span className="text-sm font-medium text-primary">{streak}</span>
            </div>
            <div>
              <p className="text-sm font-medium">Day Streak</p>
              <p className="text-xs text-muted-foreground">Keep writing!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <span className="text-sm font-medium">{totalEntries}</span>
            </div>
            <div>
              <p className="text-sm font-medium">Total Entries</p>
              <p className="text-xs text-muted-foreground">Your journey so far</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
