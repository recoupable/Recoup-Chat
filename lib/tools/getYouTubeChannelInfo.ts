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
  account_id: z
    .string()
    .describe("artist_account_id from system prompt"),
});

const getYouTubeChannelInfoTool = tool({
  description:
    "Youtube: Get YouTube channel information for a specific account. " +
    "Before calling this tool, make sure to call the login_with_youtube tool to check if the account is authenticated. (IMPORTANT)" +
    "Return channel information like name, description, subscriber count, video count, view count, etc. " +
    "IMPORTANT: This tool requires the artist_account_id parameter. If you don't know the artist_account_id, ask the user or use the current artist's artist_account_id.",
  parameters: schema,
  execute: async ({ account_id }): Promise<YouTubeChannelInfoResult> => {
    try {
      // Validate YouTube tokens (internal authentication check)
      const tokenValidation = await validateYouTubeTokens(account_id);

      // Fetch comprehensive channel information with branding
      const channelResult = await fetchYouTubeChannelInfo(
        tokenValidation.tokens!,
        true
      );

      if (!channelResult.success) {
        const fetchError = YouTubeErrorBuilder.createToolError(
          channelResult.error!.message
        );
        return fetchError;
      }

      const channel = channelResult.channelData!;

      const returnResult = YouTubeErrorBuilder.createToolSuccess(
        "YouTube channel information retrieved successfully",
        {
          channelInfo: {
            ...channel,
            statistics: {
              ...channel.statistics,
              hiddenSubscriberCount:
                channel.statistics.hiddenSubscriberCount || false,
            },
            authentication: {
              tokenCreatedAt: tokenValidation.tokens!.created_at,
              tokenExpiresAt: tokenValidation.tokens!.expires_at,
            },
            branding: channel.branding || {
              keywords: null,
              defaultLanguage: null,
            },
          },
        }
      );
      return returnResult;
    } catch (error: unknown) {
      console.error("YouTube tool unexpected error:", error);

      // If token is invalid/expired, return authentication instructions
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 401
      ) {
        const authExpiredError = YouTubeErrorBuilder.createToolError(
          "YouTube authentication has expired for this account. Please re-authenticate by connecting your YouTube account to get channel information."
        );
        return authExpiredError;
      }

      const generalError = YouTubeErrorBuilder.createToolError(
        error instanceof Error
          ? error.message
          : "Failed to get YouTube channel information. Please ensure the account is authenticated with YouTube."
      );
      return generalError;
    }
  },
});

export default getYouTubeChannelInfoTool;
