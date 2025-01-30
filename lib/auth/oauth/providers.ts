interface OAuthProvider {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope: string[];
}

const providers: Record<string, OAuthProvider> = {
  line: {
    id: 'line',
    name: 'LINE',
    clientId: process.env.LINE_CLIENT_ID!,
    clientSecret: process.env.LINE_CLIENT_SECRET!,
    authorizationUrl: 'https://access.line.me/oauth2/v2.1/authorize',
    tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
    userInfoUrl: 'https://api.line.me/v2/profile',
    scope: ['profile', 'openid', 'email']
  },
  // Add other providers...
};
