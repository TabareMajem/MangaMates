"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCharacter } from "@/lib/services/character-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MessageCircle, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/layout/back-button";
import { useToast } from "@/hooks/use-toast";

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const characterId = params.id as string;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacter();
  }, [characterId]);

  const fetchCharacter = async () => {
    try {
      const data = await getCharacter(characterId);
      setCharacter(data);
    } catch (error) {
      console.error("Error fetching character:", error);
      toast({
        title: "Error",
        description: "Failed to load character details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this character?")) return;
    
    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Failed to delete character");
      
      toast({
        title: "Character deleted",
        description: "The character has been deleted successfully."
      });
      
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete character",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Character not found</h2>
          <p className="text-muted-foreground mb-4">
            The character you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        <div className="md:col-span-1">
          <Card className="p-6">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-5xl font-bold text-primary/70">{character.name.charAt(0)}</span>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{character.name}</h1>
            <p className="text-muted-foreground mb-6">{character.description}</p>
            
            <div className="space-y-3">
              <Link href={`/chat/${characterId}`} className="w-full">
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Now
                </Button>
              </Link>
              
              <Link href={`/characters/${characterId}/schedule`} className="w-full">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Schedule
                </Button>
              </Link>
              
              <Link href={`/characters/${characterId}/edit`} className="w-full">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Character
                </Button>
              </Link>
              
              <Button variant="destructive" className="w-full" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Character
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Character Details</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Personality</h3>
                <p className="text-muted-foreground">{character.personality}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Background</h3>
                <p className="text-muted-foreground">{character.background}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Voice Style</h3>
                <p className="text-muted-foreground">{character.voiceStyle}</p>
              </div>
              
              {character.goals && character.goals.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Goals</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {character.goals.map((goal, index) => (
                      <li key={index} className="text-muted-foreground">{goal}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 