import { MangaCharacter } from '@/types/agent';
import { animeCharacters } from './anime-characters';
import { manhwaCharacters } from './manhwa-characters';
import { kpopArtists } from './kpop-artists';

// Combine all character types
export const allCharacters: MangaCharacter[] = [
  ...animeCharacters,
  ...manhwaCharacters,
  ...kpopArtists
];

// Get character by ID
export function getCharacterById(id: string): MangaCharacter | undefined {
  return allCharacters.find(char => char.id === id);
}

// Get characters by type
export function getCharactersByType(type: 'anime' | 'manhwa' | 'idol'): MangaCharacter[] {
  return allCharacters.filter(char => char.type === type);
}

// Search characters
export function searchCharacters(query: string): MangaCharacter[] {
  const searchTerm = query.toLowerCase();
  return allCharacters.filter(char => 
    char.name.toLowerCase().includes(searchTerm) ||
    char.series?.toLowerCase().includes(searchTerm) ||
    char.traits.some(trait => trait.toLowerCase().includes(searchTerm))
  );
}
