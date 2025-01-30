"use client";

import { useState } from 'react';
import { useJournalHistory, JournalHistoryEntry } from '../../../hooks/use-journal-history';
import { HistoryList } from './history-list';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { History, X } from 'lucide-react';

interface HistoryPanelProps {
  onClose: () => void;
}

export function HistoryPanel({ onClose }: HistoryPanelProps) {
  const { entries, loading } = useJournalHistory();
  const [selectedEntry, setSelectedEntry] = useState<JournalHistoryEntry | null>(null);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Journal History</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading entries...</p>
      ) : (
        <HistoryList 
          entries={entries} 
          onSelect={setSelectedEntry}
        />
      )}

      {selectedEntry && (
        <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Selected Entry
          </p>
          <p>{selectedEntry.content}</p>
        </div>
      )}
    </Card>
  );
}
