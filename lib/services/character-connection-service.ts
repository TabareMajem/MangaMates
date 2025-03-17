import { supabase } from '@/lib/supabase';
import { lineClient } from '@/lib/messaging/line-client';

export const characterConnectionService = {
  // Connect a character to a LINE user
  async connectCharacter(userId: string, characterId: string, lineUserId: string) {
    try {
      // Check if the character belongs to the user
      const { data: character, error: characterError } = await supabase
        .from('character_instances')
        .select('id')
        .eq('id', characterId)
        .eq('user_id', userId)
        .single();
      
      if (characterError || !character) {
        throw new Error('Character not found or does not belong to user');
      }
      
      // Check if the LINE user exists, if not create it
      const { data: lineUser, error: lineUserError } = await supabase
        .from('line_users')
        .select('id')
        .eq('id', lineUserId)
        .single();
      
      if (lineUserError && lineUserError.code !== 'PGRST116') {
        // If error is not "not found", throw it
        throw lineUserError;
      }
      
      if (!lineUser) {
        // Get LINE user profile
        try {
          const profile = await lineClient.getProfile(lineUserId);
          
          // Create LINE user
          await supabase
            .from('line_users')
            .insert({
              id: lineUserId,
              display_name: profile.displayName,
              picture_url: profile.pictureUrl,
              status_message: profile.statusMessage,
              is_following: true,
              last_interaction: new Date().toISOString()
            });
        } catch (profileError) {
          console.error('Error getting LINE profile:', profileError);
          // Create a minimal LINE user record if profile fetch fails
          await supabase
            .from('line_users')
            .insert({
              id: lineUserId,
              is_following: true,
              last_interaction: new Date().toISOString()
            });
        }
      }
      
      // Create the connection
      const { data: connection, error: connectionError } = await supabase
        .from('character_connections')
        .insert({
          user_id: userId,
          character_id: characterId,
          line_user_id: lineUserId,
          is_active: true
        })
        .select()
        .single();
      
      if (connectionError) throw connectionError;
      
      return connection;
    } catch (error) {
      console.error('Error connecting character:', error);
      throw error;
    }
  },
  
  // Get all connections for a user
  async getUserConnections(userId: string) {
    try {
      const { data, error } = await supabase
        .from('character_connections')
        .select(`
          id,
          character_id,
          line_user_id,
          is_active,
          created_at,
          character_instances(
            id,
            name,
            appearance
          ),
          line_users(
            id,
            display_name,
            picture_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting user connections:', error);
      throw error;
    }
  },
  
  // Update a connection
  async updateConnection(userId: string, connectionId: string, updates: { is_active: boolean }) {
    try {
      const { data, error } = await supabase
        .from('character_connections')
        .update(updates)
        .eq('id', connectionId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating connection:', error);
      throw error;
    }
  },
  
  // Delete a connection
  async deleteConnection(userId: string, connectionId: string) {
    try {
      const { error } = await supabase
        .from('character_connections')
        .delete()
        .eq('id', connectionId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting connection:', error);
      throw error;
    }
  }
}; 