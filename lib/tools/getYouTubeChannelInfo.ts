import { z } from "zod";
import { tool } from "ai";
import { YouTubeChannelInfoResult } from "@/types/youtube";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import { fetchYouTubeChannelInfo } from "@/lib/youtube/channel-fetcher";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";

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
      // Validate YouTube tokens
      const tokenValidation = await validateYouTubeTokens(account_id);
      if (!tokenValidation.success) {
        return YouTubeErrorBuilder.createToolError(tokenValidation.error!.message);
      }

      // Fetch comprehensive channel information with branding
      const channelResult = await fetchYouTubeChannelInfo(tokenValidation.tokens!, true);
      if (!channelResult.success) {
        return YouTubeErrorBuilder.createToolError(channelResult.error!.message);
      }

      const channel = channelResult.channelData!;
      
      return YouTubeErrorBuilder.createToolSuccess("YouTube channel information retrieved successfully for account", {
        channelInfo: {
          // Basic channel information
          id: channel.id,
          title: channel.title,
          description: channel.description,
          customUrl: channel.customUrl,
          country: channel.country,
          publishedAt: channel.publishedAt,
          
          // Channel thumbnails
          thumbnails: channel.thumbnails,
          
          // Channel statistics
          statistics: {
            subscriberCount: channel.statistics.subscriberCount,
            videoCount: channel.statistics.videoCount,
            viewCount: channel.statistics.viewCount,
            hiddenSubscriberCount: channel.statistics.hiddenSubscriberCount || false,
          },
          
          // Channel branding
          branding: {
            keywords: channel.branding?.keywords || null,
            defaultLanguage: channel.branding?.defaultLanguage || null,
          },
          
          // Authentication metadata
          authentication: {
            tokenCreatedAt: tokenValidation.tokens!.created_at,
            tokenExpiresAt: tokenValidation.tokens!.expires_at,
          },
        }
      });
    } catch (error: unknown) {
      console.error("Error getting YouTube channel info:", error);
      
      // If token is invalid/expired, return appropriate error
      if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
        return YouTubeErrorBuilder.createToolError(
          "YouTube authentication is invalid or has expired for this account. Please re-authenticate by using the check_youtube_access tool and following the authentication instructions."
        );
      }
      
      return YouTubeErrorBuilder.createToolError(
        error instanceof Error ? error.message : "Failed to get YouTube channel information for this account. Please ensure the account is authenticated with YouTube."
      );
    }
  },
});

export default getYouTubeChannelInfoTool; 