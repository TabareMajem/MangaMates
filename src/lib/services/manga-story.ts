import { supabase } from '@/lib/supabase/client';
import type { MangaStory } from '@/types/manga';

class MangaStoryService {
  async generateStory(): Promise<MangaStory> {
    const mockStory: MangaStory = {
      id: crypto.randomUUID(),
      userId: 'mock-user',
      title: "Journey to Self-Discovery",
      prompt: "A story about personal growth and inner strength",
      panels: [
        {
          id: crypto.randomUUID(),
          imageUrl: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586",
          prompt: "A determined character facing a challenge",
          dialogue: "I won't give up!",
          position: 1,
          layout: 'full'
        }
      ],
      createdAt: new Date()
    };

    const { error } = await supabase
      .from('manga_stories')
      .insert(mockStory);

    if (error) throw error;
    return mockStory;
  }

  async getUserStories(): Promise<MangaStory[]> {
    const { data, error } = await supabase
      .from('manga_stories')
      .select()
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async shareStory(storyId: string): Promise<string> {
    const shareToken = crypto.randomUUID();
    
    const { error } = await supabase
      .from('manga_story_shares')
      .insert({
        story_id: storyId,
        share_token: shareToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

    if (error) throw error;
    return `${window.location.origin}/manga-story/${storyId}/share/${shareToken}`;
  }
}

export const mangaStoryService = new MangaStoryService();
