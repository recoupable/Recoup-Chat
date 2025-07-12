import { z } from "zod";
import { tool } from "ai";
import { selectSocialFans, type SocialFanWithDetails } from "@/lib/supabase/social_fans/selectSocialFans";

// Zod schema for parameter validation
const schema = z.object({
  social_ids: z.array(z.string().min(1, "Social ID is required")).min(1, "At least one social ID is required"),
});

const getSocialFans = tool({
  description:
    "Retrieve social fans data for given artist social IDs. This tool fetches fan engagement data from the social_fans table with expanded social details and comments for better segment name generation.",
  parameters: schema,
  execute: async ({ social_ids }) => {
    try {
      const socialFans = await selectSocialFans({ social_ids });

      // Transform the data to include the required fields for fanData mapping
      const transformedData = socialFans.map((fan) => ({
        ...fan,
        // Include social details for both artist and fan
        socials: {
          username: fan.fan_social.username,
          bio: fan.fan_social.bio,
          followerCount: fan.fan_social.followerCount,
          followingCount: fan.fan_social.followingCount,
          avatar: fan.fan_social.avatar,
          profile_url: fan.fan_social.profile_url,
          region: fan.fan_social.region,
          updated_at: fan.fan_social.updated_at,
        },
        // Include comment data
        comments: {
          comment: fan.latest_engagement_comment?.comment || null,
          commented_at: fan.latest_engagement_comment?.commented_at || null,
          post_id: fan.latest_engagement_comment?.post_id || null,
          social_id: fan.latest_engagement_comment?.social_id || null,
        },
      }));

      return {
        success: true,
        data: transformedData,
        count: socialFans.length,
      };
    } catch (error) {
      console.error("Error fetching social fans:", error);
      return {
        success: false,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch social fans",
        data: [],
        count: 0,
      };
    }
  },
});

export default getSocialFans;