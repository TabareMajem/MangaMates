import type { SocialAnalysis, SocialProfile } from '@/types/social';
import { SocialAnalysisService } from './social-analysis-service';

const analysisService = new SocialAnalysisService();

export async function analyzeSocialActivity(userId: string): Promise<SocialAnalysis> {
  return analysisService.analyzeSocialActivity(userId);
}

export async function getProfileAnalytics(profile: SocialProfile): Promise<SocialAnalysis> {
  return analysisService.getProfileAnalytics(profile);
}
