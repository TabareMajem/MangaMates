"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { TimePickerInput } from "@/components/ui/time-picker";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface ScheduleFormProps {
  characterId: string;
  onSuccess?: () => void;
}

export function ScheduleForm({ characterId, onSuccess }: ScheduleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [time, setTime] = useState("09:00");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [recipientId, setRecipientId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create schedule
      const scheduleResponse = await fetch(`/api/characters/${characterId}/schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          pattern: {
            frequency,
            time,
            days: frequency === "weekly" ? ["Monday", "Wednesday", "Friday"] : undefined
          }
        })
      });

      if (!scheduleResponse.ok) {
        throw new Error("Failed to create schedule");
      }

      const schedule = await scheduleResponse.json();

      // Schedule first message if recipient provided
      if (recipientId && date) {
        const scheduledDate = new Date(date);
        const [hours, minutes] = time.split(":").map(Number);
        scheduledDate.setHours(hours, minutes);

        const messageResponse = await fetch(`/api/schedules/${schedule.id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientId,
            scheduledFor: scheduledDate.toISOString()
          })
        });

        if (!messageResponse.ok) {
          throw new Error("Failed to schedule message");
        }
      }

      toast({
        title: "Schedule created",
        description: "Your character schedule has been created successfully."
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Schedule Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Daily morning greeting"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Character will send a morning greeting message"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Frequency</label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly (Mon, Wed, Fri)</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 opacity-70" />
            <TimePickerInput value={time} onChange={setTime} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">LINE Recipient ID</label>
          <Input
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            placeholder="U1234567890abcdef"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Optional: Schedule first message immediately
          </p>
        </div>

        {recipientId && (
          <div>
            <label className="block text-sm font-medium mb-1">First Message Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Schedule"}
        </Button>
      </form>
    </Card>
  );
} 