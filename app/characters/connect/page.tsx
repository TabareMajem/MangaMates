"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { characterConnectionService } from "@/lib/services/character-connection-service";
import { getUserCharacters } from "@/lib/services/character-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ConnectCharacterPage() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [lineUserId, setLineUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchCharacters();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCharacters = async () => {
    try {
      const data = await getUserCharacters(user.id);
      setCharacters(data);
    } catch (error) {
      console.error("Error fetching characters:", error);
      toast({
        title: "Error",
        description: "Failed to load characters",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCharacter || !lineUserId) {
      toast({
        title: "Validation Error",
        description: "Please select a character and enter a LINE user ID",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      await characterConnectionService.connectCharacter(
        user.id,
        selectedCharacter,
        lineUserId
      );
      
      toast({
        title: "Success",
        description: "Character connected successfully"
      });
      
      router.push('/characters/connections');
    } catch (error) {
      console.error("Error connecting character:", error);
      toast({
        title: "Error",
        description: "Failed to connect character",
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

  return (
    <div className="container max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Connect Character</CardTitle>
          <CardDescription>
            Connect your character to a LINE user to enable messaging
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="character">Select Character</Label>
              <Select
                value={selectedCharacter}
                onValueChange={setSelectedCharacter}
              >
                <SelectTrigger id="character">
                  <SelectValue placeholder="Select a character" />
                </SelectTrigger>
                <SelectContent>
                  {characters.map((character) => (
                    <SelectItem key={character.id} value={character.id}>
                      {character.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lineUserId">LINE User ID</Label>
              <Input
                id="lineUserId"
                placeholder="Enter LINE user ID"
                value={lineUserId}
                onChange={(e) => setLineUserId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can find this in your LINE app settings or when a user adds your LINE bot
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Character"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 