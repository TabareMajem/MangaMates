import type { UserSettings } from '@/lib/types/journal';

const DEFAULT_SETTINGS: UserSettings = {
  id: 'default',
  userId: 'mock-user-1',
  theme: 'system',
  notifications: false,
  privacyMode: true
};

export async function getUserSettings(userId: string): Promise<UserSettings> {
  return DEFAULT_SETTINGS;
}

export async function updateUserSettings(
  userId: string, 
  settings: Partial<UserSettings>
): Promise<UserSettings> {
  return { ...DEFAULT_SETTINGS, ...settings };
}
