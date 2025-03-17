export interface SearchCriteria {
  search?: string;
  genres?: string[];
  year?: number;
  tags?: string[];
}

export interface MangaResult {
  id: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  genres: string[];
  averageScore: number;
  popularity: number;
  coverImage: {
    large: string;
  };
}

export interface CharacterResult {
  id: string;
  name: {
    full: string;
    native: string;
  };
  description: string;
  image: {
    large: string;
  };
  media: {
    nodes: Array<{
      title: {
        romaji: string;
      };
    }>;
  };
  favourites: number;
}

export interface AnimeMedia {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  type: 'ANIME' | 'MANGA';
  format: MediaFormat;
  status: MediaStatus;
  description: string;
  startDate: FuzzyDate;
  endDate: FuzzyDate;
  season: Season;
  seasonYear: number;
  episodes?: number;
  duration?: number;
  chapters?: number;
  volumes?: number;
  genres: string[];
  tags: MediaTag[];
  coverImage: {
    large: string;
    medium: string;
  };
  bannerImage?: string;
  averageScore?: number;
  popularity: number;
  trending: number;
  favourites: number;
  isAdult: boolean;
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
}

export interface MediaTag {
  id: number;
  name: string;
  description: string;
  category: string;
  rank: number;
  isGeneralSpoiler: boolean;
  isMediaSpoiler: boolean;
}

export interface FuzzyDate {
  year?: number;
  month?: number;
  day?: number;
}

export enum MediaFormat {
  TV = 'TV',
  TV_SHORT = 'TV_SHORT',
  MOVIE = 'MOVIE',
  SPECIAL = 'SPECIAL',
  OVA = 'OVA',
  ONA = 'ONA',
  MUSIC = 'MUSIC',
  MANGA = 'MANGA',
  NOVEL = 'NOVEL',
  ONE_SHOT = 'ONE_SHOT'
}

export enum MediaStatus {
  FINISHED = 'FINISHED',
  RELEASING = 'RELEASING',
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  CANCELLED = 'CANCELLED',
  HIATUS = 'HIATUS'
}

export enum Season {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL'
}

export interface AnimeSearchParams {
  search?: string;
  type?: 'ANIME' | 'MANGA';
  genre?: string[];
  tag?: string[];
  season?: Season;
  seasonYear?: number;
  format?: MediaFormat[];
  status?: MediaStatus[];
  isAdult?: boolean;
  sort?: MediaSort[];
  page?: number;
  perPage?: number;
}

export enum MediaSort {
  POPULARITY_DESC = 'POPULARITY_DESC',
  POPULARITY = 'POPULARITY',
  TRENDING_DESC = 'TRENDING_DESC',
  TRENDING = 'TRENDING',
  UPDATED_AT_DESC = 'UPDATED_AT_DESC',
  UPDATED_AT = 'UPDATED_AT',
  START_DATE_DESC = 'START_DATE_DESC',
  START_DATE = 'START_DATE',
  END_DATE_DESC = 'END_DATE_DESC',
  END_DATE = 'END_DATE',
  FAVOURITES_DESC = 'FAVOURITES_DESC',
  FAVOURITES = 'FAVOURITES',
  SCORE_DESC = 'SCORE_DESC',
  SCORE = 'SCORE'
}
