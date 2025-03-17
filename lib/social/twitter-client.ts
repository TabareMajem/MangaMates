// Twitter API v2 client
export const twitterClient = {
  // Get user profile by username
  async getUserByUsername(username: string) {
    try {
      const response = await axios.get(
        `https://api.twitter.com/2/users/by/username/${username}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Twitter API error:', error);
      throw error;
    }
  },

  // Get user tweets
  async getUserTweets(userId: string, maxResults = 10) {
    try {
      const response = await axios.get(
        `https://api.twitter.com/2/users/${userId}/tweets`,
        {
          params: {
            max_results: maxResults,
            tweet.fields: 'created_at,public_metrics,text'
          },
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Twitter API error:', error);
      throw error;
    }
  }
}; 