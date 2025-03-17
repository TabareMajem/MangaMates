interface TaskSchedule {
  type: 'daily' | 'weekly' | 'custom';
  time?: string;
  days?: string[];
  conditions?: Array<{
    when: string;
    then: string;
  }>;
}

export function parseSchedule(scheduleData: any): TaskSchedule {
  return {
    type: scheduleData.type,
    time: scheduleData.time,
    days: scheduleData.days,
    conditions: scheduleData.conditions
  };
}

export function getNextDailyRun(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const next = new Date();
  next.setHours(hours, minutes, 0, 0);
  
  if (next <= new Date()) {
    next.setDate(next.getDate() + 1);
  }
  
  return next;
}

export function getNextWeeklyRun(days: string[], timeStr: string): Date {
  const now = new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);
  const dayIndices = days.map(day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day));
  
  let nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);
  
  while (
    !dayIndices.includes(nextRun.getDay()) || 
    nextRun <= now
  ) {
    nextRun.setDate(nextRun.getDate() + 1);
  }
  
  return nextRun;
}
