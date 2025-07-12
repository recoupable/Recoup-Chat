import { type SocialFanWithDetails } from "@/lib/supabase/social_fans/selectSocialFans";

export const getAnalysisPrompt = (fanData: SocialFanWithDetails[]) => {
  const mappedFanData = fanData.map((fan) => ({
    socials: {
      username: fan.fan_social.username,
      bio: fan.fan_social.bio,
      followerCount: fan.fan_social.followerCount,
      followingCount: fan.fan_social.followingCount,
    },
    comments: {
      comment: fan.latest_engagement_comment?.comment || null,
    },
  }));

  return {
    fans: mappedFanData,
  };
};

export default getAnalysisPrompt;