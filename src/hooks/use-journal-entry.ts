"use client";

import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export function useJournalEntry() {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const saveEntry = async (content: string) => {
    if (!content.trim()) {
      toast("Please write something before saving", "error");
      return;
    }

    try {
      setSaving(true);
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Success",
        description: "Journal entry saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
      console.error('Error saving entry:', error);
    } finally {
      setSaving(false);
    }
  };

  return {
    saveEntry,
    saving
  };
}
