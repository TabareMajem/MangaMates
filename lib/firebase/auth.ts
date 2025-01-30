import { getAuth, signInAnonymously } from 'firebase/auth';
import { app } from './init';

export const auth = getAuth(app);

// Enable anonymous auth by default for demo
export const signInAnonymousUser = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error('Anonymous auth error:', error);
  }
};
