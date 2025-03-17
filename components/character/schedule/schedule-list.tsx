"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Calendar, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ScheduledMessages } from "./scheduled-messages";

interface Schedule {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  schedule: {
    frequency: string;
    time: string;
    days?: string[];
  };
  created_at: string;
  showMessages?: boolean;
}

interface ScheduleListProps {
  characterId: string;
  onAddNew: () => void;
}

export function ScheduleList({ characterId, onAddNew }: ScheduleListProps) {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, [characterId]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`/api/characters/${characterId}/schedules`);
      if (!response.ok) throw new Error("Failed to fetch schedules");
      
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load schedules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;
    
    try {
      const response = await fetch(`/api/schedules/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Failed to delete schedule");
      
      setSchedules(schedules.filter(s => s.id !== id));
      toast({
        title: "Schedule deleted",
        description: "The schedule has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete schedule",
        variant: "destructive"
      });
    }
  };

  const toggleMessages = (id: string) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, showMessages: !s.showMessages } : s
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Character Schedules</h3>
        <Button onClick={onAddNew}>Add New Schedule</Button>
      </div>

      {schedules.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No schedules found</p>
          <Button variant="outline" className="mt-4" onClick={onAddNew}>
            Create Your First Schedule
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="p-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{schedule.name}</h4>
                  <p className="text-sm text-muted-foreground">{schedule.description}</p>
                  
                  <div className="flex items-center mt-2 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="mr-4">{schedule.schedule.time}</span>
                    
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {schedule.schedule.frequency === "daily" 
                        ? "Every day" 
                        : schedule.schedule.frequency === "weekly" && schedule.schedule.days
                          ? schedule.schedule.days.join(", ")
                          : schedule.schedule.frequency}
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => deleteSchedule(schedule.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleMessages(schedule.id)}
                >
                  {schedule.showMessages ? "Hide Messages" : "Show Messages"}
                </Button>
              </div>
              
              {schedule.showMessages && (
                <ScheduledMessages scheduleId={schedule.id} />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 