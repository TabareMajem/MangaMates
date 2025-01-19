import { supabase } from '@/lib/supabase/client';

class TwitterService {
  private readonly TWITTER_CONFIG = {
    clientId: process.env.VITE_TWITTER_CLIENT_ID,
    clientSecret: process.env.VITE_TWITTER_CLIENT_SECRET,
    redirectUri: `${window.location.origin}/auth/twitter/callback`,
    scope: 'tweet.read users.read'
  };

  async authorize() {
    const state = crypto.randomUUID();
    
    // Store state for verification
    await supabase.from('auth_states').insert({
      state,
      provider: 'twitter',
      expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Generate Twitter authorization URL
    const params = new URLSearchParams({
      client_id: this.TWITTER_CONFIG.clientId!,
      redirect_uri: this.TWITTER_CONFIG.redirectUri,
      scope: this.TWITTER_CONFIG.scope,
      response_type: 'code',
      state,
      code_challenge_method: 'S256',
      code_challenge: await this.generateCodeChallenge()
    });

    return {
      authUrl: `https://twitter.com/i/oauth2/authorize?${params.toString()}`
    };
  }

  async analyzeProfile(accessToken: string) {
    // Fetch user data and tweets
    const [profile, tweets] = await Promise.all([
      this.fetchProfile(accessToken),
      this.fetchTweets(accessToken)
    ]);

    // Analyze with AI
    const analysis = await this.analyzeContent(profile, tweets);

    return analysis;
  }

  private async generateCodeChallenge() {
    const verifier = crypto.randomUUID();
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private async fetchProfile(accessToken: string) {
    const response = await fetch('https://api.twitter.com/2/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.json();
  }

  private async fetchTweets(accessToken: string) {
    const response = await fetch('https://api.twitter.com/2/tweets/search/recent', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.json();
  }

  private async analyzeContent(profile: any, tweets: any) {
    // TODO: Implement AI analysis
    return {
      personality: {
        extraversion: 0.6,
        openness: 0.7,
        conscientiousness: 0.8
      },
      interests: ['technology', 'politics', 'entertainment'],
      communicationStyle: {
        tone: 'informative',
        engagement: 'high',
        topicFocus: 'diverse'
      }
    };
  }
}

export const twitterService = new TwitterService();