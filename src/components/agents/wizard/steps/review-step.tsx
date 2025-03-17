"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateAgent } from "@/hooks/use-create-agent";
import { useNavigate } from "react-router-dom";
import type { AgentPersonality, AgentGoal } from "@/types/agent";
import type { MessagingProvider } from "@/types/messaging";

interface ReviewStepProps {
  onBack: () => void;
  personality: AgentPersonality;
  goals: AgentGoal[];
  messaging: MessagingProvider | null;
}

export function ReviewStep({ 
  onBack, 
  personality, 
  goals,
  messaging 
}: ReviewStepProps) {
  const { toast } = useToast();
  const { create, loading } = useCreateAgent();
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const agent = await create(personality, goals, messaging);
      
      toast({
        title: "Success",
        description: "AI Agent created successfully!"
      });

      if (messaging?.enabled) {
        toast({
          title: "Messaging Integration",
          description: `Your agent is now available on ${messaging.type.toUpperCase()}!`
        });
      }

      navigate(`/agents/${agent.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create AI Agent",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personality</h3>
        <div className="rounded-lg border p-4">
          <h4 className="font-medium mb-2">{personality.name}</h4>
          <p className="text-muted-foreground mb-4">{personality.background}</p>
          <div className="flex flex-wrap gap-2">
            {personality.traits.map(trait => (
              <span
                key={trait}
                className="px-2 py-1 text-xs rounded-full bg-secondary"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Goals</h3>
        <div className="space-y-2">
          {goals.map(goal => (
            <div key={goal.id} className="rounded-lg border p-4">
              <h4 className="font-medium mb-1">{goal.title}</h4>
              <p className="text-sm text-muted-foreground">{goal.description}</p>
            </div>
          ))}
        </div>
      </div>

      {messaging?.enabled && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Messaging Integration</h3>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Your agent will be available on {messaging.type.toUpperCase()}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create Agent"}
        </Button>
      </div>
    </div>
  );
}
