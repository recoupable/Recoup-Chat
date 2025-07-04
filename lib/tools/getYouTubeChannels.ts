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
import { fetchYouTubeChannelInfo } from "@/lib/youtube/channel-fetcher";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";
import { validateYouTubeTokens } from "../youtube/token-validator";

// Zod schema for parameter validation
const schema = z.object({
  artist_account_id: z
    .string()
    .describe(
      "artist_account_id from the system prompt of the active artist."
    ),
});

const getYouTubeChannels = tool({
  description: `Get YouTube channel information for a specific account.
This tool requires the artist_account_id parameter from the system prompt of the active artist.
Returns an array of comprehensive channel data including statistics, thumbnails, and branding if the artist has valid YouTube authentication.
IMPORTANT: Always call the youtube_login tool first to obtain the required authentication before calling this tool.`,
  parameters: schema,
  // @ts-ignore
  execute: async ({
    artist_account_id
  }: { artist_account_id: string }): Promise<YouTubeChannelInfoResult> => {
    if (!artist_account_id || artist_account_id.trim() === "") {
      return YouTubeErrorBuilder.createToolError(
        "No artist_account_id provided to YouTube login tool. The LLM must pass the artist_account_id parameter. Please ensure you're passing the current artist's artist_account_id."
      );
    }
    try {
      const tokenValidation = await validateYouTubeTokens(artist_account_id);
      if (!tokenValidation.success) {
        return YouTubeErrorBuilder.createToolError(
          `YouTube authentication required for this account. Please authenticate by connecting your YouTube account.`
        );
      }
      const access_token = tokenValidation.tokens!.access_token;
      const refresh_token = tokenValidation.tokens!.refresh_token;

      const channelResult = await fetchYouTubeChannelInfo({
        accessToken: access_token,
        refreshToken: refresh_token || "",
        includeBranding: true,
      });
      if (!channelResult.success) {
        const fetchError = YouTubeErrorBuilder.createToolError(
          channelResult.error!.message
        );
        return fetchError;
      }
      const channels = channelResult.channelData;
      const returnResult = YouTubeErrorBuilder.createToolSuccess(
        "YouTube channel information retrieved successfully",
        {
          channels,
        }
      );
      return returnResult;
    } catch (error: unknown) {
      console.error("YouTube tool unexpected error:", error);
      const generalError = YouTubeErrorBuilder.createToolError(
        error instanceof Error
          ? error.message
          : "Failed to get YouTube channel information. Please call youtube_login tool first."
      );
      return generalError;
    }
  },
});

export default getYouTubeChannels;
