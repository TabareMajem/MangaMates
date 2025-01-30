// Platform-agnostic types
export interface SocialProfile {
  id: string;
  platform: 'twitter' | 'instagram';
  username: string;
  name?: string;
  description?: string;
  accountType?: string;
  metrics?: ProfileMetrics;
  updatedAt: string;
}

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram';
  content?: string;
  type?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  permalink?: string;
  createdAt: string;
  metrics: PostMetrics;
}

// Platform-specific types
export interface TwitterProfile extends SocialProfile {
  platform: 'twitter';
  name: string;
  description: string;
}

export interface InstagramProfile extends SocialProfile {
  platform: 'instagram';
  accountType: string;
}

export interface TwitterPost extends SocialPost {
  platform: 'twitter';
  content: string;
  metrics: TwitterMetrics;
}

export interface InstagramPost extends SocialPost {
  platform: 'instagram';
  type: string;
  caption: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  metrics: InstagramMetrics;
}

// Metrics types
interface ProfileMetrics {
  followers: number;
  following: number;
  posts: number;
}

interface PostMetrics {
  likes: number;
  comments?: number;
  shares?: number;
}

interface TwitterMetrics extends PostMetrics {
  retweets: number;
  replies: number;
  quotes: number;
}

interface InstagramMetrics extends PostMetrics {
  comments: number;
  shares: number;
}

// Analysis types
export interface SocialAnalysis {
  engagementRate: number;
  topPlatforms: Record<string, number>;
  contentTypes: Record<string, number>;
  peakTimes: string[];
  sentiment: Record<string, number>;
}

export interface AnalysisResult {
  profile: SocialProfile;
  posts: SocialPost[];
  analysis: SocialAnalysis;
  timestamp: string;
}

export interface Tweet {
  id: string;
  text: string;
  mediaUrls: string[];
  permalink: string;
  createdAt: string;
  likeCount: number;
  retweetCount: number;
  replyCount: number;
  quoteCount: number;
}
