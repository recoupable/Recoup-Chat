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

// Zod schema for parameter validation
const schema = z.object({
  access_token: z
    .string()
    .describe(
      "OAuth access token for YouTube API. Must be obtained via prior authentication using the youtube_login tool."
    ),
  refresh_token: z
    .string()
    .optional()
    .describe(
      "OAuth refresh token for YouTube API. Optional, but recommended for token refresh. Must be obtained via prior authentication using the youtube_login tool."
    ),
});

const getYouTubeChannels = tool({
  description: `Get YouTube channel information for a specific account.
This tool requires a valid access_token (and optionally a refresh_token) obtained from a prior authentication step (e.g., youtube_login).
Returns an array of comprehensive channel data including statistics, thumbnails, and branding if the tokens are valid.
IMPORTANT: Always call the youtube_login tool first to obtain the required tokens before calling this tool.`,
  parameters: schema,
  execute: async ({
    access_token,
    refresh_token,
  }): Promise<YouTubeChannelInfoResult> => {
    if (!access_token || access_token.trim() === "") {
      return YouTubeErrorBuilder.createToolError(
        "No access_token provided to YouTube channel info tool. Please ensure you pass a valid access_token from the authentication step."
      );
    }
    try {
      const channelResult = await fetchYouTubeChannelInfo({
        accessToken: access_token,
        refreshToken: refresh_token ?? undefined,
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
          channelInfo: { channels },
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
