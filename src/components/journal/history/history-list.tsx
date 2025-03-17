"use client";

import { format } from 'date-fns';
import { JournalHistoryEntry } from '../../../hooks/use-journal-history';
import { Card } from '../../ui/card';

interface HistoryListProps {
  entries: JournalHistoryEntry[];
  onSelect: (entry: JournalHistoryEntry) => void;
}

export function HistoryList({ entries, onSelect }: HistoryListProps) {
  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card
          key={entry.id}
          className="p-4 cursor-pointer hover:bg-secondary/10 transition-colors"
          onClick={() => onSelect(entry)}
        >
          <p className="text-sm text-muted-foreground mb-2">
            {format(entry.createdAt, 'MMMM d, yyyy')}
          </p>
          <p className="text-sm line-clamp-2">{entry.content}</p>
        </Card>
      ))}
    </div>
  );
}
