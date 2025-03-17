import { supabase } from '@/lib/supabase';
import { lineClient } from '@/lib/messaging/line-client';
import { generateResponse } from '@/lib/ai/character-ai';
import { getCharacter } from '@/lib/services/character-service';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const scheduleService = {
  async createSchedule(userId: string, data: {
    characterId: string;
    name: string;
    description?: string;
    schedule: any;
  }) {
    const { data: schedule, error } = await supabase
      .from('character_schedules')
      .insert({
        user_id: userId,
        character_id: data.characterId,
        name: data.name,
        description: data.description || '',
        schedule: data.schedule,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return schedule;
  },
  
  async getUserSchedules(userId: string) {
    const { data, error } = await supabase
      .from('character_schedules')
      .select(`
        *,
        character_instances(
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  async getSchedule(scheduleId: string, userId: string) {
    const { data, error } = await supabase
      .from('character_schedules')
      .select(`
        *,
        character_instances(
          id,
          name
        )
      `)
      .eq('id', scheduleId)
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async updateSchedule(scheduleId: string, userId: string, updates: any) {
    const { data, error } = await supabase
      .from('character_schedules')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', scheduleId)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async deleteSchedule(scheduleId: string, userId: string) {
    const { error } = await supabase
      .from('character_schedules')
      .delete()
      .eq('id', scheduleId)
      .eq('user_id', userId);
      
    if (error) throw error;
    return true;
  },
  
  async scheduleMessage(scheduleId: string, data: {
    recipientId: string;
    content: string;
    scheduledFor: Date;
  }) {
    const { data: message, error } = await supabase
      .from('scheduled_messages')
      .insert({
        schedule_id: scheduleId,
        recipient_id: data.recipientId,
        content: data.content,
        status: 'pending',
        scheduled_for: data.scheduledFor.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return message;
  },
  
  async getScheduledMessages(scheduleId: string) {
    const { data, error } = await supabase
      .from('scheduled_messages')
      .select('*')
      .eq('schedule_id', scheduleId)
      .order('scheduled_for', { ascending: true });
      
    if (error) throw error;
    return data || [];
  }
};

export const scheduleService = new ScheduleService(); 