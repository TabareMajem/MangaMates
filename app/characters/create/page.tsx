"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/layout/back-button";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createCharacter } from "@/lib/services/character-service";

export default function CreateCharacterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("");
  const [background, setBackground] = useState("");
  const [voiceStyle, setVoiceStyle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a character",
          variant: "destructive"
        });
        return;
      }

      const character = await createCharacter(user.id, {
        name,
        description,
        personality,
        background,
        voiceStyle,
        goals: [],
        appearance: {},
        traits: {}
      });

      toast({
        title: "Character created",
        description: `${name} has been created successfully.`
      });

      router.push(`/characters/${character.id}`);
    } catch (error) {
      console.error("Error creating character:", error);
      toast({
        title: "Error",
        description: "Failed to create character",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        <h1 className="text-2xl font-bold mb-6">Create New Character</h1>
        
        <Card className="p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Character name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Brief description of the character"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Personality</label>
              <Textarea
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Character's personality traits and behaviors"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Background</label>
              <Textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Character's history and background story"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Voice Style</label>
              <Input
                value={voiceStyle}
                onChange={(e) => setVoiceStyle(e.target.value)}
                placeholder="How the character speaks"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Character"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
} 