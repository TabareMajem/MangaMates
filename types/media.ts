export type MediaType = 'ANIME' | 'MANGA';
export type MediaFormat = 'TV' | 'MOVIE' | 'OVA' | 'MANGA' | 'NOVEL';
export type MediaStatus = 'finished' | 'releasing' | 'not_yet_released' | 'cancelled';
export type MediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

export interface Media {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  type: string;
  format: MediaFormat;
  status: MediaStatus;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  season: MediaSeason | null;
  episodes: number | null;
  duration: number | null;
  source: string | null;
  genres: string[];
  averageScore: number | null;
  popularity: number;
  coverImage: {
    large: string;
    medium: string;
  };
}

export interface MediaSearchParams {
  search?: string;
  type: MediaType;
  perPage?: number;
  genres?: string[];
  season?: MediaSeason;
  year?: number;
  format?: MediaFormat;
  status?: MediaStatus;
}

export interface MediaListEntry {
  id: number;
  mediaId: number;
  status: 'watching' | 'completed' | 'paused' | 'dropped' | 'planning';
  score: number | null;
  progress: number;
  startDate: string | null;
  completedDate: string | null;
  notes: string | null;
}

export interface MediaCollection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  media: Media[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
