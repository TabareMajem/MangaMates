"use client";

import { useState } from 'react';
import { useToast } from '../components/ui/toast';

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
      toast("Journal entry saved successfully", "success");
    } catch (error) {
      toast("Failed to save journal entry", "error");
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