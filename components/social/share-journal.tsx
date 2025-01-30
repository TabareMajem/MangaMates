"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { SocialService } from "@/lib/social/social-service";
import { useState } from "react";

interface ShareJournalProps {
  entryId: string;
  userId: string;
  connections: Array<{
    id: string;
    userId: string;
    name: string;
  }>;
}

export function ShareJournal({ entryId, userId, connections }: ShareJournalProps) {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [permissions, setPermissions] = useState<"read" | "comment">("read");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const socialService = new SocialService();

  const handleShare = async () => {
    if (!selectedUser) return;
    setLoading(true);

    try {
      await socialService.shareJournalEntry(
        userId,
        entryId,
        selectedUser,
        permissions
      );

      toast({
        title: "Journal Shared",
        description: "The user will be notified."
      });
    } catch (error) {
      toast({
        title: "Failed to Share",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share Entry</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Journal Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Share with</Label>
            <RadioGroup
              value={selectedUser}
              onValueChange={setSelectedUser}
              className="space-y-2"
            >
              {connections.map((connection) => (
                <div key={connection.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={connection.userId} id={connection.id} />
                  <Label htmlFor={connection.id}>{connection.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <RadioGroup
              value={permissions}
              onValueChange={(value: "read" | "comment") => setPermissions(value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="read" id="read" />
                <Label htmlFor="read">Read only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comment" id="comment" />
                <Label htmlFor="comment">Allow comments</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <Button
          onClick={handleShare}
          disabled={!selectedUser || loading}
          className="w-full"
        >
          {loading ? "Sharing..." : "Share"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
