import { AgentWizard } from "@/components/agents/wizard/agent-wizard";
import { BackButton } from "@/components/layout/back-button";

export default function CreateAgentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <AgentWizard />
      </div>
    </main>
  );
}
