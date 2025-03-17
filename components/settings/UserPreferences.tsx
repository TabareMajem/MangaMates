import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface UserPreferences {
  aiPersonality: string;
  language: string;
  notificationEnabled: boolean;
  dailyMessageLimit: number;
  contextWindowSize: number;
}

export function UserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    aiPersonality: '',
    language: 'en',
    notificationEnabled: true,
    dailyMessageLimit: 100,
    contextWindowSize: 10
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load preferences',
        type: 'error'
      });
      return;
    }

    if (data) {
      setPreferences({
        aiPersonality: data.ai_personality,
        language: data.language,
        notificationEnabled: data.notification_enabled,
        dailyMessageLimit: data.daily_message_limit,
        contextWindowSize: data.context_window_size
      });
    }

    setIsLoading(false);
  }

  async function savePreferences() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        ai_personality: preferences.aiPersonality,
        language: preferences.language,
        notification_enabled: preferences.notificationEnabled,
        daily_message_limit: preferences.dailyMessageLimit,
        context_window_size: preferences.contextWindowSize
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save preferences',
        type: 'error'
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Preferences saved successfully',
      type: 'success'
    });
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">User Preferences</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            AI Personality
          </label>
          <textarea
            value={preferences.aiPersonality}
            onChange={(e) => setPreferences({
              ...preferences,
              aiPersonality: e.target.value
            })}
            className="w-full h-32 p-2 border rounded"
            placeholder="Describe how you want the AI to behave..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({
              ...preferences,
              language: e.target.value
            })}
            className="w-full p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <Switch
              checked={preferences.notificationEnabled}
              onCheckedChange={(checked) => setPreferences({
                ...preferences,
                notificationEnabled: checked
              })}
            />
            <span>Enable Notifications</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Daily Message Limit: {preferences.dailyMessageLimit}
          </label>
          <Slider
            value={preferences.dailyMessageLimit}
            onChange={(value) => setPreferences({
              ...preferences,
              dailyMessageLimit: value
            })}
            min={10}
            max={500}
            step={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Context Window Size: {preferences.contextWindowSize}
          </label>
          <Slider
            value={preferences.contextWindowSize}
            onChange={(value) => setPreferences({
              ...preferences,
              contextWindowSize: value
            })}
            min={5}
            max={20}
            step={1}
          />
        </div>

        <Button
          onClick={savePreferences}
          className="w-full"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
