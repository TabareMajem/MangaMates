"use client";

import { JournalAnalysis } from '@/components/ai/journal-analysis';
import { JournalEditor } from '@/components/journal/editor';
import { Skeleton } from '@/components/ui/skeleton';
import { useJournalEntries } from '@/hooks/use-journal-entries';

export default function JournalPage() {
  const { entries, isLoading, error } = useJournalEntries();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Journal</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <JournalEditor />
        </div>
        
        <div>
          <JournalAnalysis entries={entries.map(e => e.content)} />
        </div>
      </div>
    </div>
  );
}
