import { LiffService } from '@/lib/line/liff-config';
import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function LineAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const liffService = useMemo(() => new LiffService(), []);

  const handleLogin = useCallback(async () => {
    try {
      await liffService.login();
      const profile = await liffService.getProfile();
      
      // Store LINE user data
      const { error } = await supabase
        .from('line_users')
        .upsert({
          line_user_id: profile.userId,
          display_name: profile.displayName,
          picture_url: profile.pictureUrl,
          status_message: profile.statusMessage,
          last_interaction: new Date().toISOString()
        });

      if (error) throw error;

      // Close LIFF window or redirect
      if (liffService.isInClient()) {
        liffService.closeWindow();
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setError('Login failed');
      console.error(error);
    }
  }, [liffService]);

  const initializeLiff = useCallback(async () => {
    try {
      await liffService.initialize();
      await handleLogin();
    } catch (error) {
      setError('Failed to initialize LIFF');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [liffService, handleLogin]);

  useEffect(() => {
    initializeLiff();
  }, [initializeLiff]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">LINE Login</h1>
        <button
          onClick={handleLogin}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Login with LINE
        </button>
      </div>
    </div>
  );
}
