import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { TimePickerInput } from '@/components/ui/time-picker';
import { useState } from 'react';

interface Task {
  id: string;
  type: 'daily' | 'weekly' | 'custom';
  action: string;
  time?: string;
  days?: string[];
  isActive: boolean;
  conditions?: {
    when: string;
    then: string;
  }[];
}

interface TaskProgrammingStepProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export function TaskProgrammingStep({ tasks, onTasksChange }: TaskProgrammingStepProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  const addTask = (type: Task['type']) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      type,
      action: '',
      isActive: true,
      conditions: []
    };
    const updatedTasks = [...localTasks, newTask];
    setLocalTasks(updatedTasks);
    onTasksChange(updatedTasks);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Program Agent Tasks</h3>
        <div className="space-x-2">
          <Button onClick={() => addTask('daily')}>Daily Task</Button>
          <Button onClick={() => addTask('weekly')}>Weekly Task</Button>
          <Button onClick={() => addTask('custom')}>Custom Task</Button>
        </div>
      </div>

      {localTasks.map(task => (
        <TaskCard 
          key={task.id}
          task={task}
          onUpdate={(updated) => {
            const updatedTasks = localTasks.map(t => t.id === updated.id ? updated : t);
            setLocalTasks(updatedTasks);
            onTasksChange(updatedTasks);
          }}
          onDelete={() => {
            const updatedTasks = localTasks.filter(t => t.id !== task.id);
            setLocalTasks(updatedTasks);
            onTasksChange(updatedTasks);
          }}
        />
      ))}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
}

function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between">
        <Input 
          placeholder="What should the agent do?"
          value={task.action}
          onChange={(e) => onUpdate({ ...task, action: e.target.value })}
        />
        <Switch 
          checked={task.isActive}
          onCheckedChange={(checked) => onUpdate({ ...task, isActive: checked })}
        />
      </div>

      {task.type === 'daily' && (
        <TimePickerInput
          value={task.time}
          onChange={(time) => onUpdate({ ...task, time })}
        />
      )}

      {task.type === 'weekly' && (
        <div className="space-y-2">
          <WeekdayPicker
            selected={task.days || []}
            onChange={(days) => onUpdate({ ...task, days })}
          />
          <TimePickerInput
            value={task.time}
            onChange={(time) => onUpdate({ ...task, time })}
          />
        </div>
      )}

      {task.type === 'custom' && (
        <div className="space-y-2">
          {task.conditions?.map((condition, index) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="When..."
                value={condition.when}
                onChange={(e) => {
                  const newConditions = [...(task.conditions || [])];
                  newConditions[index].when = e.target.value;
                  onUpdate({ ...task, conditions: newConditions });
                }}
              />
              <Input 
                placeholder="Then..."
                value={condition.then}
                onChange={(e) => {
                  const newConditions = [...(task.conditions || [])];
                  newConditions[index].then = e.target.value;
                  onUpdate({ ...task, conditions: newConditions });
                }}
              />
            </div>
          ))}
          <Button onClick={() => {
            onUpdate({
              ...task,
              conditions: [...(task.conditions || []), { when: '', then: '' }]
            });
          }}>
            Add Condition
          </Button>
        </div>
      )}

      <Button variant="destructive" onClick={onDelete}>Delete Task</Button>
    </div>
  );
}
