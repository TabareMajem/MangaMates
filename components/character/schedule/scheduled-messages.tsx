"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface ScheduledMessage {
  id: string;
  recipient_id: string;
  status: 'pending' | 'sent' | 'failed';
  scheduled_for: string;
  sent_at?: string;
  content?: string;
  error?: string;
}

interface ScheduledMessagesProps {
  scheduleId: string;
}

export function ScheduledMessages({ scheduleId }: ScheduledMessagesProps) {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, [scheduleId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}/messages`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching scheduled messages:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No scheduled messages</p>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <h4 className="text-sm font-medium">Scheduled Messages</h4>
      {messages.map((message) => (
        <Card key={message.id} className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={
                  message.status === 'sent' ? 'default' : 
                  message.status === 'pending' ? 'outline' : 'destructive'
                }>
                  {message.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.scheduled_for), "PPP 'at' p")}
                </span>
              </div>
              
              {message.content && (
                <p className="text-sm mt-2 line-clamp-2">{message.content}</p>
              )}
              
              {message.error && (
                <p className="text-xs text-destructive mt-1">{message.error}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 