"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ScheduleList } from "@/components/character/schedule/schedule-list";
import { ScheduleForm } from "@/components/character/schedule/schedule-form";
import { BackButton } from "@/components/layout/back-button";

export default function CharacterSchedulePage() {
  const params = useParams();
  const characterId = params.id as string;
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        <h1 className="text-2xl font-bold mb-6">Character Schedule</h1>
        
        {showForm ? (
          <div className="mb-8">
            <ScheduleForm 
              characterId={characterId}
              onSuccess={() => setShowForm(false)}
            />
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 text-sm text-muted-foreground hover:text-primary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <ScheduleList 
            characterId={characterId}
            onAddNew={() => setShowForm(true)}
          />
        )}
      </div>
    </main>
  );
} 