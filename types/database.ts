import type { Character } from './agent';

export interface Database {
  public: {
    Tables: {
      characters: {
        Row: Character;
        Insert: Omit<Character, 'id'>;
        Update: Partial<Character>;
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          mood?: string;
          tags?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<JournalEntry>;
      };
      error_logs: {
        Row: {
          id: string;
          error_message: string;
          error_stack?: string;
          context: Record<string, any>;
          created_at: string;
        };
      };
      social_activities: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          type: 'post' | 'comment' | 'like' | 'share';
          content?: string;
          metrics: Record<string, number>;
          created_at: string;
        };
      };
      promotion_codes: {
        Row: {
          id: string;
          code: string;
          type: 'referral' | 'campaign';
          status: 'active' | 'inactive';
          metadata: {
            referrerId?: string;
            campaignId?: string;
          };
          created_at: string;
          expires_at?: string;
        };
      };
    };
    Views: {
      user_stats: {
        Row: {
          user_id: string;
          total_entries: number;
          total_characters: number;
          last_active: string;
        };
      };
    };
    Functions: {
      calculate_user_stats: {
        Args: { user_id: string };
        Returns: { total_entries: number; total_characters: number };
      };
    };
  };
}

export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;
