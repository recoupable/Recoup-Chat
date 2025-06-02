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
  artist_id: z.string().describe("Artist ID to get YouTube channel information for. This tool handles authentication checking internally.")
});

const getYouTubeChannelInfoTool = tool({
  description:
    "Get YouTube channel information for a specific account. " +
    "This tool automatically checks authentication status and either returns channel data or authentication instructions. " +
    "No need to check authentication separately - this tool handles everything internally. " +
    "Returns comprehensive channel data including statistics, thumbnails, and branding if authenticated, " +
    "or clear authentication instructions if tokens are missing/expired. " +
    "IMPORTANT: This tool requires the artist_id parameter. If you don't know the artist_id, ask the user or use the current artist's artist_id.",
  parameters: schema,
  execute: async ({ artist_id }): Promise<YouTubeChannelInfoResult> => {
    // Early validation of artist_id
    if (!artist_id || artist_id.trim() === '') {
      const missingParamError = YouTubeErrorBuilder.createToolError(
        "No artist_id provided to YouTube tool. The LLM must pass the artist_id parameter. Please ensure you're passing the current artist's artist_id."
      );
      return missingParamError;
    }
    
    try {
      // Validate YouTube tokens (internal authentication check)
      const tokenValidation = await validateYouTubeTokens(artist_id);
      
      if (!tokenValidation.success) {
        // Return authentication error with clear instructions
        const authError = YouTubeErrorBuilder.createToolError(
          `YouTube authentication required for this account. ${tokenValidation.error!.message} Please authenticate by connecting your YouTube account.`
        );
        return authError;
      }

      // Fetch comprehensive channel information with branding
      const channelResult = await fetchYouTubeChannelInfo(tokenValidation.tokens!, true);
      
      if (!channelResult.success) {
        const fetchError = YouTubeErrorBuilder.createToolError(channelResult.error!.message);
        return fetchError;
      }

      const channel = channelResult.channelData!;
      
      const returnResult = YouTubeErrorBuilder.createToolSuccess("YouTube channel information retrieved successfully", {
        channelInfo: {
          ...channel,
          statistics: {
            ...channel.statistics,
            hiddenSubscriberCount: channel.statistics.hiddenSubscriberCount || false,
          },
          authentication: {
            tokenCreatedAt: tokenValidation.tokens!.created_at,
            tokenExpiresAt: tokenValidation.tokens!.expires_at,
          },
          branding: channel.branding || { keywords: null, defaultLanguage: null },
        }
      });
      return returnResult;
    } catch (error: unknown) {
      console.error("YouTube tool unexpected error:", error);
      
      // If token is invalid/expired, return authentication instructions
      if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
        const authExpiredError = YouTubeErrorBuilder.createToolError(
          "YouTube authentication has expired for this account. Please re-authenticate by connecting your YouTube account to get channel information."
        );
        return authExpiredError;
      }
      
      const generalError = YouTubeErrorBuilder.createToolError(
        error instanceof Error ? error.message : "Failed to get YouTube channel information. Please ensure the account is authenticated with YouTube."
      );
      return generalError;
    }
  },
});

export default getYouTubeChannelInfoTool; 