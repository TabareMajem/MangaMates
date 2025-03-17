import type { CharacterResult, MangaResult, SearchCriteria } from '@/types/anime';

export class AniListClient {
  private readonly endpoint = 'https://graphql.anilist.co';

  async searchManga(criteria: SearchCriteria): Promise<MangaResult[]> {
    const query = `
      query ($search: String, $genres: [String], $tags: [String]) {
        Page {
          media(search: $search, type: MANGA, genres: $genres, tags: $tags) {
            id
            title { romaji english native }
            description
            genres
            tags { name rank }
            averageScore
            popularity
            coverImage { large }
          }
        }
      }
    `;

    const response = await this.request(query, criteria);
    return response.data.Page.media;
  }

  async getCharacter(id: string): Promise<CharacterResult> {
    const query = `
      query ($id: Int) {
        Character(id: $id) {
          id
          name { full native }
          description
          image { large }
          media { nodes { title { romaji } } }
          favourites
        }
      }
    `;

    const response = await this.request(query, { id: parseInt(id) });
    return response.data.Character;
  }

  private async request(query: string, variables: any) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.statusText}`);
    }

    return response.json();
  }
}
