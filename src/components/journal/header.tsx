"use client";

import { format } from "date-fns";

export function JournalHeader() {
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");

  return (
    <header className="mb-6">
      <h1 className="mb-1 text-3xl font-bold text-primary">Journal Entry</h1>
      <p className="text-lg text-muted-foreground">{formattedDate}</p>
    </header>
  );
}
