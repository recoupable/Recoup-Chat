import { z } from "zod";
import { tool } from "ai";
import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";
import { YouTubeChannelInfoResult } from "@/types/youtube";
import { createYouTubeAPIClient } from "@/lib/youtube/oauth-client";

// Zod schema for parameter validation
const schema = z.object({
  account_id: z.string().describe("Account ID to get YouTube channel information for. This is required as tokens are stored per account.")
});

const getYouTubeChannelInfoTool = tool({
  description:
    "Get detailed YouTube channel information for a specific account including subscribers, views, videos count, and other channel statistics. " +
    "This tool requires the account to be authenticated with YouTube first. " +
    "Use the check_youtube_access tool first to ensure the account is authenticated. " +
    "Returns comprehensive channel data including basic info, statistics, thumbnails, and branding settings. " +
    "Requires account_id parameter as each account has their own YouTube channel and tokens.",
  parameters: schema,
  execute: async ({ account_id }): Promise<YouTubeChannelInfoResult> => {
    try {
      // Get tokens from database using account_id
      const storedTokens = await getYouTubeTokens(account_id);
      
      if (!storedTokens) {
        return {
          success: false,
          status: "error",
          message: "No YouTube tokens found for this account. Please authenticate with YouTube first by using the check_youtube_access tool and following the authentication instructions."
        };
      }

      // Check if token has expired (with 1-minute safety buffer)
      const now = Date.now();
      const expiresAt = new Date(storedTokens.expires_at).getTime();
      if (now > (expiresAt - 60000)) {
        return {
          success: false,
          status: "error",
          message: "YouTube access token has expired for this account. Please re-authenticate by using the check_youtube_access tool and following the authentication instructions."
        };
      }

      // Create YouTube API client with stored tokens
      const youtube = createYouTubeAPIClient(
        storedTokens.access_token,
        storedTokens.refresh_token ?? undefined
      );

      // Fetch comprehensive channel information
      const response = await youtube.channels.list({
        part: ["snippet", "statistics", "brandingSettings", "status"],
        mine: true,
      });

      if (!response.data.items || response.data.items.length === 0) {
        return {
          success: false,
          status: "error",
          message: "No YouTube channels found for this authenticated account"
        };
      }

      const channelData = response.data.items[0];
      
      return {
        success: true,
        status: "success",
        message: "YouTube channel information retrieved successfully for account",
        channelInfo: {
          // Basic channel information
          id: channelData.id || "",
          title: channelData.snippet?.title || "",
          description: channelData.snippet?.description || "",
          customUrl: channelData.snippet?.customUrl || null,
          country: channelData.snippet?.country || null,
          publishedAt: channelData.snippet?.publishedAt || "",
          
          // Channel thumbnails
          thumbnails: {
            default: {
              url: channelData.snippet?.thumbnails?.default?.url || null,
            },
            medium: {
              url: channelData.snippet?.thumbnails?.medium?.url || null,
            },
            high: {
              url: channelData.snippet?.thumbnails?.high?.url || null,
            },
          },
          
          // Channel statistics
          statistics: {
            subscriberCount: channelData.statistics?.subscriberCount || "0",
            videoCount: channelData.statistics?.videoCount || "0",
            viewCount: channelData.statistics?.viewCount || "0",
            hiddenSubscriberCount: channelData.statistics?.hiddenSubscriberCount === true,
          },
          
          // Channel branding
          branding: {
            keywords: channelData.brandingSettings?.channel?.keywords || null,
            defaultLanguage: channelData.brandingSettings?.channel?.defaultLanguage || null,
          },
          
          // Authentication metadata
          authentication: {
            tokenCreatedAt: storedTokens.created_at,
            tokenExpiresAt: storedTokens.expires_at,
          },
        }
      };
    } catch (error: unknown) {
      console.error("Error getting YouTube channel info:", error);
      
      // If token is invalid/expired, return appropriate error
      if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
        return {
          success: false,
          status: "error",
          message: "YouTube authentication is invalid or has expired for this account. Please re-authenticate by using the check_youtube_access tool and following the authentication instructions."
        };
      }
      
      return {
        success: false,
        status: "error",
        message: error instanceof Error ? error.message : "Failed to get YouTube channel information for this account. Please ensure the account is authenticated with YouTube."
      };
    }
  },
});

export default getYouTubeChannelInfoTool; 