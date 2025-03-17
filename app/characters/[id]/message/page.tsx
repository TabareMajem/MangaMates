"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { characterMessagingService } from "@/lib/services/character-messaging-service";
import { characterConnectionService } from "@/lib/services/character-connection-service";
import { getCharacter } from "@/lib/services/character-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CharacterMessagePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [character, setCharacter] = useState(null);
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, params.id]);

  const fetchData = async () => {
    try {
      // Get character details
      const characterData = await getCharacter(params.id);
      setCharacter(characterData);
      
      // Get connections for this character
      const connectionsData = await characterConnectionService.getUserConnections(user.id);
      const filteredConnections = connectionsData.filter(
        conn => conn.character_id === params.id && conn.is_active
      );
      setConnections(filteredConnections);
      
      if (filteredConnections.length > 0) {
        setSelectedConnection(filteredConnections[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load character data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedConnection || !message) {
      toast({
        title: "Validation Error",
        description: "Please select a connection and enter a message",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Find the selected connection
      const connection = connections.find(conn => conn.id === selectedConnection);
      
      if (!connection) {
        throw new Error("Selected connection not found");
      }
      
      // Send the message
      await characterMessagingService.sendCharacterMessage(
        params.id,
        connection.line_user_id,
        message
      );
      
      toast({
        title: "Success",
        description: "Message sent successfully"
      });
      
      // Clear the message
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Character Not Found</h2>
        <p className="mb-4">The character you're looking for doesn't exist or you don't have access to it.</p>
        <Button onClick={() => router.push('/characters')}>
          Back to Characters
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={character.appearance?.imageUrl} 
              alt={character.name} 
            />
            <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{character.name}</CardTitle>
            <CardDescription>
              Send a message as this character
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {connections.length === 0 ? (
              <div className="text-center p-4 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground mb-2">
                  No active connections for this character
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/characters/connect')}
                >
                  Create Connection
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Recipient
                </label>
                <Select
                  value={selectedConnection}
                  onValueChange={setSelectedConnection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map((conn) => (
                      <SelectItem key={conn.id} value={conn.id}>
                        {conn.line_users.display_name || conn.line_user_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Message
              </label>
              <Textarea
                placeholder={`What would ${character.name} say?`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full flex items-center gap-2"
              disabled={submitting || connections.length === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 