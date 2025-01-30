"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { AgentGoal } from "@/types/agent";

interface GoalsStepProps {
  onNext: () => void;
  onBack: () => void;
  onGoalsChange: (goals: AgentGoal[]) => void;
  goals: AgentGoal[];
}

export function GoalsStep({ onNext, onBack, onGoalsChange, goals }: GoalsStepProps) {
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    metrics: [""]
  });

  const addGoal = () => {
    if (newGoal.title && newGoal.description) {
      onGoalsChange([...goals, { ...newGoal, id: Date.now().toString() }]);
      setNewGoal({ title: "", description: "", metrics: [""] });
    }
  };

  const removeGoal = (id: string) => {
    onGoalsChange(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Goal title"
          className="w-full p-2 rounded-md border border-input bg-background"
          value={newGoal.title}
          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
        />
        <textarea
          placeholder="Goal description"
          className="w-full p-2 rounded-md border border-input bg-background min-h-[100px]"
          value={newGoal.description}
          onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
        />
        <Button
          onClick={addGoal}
          disabled={!newGoal.title || !newGoal.description}
          className="w-full"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="p-4 rounded-lg border border-border relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => removeGoal(goal.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <h4 className="font-semibold mb-2">{goal.title}</h4>
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={goals.length === 0}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
