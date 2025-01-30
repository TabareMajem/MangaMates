"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock, AlertCircle, MessageSquare, Calendar } from "lucide-react";
import type { AgentTrigger } from "@/types/agent";

interface TriggersStepProps {
  onNext: () => void;
  onBack: () => void;
  onTriggersChange: (triggers: AgentTrigger[]) => void;
  triggers: AgentTrigger[];
}

const triggerTypes = [
  { value: 'schedule', label: 'Schedule', icon: Calendar },
  { value: 'emotion', label: 'Emotion Detection', icon: AlertCircle },
  { value: 'keyword', label: 'Keyword', icon: MessageSquare },
  { value: 'time', label: 'Time of Day', icon: Clock }
];

export function TriggersStep({ onNext, onBack, onTriggersChange, triggers }: TriggersStepProps) {
  const [newTrigger, setNewTrigger] = useState({
    type: 'schedule',
    condition: '',
    action: '',
    enabled: true
  });

  const addTrigger = () => {
    if (newTrigger.condition && newTrigger.action) {
      onTriggersChange([
        ...triggers,
        { ...newTrigger, id: Date.now().toString() }
      ]);
      setNewTrigger({
        type: 'schedule',
        condition: '',
        action: '',
        enabled: true
      });
    }
  };

  const toggleTrigger = (id: string) => {
    onTriggersChange(
      triggers.map(t => 
        t.id === id ? { ...t, enabled: !t.enabled } : t
      )
    );
  };

  const deleteTrigger = (id: string) => {
    onTriggersChange(triggers.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add Proactive Behaviors</h3>
        <p className="text-sm text-muted-foreground">
          Configure when and how your AI agent should proactively interact
        </p>

        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={newTrigger.type}
              onValueChange={(value) => setNewTrigger({ ...newTrigger, type: value })}
              options={triggerTypes.map(t => ({ value: t.value, label: t.label }))}
            />
            <Input
              placeholder="Condition"
              value={newTrigger.condition}
              onChange={(e) => setNewTrigger({ ...newTrigger, condition: e.target.value })}
            />
          </div>
          <Input
            placeholder="Action"
            value={newTrigger.action}
            onChange={(e) => setNewTrigger({ ...newTrigger, action: e.target.value })}
          />
          <Button onClick={addTrigger} className="w-full">
            Add Trigger
          </Button>
        </Card>
      </div>

      <div className="space-y-4">
        {triggers.map((trigger) => {
          const TypeIcon = triggerTypes.find(t => t.value === trigger.type)?.icon;
          
          return (
            <Card key={trigger.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {TypeIcon && <TypeIcon className="h-5 w-5 text-primary" />}
                  <div>
                    <p className="font-medium">{trigger.condition}</p>
                    <p className="text-sm text-muted-foreground">{trigger.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={trigger.enabled}
                    onCheckedChange={() => toggleTrigger(trigger.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTrigger(trigger.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
