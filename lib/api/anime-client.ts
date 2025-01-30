import type { Media, MediaSearchParams, MediaType } from '@/types/media';
import { ResponseCache } from '../cache/response-cache';
import { ErrorHandler } from '../error/error-handler';
import { RateLimiter } from '../middleware/rate-limiter';

export class AnimeClient {
  private readonly apiUrl = 'https://graphql.anilist.co';
  
  constructor(
    private rateLimiter = new RateLimiter(),
    private cache = new ResponseCache(),
    private errorHandler = new ErrorHandler()
  ) {}

  async searchMedia(params: MediaSearchParams): Promise<Media[]> {
    try {
      const cacheKey = `anime:search:${JSON.stringify(params)}`;
      const cached = await this.cache.get<Media[]>(cacheKey);
      if (cached) return cached;

      await this.rateLimiter.checkLimit('anime:search', 30, 60);

      const query = `
        query ($search: String, $type: MediaType, $perPage: Int, $genre: [String], $season: MediaSeason, $format: MediaFormat, $status: MediaStatus) {
          Page(perPage: $perPage) {
            media(
              search: $search, 
              type: $type, 
              genre_in: $genre, 
              season: $season,
              format: $format,
              status: $status
            ) {
              id
              title {
                romaji
                english
                native
              }
              type
              format
              status
              description
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              season
              episodes
              duration
              source
              genres
              averageScore
              popularity
              coverImage {
                large
                medium
              }
            }
          }
        }
      `;

      const variables = {
        search: params.search,
        type: params.type.toUpperCase() as MediaType,
        perPage: params.perPage || 20,
        genre: params.genres,
        season: params.season,
        format: params.format,
        status: params.status
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      const results = this.transformMediaResponse(data);
      
      await this.cache.set(cacheKey, results, 300); // Cache for 5 minutes
      return results;

    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'anime.search',
        params
      });
      throw error;
    }
  }

  async getMediaById(id: number): Promise<Media> {
    try {
      const cacheKey = `anime:id:${id}`;
      const cached = await this.cache.get<Media>(cacheKey);
      if (cached) return cached;

      await this.rateLimiter.checkLimit('anime:get', 30, 60);

      const query = `
        query ($id: Int!) {
          Media(id: $id) {
            id
            title {
              romaji
              english
              native
            }
            type
            format
            status
            description
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            season
            episodes
            duration
            source
            genres
            averageScore
            popularity
            coverImage {
              large
              medium
            }
          }
        }
      `;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { id }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      const result = this.transformMediaResponse(data)[0];
      
      await this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'anime.getById',
        id
      });
      throw error;
    }
  }

  private transformMediaResponse(data: any): Media[] {
    const mediaList = data.data.Page ? data.data.Page.media : [data.data.Media];
    
    return mediaList.map((item: any) => ({
      id: item.id,
      title: {
        romaji: item.title.romaji,
        english: item.title.english,
        native: item.title.native
      },
      type: item.type.toLowerCase(),
      format: item.format,
      status: item.status.toLowerCase(),
      description: item.description,
      startDate: this.formatDate(item.startDate),
      endDate: this.formatDate(item.endDate),
      season: item.season,
      episodes: item.episodes,
      duration: item.duration,
      source: item.source,
      genres: item.genres,
      averageScore: item.averageScore,
      popularity: item.popularity,
      coverImage: item.coverImage
    }));
  }

  private formatDate(date: { year?: number; month?: number; day?: number }) {
    if (!date.year) return null;
    return new Date(
      date.year,
      (date.month || 1) - 1,
      date.day || 1
    ).toISOString();
  }
}
