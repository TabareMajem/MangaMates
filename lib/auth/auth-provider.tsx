import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';

interface AuthState {
  user: User | null;
  loading: boolean;
  subscription: {
    tier: 'free' | 'premium' | 'enterprise';
    status: 'active' | 'trialing' | 'expired';
    expiresAt: Date | null;
  } | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    subscription: null
  });

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        updateUserState(session.user);
      }
      setState(s => ({ ...s, loading: false }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          updateUserState(session.user);
        } else {
          setState({ user: null, loading: false, subscription: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const updateUserState = async (user: User) => {
    // Fetch subscription status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    setState({
      user,
      loading: false,
      subscription: subscription ? {
        tier: subscription.tier,
        status: subscription.status,
        expiresAt: new Date(subscription.expires_at)
      } : null
    });
  };

  // Auth methods implementation...
  
  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
