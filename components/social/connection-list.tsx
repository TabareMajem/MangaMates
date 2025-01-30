"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SocialService, type Connection } from "@/lib/social/social-service";
import { useState } from "react";

interface ConnectionListProps {
  initialConnections: Connection[];
  userId: string;
}

export function ConnectionList({ initialConnections, userId }: ConnectionListProps) {
  const [connections, setConnections] = useState(initialConnections);
  const [newConnectionId, setNewConnectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const socialService = new SocialService();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const connection = await socialService.sendConnectionRequest(
        userId,
        newConnectionId
      );

      setConnections([...connections, connection]);
      setNewConnectionId("");
      
      toast({
        title: "Connection Request Sent",
        description: "They will be notified of your request."
      });
    } catch (error) {
      toast({
        title: "Failed to Send Request",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <form onSubmit={handleConnect} className="flex gap-2">
          <Input
            placeholder="Enter user ID to connect"
            value={newConnectionId}
            onChange={(e) => setNewConnectionId(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            Connect
          </Button>
        </form>
      </Card>

      <div className="grid gap-4">
        {connections.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            currentUserId={userId}
          />
        ))}
      </div>
    </div>
  );
}

function ConnectionCard({ connection, currentUserId }: { 
  connection: Connection;
  currentUserId: string;
}) {
  const isReceiver = connection.connectedUserId === currentUserId;
  const displayUserId = isReceiver ? connection.userId : connection.connectedUserId;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={`/api/avatar/${displayUserId}`} />
          <AvatarFallback>
            {displayUserId.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{displayUserId}</p>
          <p className="text-sm text-muted-foreground">
            Status: {connection.status}
          </p>
        </div>
        {connection.status === 'pending' && isReceiver && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Accept</Button>
            <Button size="sm" variant="destructive">Decline</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
