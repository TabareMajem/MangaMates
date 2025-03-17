import { JournalEditor } from "@/components/journal/editor";
import { JournalHeader } from "@/components/journal/header";
import { JournalSidebar } from "@/components/journal/sidebar";

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
        <JournalSidebar />
        <div className="space-y-6">
          <JournalHeader />
          <JournalEditor />
        </div>
      </div>
    </main>
  );
}
