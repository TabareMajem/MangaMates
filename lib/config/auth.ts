export const getRedirectUri = (platform: 'line' | 'kakao') => {
  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev ? 'http://localhost:3000' : 'https://mangamates.com';
  
  return `${baseUrl}/api/auth/${platform}/callback`;
};
