import axios from 'axios';

// Instagram Graph API client
export const instagramClient = {
  // Get user profile
  async getUserProfile(accessToken: string) {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/me`,
        {
          params: {
            fields: 'id,username,account_type,media_count',
            access_token: accessToken || process.env.INSTAGRAM_ACCESS_TOKEN
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Instagram API error:', error);
      throw error;
    }
  },

  // Get user media
  async getUserMedia(accessToken: string, limit = 10) {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/me/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username',
            limit,
            access_token: accessToken || process.env.INSTAGRAM_ACCESS_TOKEN
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Instagram API error:', error);
      throw error;
    }
  }
}; 