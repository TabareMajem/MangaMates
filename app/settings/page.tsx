import { SettingsPanel } from "@/components/settings/settings-panel";
import { BackButton } from "@/components/layout/back-button";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <SettingsPanel />
      </div>
    </main>
  );
}
