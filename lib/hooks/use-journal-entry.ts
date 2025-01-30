"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { createEntry } from '@/lib/services/journal';
import { updateStreak } from '@/lib/services/user-stats';
import { useToast } from '@/components/ui/use-toast';

export function useJournalEntry() {
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const saveEntry = async (content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your journal entry.",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something before saving.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      await createEntry(user.id, content);
      await updateStreak(user.id);
      
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    saveEntry,
    saving
  };
}
