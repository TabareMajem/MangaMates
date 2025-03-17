import { QueryBuilder } from '@/lib/db/query-builder';
import { sendEmail } from '@/lib/email/mailer';
import { AppError, ErrorCode } from '@/lib/error/error-handler';
import { supabase } from '@/lib/supabase';

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

export interface SharedJournal {
  id: string;
  userId: string;
  entryId: string;
  sharedWithId: string;
  permissions: 'read' | 'comment';
  createdAt: Date;
}

export class SocialService {
  async sendConnectionRequest(userId: string, targetUserId: string) {
    // Check if connection already exists
    const existing = await new QueryBuilder<Connection>('connections')
      .where('user_id', '=', userId)
      .where('connected_user_id', '=', targetUserId)
      .execute();

    if (existing.length > 0) {
      throw new AppError(
        'Connection already exists',
        ErrorCode.DATABASE_ERROR,
        400
      );
    }

    // Create connection request
    const { data: connection, error } = await supabase
      .from('connections')
      .insert({
        user_id: userId,
        connected_user_id: targetUserId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Notify target user
    const { data: targetUser } = await supabase
      .from('users')
      .select('email')
      .eq('id', targetUserId)
      .single();

    if (targetUser?.email) {
      await sendEmail({
        to: targetUser.email,
        template: 'connection-request',
        data: {
          requesterId: userId,
          connectionId: connection.id
        }
      });
    }

    return connection;
  }

  async shareJournalEntry(userId: string, entryId: string, targetUserId: string, permissions: 'read' | 'comment' = 'read') {
    // Verify connection exists and is accepted
    const connection = await this.verifyConnection(userId, targetUserId);
    if (!connection || connection.status !== 'accepted') {
      throw new AppError(
        'No active connection with user',
        ErrorCode.AUTH_FAILED,
        403
      );
    }

    // Create share record
    const { data: share, error } = await supabase
      .from('shared_journals')
      .insert({
        user_id: userId,
        entry_id: entryId,
        shared_with_id: targetUserId,
        permissions
      })
      .select()
      .single();

    if (error) throw error;

    // Notify target user
    const { data: targetUser } = await supabase
      .from('users')
      .select('email')
      .eq('id', targetUserId)
      .single();

    if (targetUser?.email) {
      await sendEmail({
        to: targetUser.email,
        template: 'journal-shared',
        data: {
          sharerId: userId,
          entryId
        }
      });
    }

    return share;
  }

  private async verifyConnection(userId: string, targetUserId: string): Promise<Connection | null> {
    const { data } = await supabase
      .from('connections')
      .select('*')
      .or(`user_id.eq.${userId},connected_user_id.eq.${userId}`)
      .or(`user_id.eq.${targetUserId},connected_user_id.eq.${targetUserId}`)
      .single();

    return data;
  }
}
