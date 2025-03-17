"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { characterConnectionService } from "@/lib/services/character-connection-service";
import { ConnectionCard } from "./connection-card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function ConnectionList() {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchConnections();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchConnections = async () => {
    try {
      const data = await characterConnectionService.getUserConnections(user.id);
      setConnections(data);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast({
        title: "Error",
        description: "Failed to load character connections",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (connectionId: string, isActive: boolean) => {
    try {
      await characterConnectionService.updateConnection(user.id, connectionId, {
        is_active: !isActive
      });
      
      // Update the local state
      setConnections(connections.map(conn => 
        conn.id === connectionId ? { ...conn, is_active: !isActive } : conn
      ));
      
      toast({
        title: "Success",
        description: `Character ${isActive ? "deactivated" : "activated"} successfully`
      });
    } catch (error) {
      console.error("Error toggling connection:", error);
      toast({
        title: "Error",
        description: "Failed to update connection",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (connectionId: string) => {
    try {
      await characterConnectionService.deleteConnection(user.id, connectionId);
      
      // Update the local state
      setConnections(connections.filter(conn => conn.id !== connectionId));
      
      toast({
        title: "Success",
        description: "Connection deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting connection:", error);
      toast({
        title: "Error",
        description: "Failed to delete connection",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Character Connections</h2>
        <Button onClick={() => router.push('/characters/connect')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Connection</span>
        </Button>
      </div>
      
      {connections.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <h3 className="text-lg font-medium mb-2">No connections yet</h3>
          <p className="text-muted-foreground mb-4">
            Connect your characters to LINE users to start chatting
          </p>
          <Button onClick={() => router.push('/characters/connect')}>
            Create Connection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              onToggleActive={() => handleToggleActive(connection.id, connection.is_active)}
              onDelete={() => handleDelete(connection.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 