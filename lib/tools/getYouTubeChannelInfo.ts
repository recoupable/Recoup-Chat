/**
 * YouTube Channel Information Tool
 * 
 * Single tool that handles both authentication checking and channel info fetching.
 * Internally validates YouTube tokens and returns either:
 * - Full channel information if authenticated
 * - Authentication error/instructions if not authenticated
 * 
 * This replaces the need for separate checkYouTubeAccess calls.
 */

import { z } from "zod";
import { tool } from "ai";
import { YouTubeChannelInfoResult } from "@/types/youtube";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import { fetchYouTubeChannelInfo } from "@/lib/youtube/channel-fetcher";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";

// Zod schema for parameter validation
const schema = z.object({
  account_id: z.string().describe("Account ID to get YouTube channel information for. This tool handles authentication checking internally.")
});

const getYouTubeChannelInfoTool = tool({
  description:
    "Get YouTube channel information for a specific account. " +
    "This tool automatically checks authentication status and either returns channel data or authentication instructions. " +
    "No need to check authentication separately - this tool handles everything internally. " +
    "Returns comprehensive channel data including statistics, thumbnails, and branding if authenticated, " +
    "or clear authentication instructions if tokens are missing/expired.",
  parameters: schema,
  execute: async ({ account_id }): Promise<YouTubeChannelInfoResult> => {
    try {
      // Validate YouTube tokens (internal authentication check)
      const tokenValidation = await validateYouTubeTokens(account_id);
      if (!tokenValidation.success) {
        // Return authentication error with clear instructions
        return YouTubeErrorBuilder.createToolError(
          `YouTube authentication required for this account. ${tokenValidation.error!.message} Please authenticate by connecting your YouTube account.`
        );
      }

      // Fetch comprehensive channel information with branding
      const channelResult = await fetchYouTubeChannelInfo(tokenValidation.tokens!, true);
      if (!channelResult.success) {
        return YouTubeErrorBuilder.createToolError(channelResult.error!.message);
      }

      const channel = channelResult.channelData!;
      
      return YouTubeErrorBuilder.createToolSuccess("YouTube channel information retrieved successfully", {
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
      
      // If token is invalid/expired, return authentication instructions
      if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
        return YouTubeErrorBuilder.createToolError(
          "YouTube authentication has expired for this account. Please re-authenticate by connecting your YouTube account to get channel information."
        );
      }
      
      return YouTubeErrorBuilder.createToolError(
        error instanceof Error ? error.message : "Failed to get YouTube channel information. Please ensure the account is authenticated with YouTube."
      );
    }
  },
});

export default getYouTubeChannelInfoTool; 