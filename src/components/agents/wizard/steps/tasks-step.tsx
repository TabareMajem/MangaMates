"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { AgentTask } from "@/types/agent";

interface TasksStepProps {
  onNext: () => void;
  onBack: () => void;
  onTasksChange: (tasks: AgentTask[]) => void;
  tasks: AgentTask[];
}

export function TasksStep({ onNext, onBack, onTasksChange, tasks }: TasksStepProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    schedule: "",
    enabled: true
  });

  const addTask = () => {
    if (newTask.title && newTask.description) {
      onTasksChange([
        ...tasks,
        { ...newTask, id: Date.now().toString() }
      ]);
      setNewTask({
        title: "",
        description: "",
        schedule: "",
        enabled: true
      });
    }
  };

  const toggleTask = (id: string) => {
    onTasksChange(
      tasks.map(t => 
        t.id === id ? { ...t, enabled: !t.enabled } : t
      )
    );
  };

  const deleteTask = (id: string) => {
    onTasksChange(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configure Automated Tasks</h3>
        <p className="text-sm text-muted-foreground">
          Set up recurring tasks for your AI agent to perform
        </p>

        <Card className="p-4 space-y-4">
          <Input
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <Textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <Input
            placeholder="Schedule (cron expression)"
            value={newTask.schedule}
            onChange={(e) => setNewTask({ ...newTask, schedule: e.target.value })}
          />
          <Button onClick={addTask} className="w-full">
            Add Task
          </Button>
        </Card>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                {task.schedule && (
                  <p className="text-xs text-primary mt-1">Schedule: {task.schedule}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={task.enabled}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
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
