"use client";

import { useEffect, useState } from "react";
import { CharacterCard } from "./character-card";
import { getUserCharacters } from "@/lib/services/character-service";
import { useAuth } from "@/components/auth/auth-provider";
import { Loader2 } from "lucide-react";

export function CharacterGrid() {
  const { user, loading: authLoading } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      fetchCharacters();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchCharacters = async () => {
    try {
      const data = await getUserCharacters(user.id);
      setCharacters(data);
    } catch (error) {
      console.error("Error fetching characters:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium mb-2">Sign in to view your characters</h3>
        <p className="text-muted-foreground mb-4">
          Create an account or sign in to get started
        </p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium mb-2">No characters yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first character to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          id={character.id}
          name={character.name}
          description={character.description}
          imageUrl={character.appearance?.imageUrl}
        />
      ))}
    </div>
  );
} 