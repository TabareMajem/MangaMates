"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PersonalityStep } from "./steps/personality-step";
import { GoalsStep } from "./steps/goals-step";
import { MessagingStep } from "./steps/messaging-step";
import { ReviewStep } from "./steps/review-step";
import type { AgentPersonality, AgentGoal } from "@/types/agent";
import type { MessagingProvider } from "@/types/messaging";

export function AgentWizard() {
  const [step, setStep] = useState(1);
  const [personality, setPersonality] = useState<AgentPersonality | null>(null);
  const [goals, setGoals] = useState<AgentGoal[]>([]);
  const [messaging, setMessaging] = useState<MessagingProvider | null>(null);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Create AI Agent</h2>
          <span className="text-sm text-muted-foreground">
            Step {step} of 4
          </span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full">
          <div 
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <PersonalityStep
          onNext={handleNext}
          onSelect={setPersonality}
          selected={personality}
        />
      )}
      {step === 2 && (
        <GoalsStep
          onNext={handleNext}
          onBack={handleBack}
          onGoalsChange={setGoals}
          goals={goals}
        />
      )}
      {step === 3 && (
        <MessagingStep
          onNext={handleNext}
          onBack={handleBack}
          onConfigChange={setMessaging}
        />
      )}
      {step === 4 && (
        <ReviewStep
          onBack={handleBack}
          personality={personality!}
          goals={goals}
          messaging={messaging}
        />
      )}
    </Card>
  );
}
