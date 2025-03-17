"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { SupportService } from "@/lib/support/support-service";
import { useState } from "react";

export function SupportTicketForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const supportService = new SupportService();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const ticket = await supportService.createTicket(user!.id, {
        type: formData.get('type') as any,
        priority: formData.get('priority') as any,
        title: formData.get('title') as string,
        description: formData.get('description') as string
      });

      toast({
        title: "Ticket Created",
        description: `Your ticket #${ticket.id} has been created. We'll respond shortly.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select name="type" required>
        <option value="">Select Issue Type</option>
        <option value="bug">Bug Report</option>
        <option value="feature">Feature Request</option>
        <option value="billing">Billing Issue</option>
        <option value="other">Other</option>
      </Select>

      <Select name="priority" required>
        <option value="">Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>

      <Input
        name="title"
        placeholder="Brief description of the issue"
        required
      />

      <Textarea
        name="description"
        placeholder="Detailed description..."
        required
        rows={5}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Ticket"}
      </Button>
    </form>
  );
}
