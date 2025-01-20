import { TaskScheduler } from '@/lib/services/task-scheduler';

const scheduler = new TaskScheduler();

export async function initializeScheduler() {
  // Get all agents with active tasks
  const agents = await getAllAgentsWithTasks();
  
  // Schedule tasks for each agent
  for (const agent of agents) {
    await scheduler.scheduleAgentTasks(agent.id);
  }
}

// Export scheduler instance for use in other parts of the app
export { scheduler };
