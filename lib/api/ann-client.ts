import type { MangaResult, SearchCriteria } from '@/types/anime';

export class ANNClient {
  private readonly baseUrl = 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml';

  async searchManga(criteria: SearchCriteria): Promise<MangaResult[]> {
    const params = new URLSearchParams({
      title: criteria.search || '',
      type: 'manga',
      ...this.buildSearchParams(criteria)
    });

    const response = await fetch(`${this.baseUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`ANN API error: ${response.statusText}`);
    }

    const xml = await response.text();
    return this.parseXMLResponse(xml);
  }

  private parseXMLResponse(xml: string): MangaResult[] {
    // Implementation of XML parsing
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    return Array.from(doc.querySelectorAll('manga')).map(manga => ({
      id: manga.getAttribute('id') || '',
      title: {
        romaji: manga.querySelector('title')?.textContent || '',
        english: manga.querySelector('title[lang="EN"]')?.textContent || '',
        native: manga.querySelector('title[lang="JA"]')?.textContent || ''
      },
      description: manga.querySelector('info[type="Plot Summary"]')?.textContent || '',
      genres: Array.from(manga.querySelectorAll('info[type="Genres"] value')).map(g => g.textContent || ''),
      averageScore: parseFloat(manga.querySelector('ratings average')?.textContent || '0'),
      popularity: parseInt(manga.querySelector('ratings num')?.textContent || '0'),
      coverImage: {
        large: manga.querySelector('info[type="Picture"] img')?.getAttribute('src') || ''
      }
    }));
  }

  private buildSearchParams(criteria: SearchCriteria): Record<string, string> {
    const params: Record<string, string> = {};
    
    if (criteria.genres?.length) {
      params.genre = criteria.genres.join(',');
    }
    
    if (criteria.year) {
      params.vintage = criteria.year.toString();
    }
    
    return params;
  }
}
