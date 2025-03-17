import { Character } from '@/types/agent';
import { useState } from 'react';
import { TaskProgrammingStep } from './steps/TaskProgrammingStep';

export function AgentWizard() {
  const [step, setStep] = useState(1);
  const [agentData, setAgentData] = useState<Partial<Character>>({});
  const [tasks, setTasks] = useState<AgentTask[]>([]);

  const handleTasksUpdate = (newTasks: Task[]) => {
    setTasks(newTasks.map(task => ({
      ...task,
      agentId: agentData.id || '',
      schedule: {
        time: task.time,
        days: task.days,
        conditions: task.conditions
      }
    })));
  };

  return (
    <div className="space-y-8">
      {/* ... other steps ... */}
      
      {step === 4 && (
        <TaskProgrammingStep
          tasks={tasks}
          onTasksChange={handleTasksUpdate}
        />
      )}

      <div className="flex justify-between">
        <Button 
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button 
          onClick={async () => {
            if (step === 4) {
              // Save agent with tasks
              const agent = await saveAgent({
                ...agentData,
                tasks
              });
              // Redirect to agent dashboard
            } else {
              setStep(step + 1);
            }
          }}
        >
          {step === 4 ? 'Create Agent' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
