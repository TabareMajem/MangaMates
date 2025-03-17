import { format } from "date-fns";

export function JournalHeader() {
  return (
    <header className="mb-6">
      <h1 className="mb-1 text-3xl font-bold text-primary">Journal Entry</h1>
      <p className="text-lg text-muted-foreground">
        {format(new Date(), "EEEE, MMMM d, yyyy")}
      </p>
    </header>
  );
}
