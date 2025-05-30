import { z } from "zod";
import { tool } from "ai";
import { YouTubeAccessResult } from "@/types/youtube";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import { fetchYouTubeChannelInfo } from "@/lib/youtube/channel-fetcher";

// Zod schema for parameter validation
const schema = z.object({
  artist_ID: z.string().describe("Artist ID to check YouTube access for. This is required as tokens are stored per account.")
});

const checkYouTubeAccessTool = tool({
  description:
    "Check if YouTube access is available for a specific account and return basic channel information. " +
    "This tool verifies if valid YouTube OAuth tokens exist for the account and fetches channel data. " +
    "Returns channel name, picture, subscriber count, and other basic information if authenticated, " +
    "or an error message if authentication is required. " +
    "Requires account_id parameter as each account has their own YouTube tokens.",
  parameters: schema,
  execute: async ({ artist_ID }): Promise<YouTubeAccessResult> => {
    try {
      // Validate YouTube tokens
      const tokenValidation = await validateYouTubeTokens(artist_ID);
      if (!tokenValidation.success) {
        return {
          success: false,
          status: "error",
          message: tokenValidation.error!.message
        };
      }

      // Fetch channel information using utility
      const channelResult = await fetchYouTubeChannelInfo(tokenValidation.tokens!);
      if (!channelResult.success) {
        return {
          success: false,
          status: "error",
          message: channelResult.error!.message
        };
      }

      const channel = channelResult.channelData!;
      
      return {
        success: true,
        status: "success",
        message: "YouTube access verified successfully for account",
        channelInfo: {
          id: channel.id,
          name: channel.title,
          thumbnails: {
            default: channel.thumbnails.default?.url || null,
            medium: channel.thumbnails.medium?.url || null,
            high: channel.thumbnails.high?.url || null,
          },
          subscriberCount: channel.statistics.subscriberCount,
          videoCount: channel.statistics.videoCount,
          viewCount: channel.statistics.viewCount,
          customUrl: channel.customUrl,
          country: channel.country,
          publishedAt: channel.publishedAt,
        }
      };
    } catch (error: unknown) {
      console.error("Error checking YouTube access:", error);
      
      // If token is invalid/expired, return appropriate error
      if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
        return {
          success: false,
          status: "error",
          message: "YouTube authentication is invalid or has expired for this account. Please re-authenticate by visiting the OAuth authorization URL."
        };
      }
      
      return {
        success: false,
        status: "error",
        message: error instanceof Error ? error.message : "Failed to check YouTube access for this account. Please ensure the account is authenticated with YouTube."
      };
    }
  },
});

export default checkYouTubeAccessTool; 