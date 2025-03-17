"use client";

import { BackButton } from "@/components/layout/back-button";
import { SettingsPanel } from "@/components/settings/settings-panel";

export default function ProfileSettingsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-16">
      <div className="container mx-auto px-4">
        <BackButton />
        <SettingsPanel />
      </div>
    </main>
  );
}
