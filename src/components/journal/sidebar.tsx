"use client";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, TrendingUp, Settings, Sparkles, History } from "lucide-react";
import { Link } from "react-router-dom";
import { useJournalStats } from "../../hooks/use-journal-stats";
import { StatsDisplay } from "./stats-display";
import { useState } from "react";
import { HistoryPanel } from "./history/history-panel";

export function JournalSidebar() {
  const { streak, totalEntries } = useJournalStats();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Yokaizen</h2>
        </div>
        <nav className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => setShowHistory(true)}
          >
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
          <Link to="/insights">
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Insights
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>
      </Card>
      
      <StatsDisplay streak={streak} totalEntries={totalEntries} />

      {showHistory && (
        <HistoryPanel onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}
