import { CalendarView } from "@/components/calendar/calendar-view";
import { BackButton } from "@/components/layout/back-button";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <CalendarView />
      </div>
    </main>
  );
}
