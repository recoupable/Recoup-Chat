import { z } from "zod";
import { tool } from "ai";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";
import { getYoutubePlaylistVideos } from "@/lib/youtube/getYoutubePlaylistVideos";
import { validateYouTubeTokens } from "../youtube/token-validator";

const schema = z.object({
  artist_account_id: z
  .string()
  .describe(
    "artist_account_id from the system prompt of the active artist."
  ),
  uploads_playlist_id: z
    .string()
    .describe(
      "The YouTube channel uploads playlist ID to fetch videos for. Must be obtained via prior call to get_youtube_channels tool."
    ),
  max_results: z
    .number()
    .min(1)
    .max(50)
    .default(25)
    .optional()
    .describe(
      "Maximum number of videos to return per page (1-50, default 25)."
    ),
});

const getYouTubeChannelVideoList = tool({
  description: `Get a list of videos for a specific YouTube channel. 
This tool requires the artist_account_id parameter from the system prompt of the active artist.
Returns an array of video metadata including id, title, publishedAt, thumbnails, likes, views, and more.
This tool follows YouTube API best practices by retrieving videos from the channel's uploads playlist.
IMPORTANT: Always call the youtube_login tool first to obtain the required authentication before calling this tool.`,
  parameters: schema,
  // @ts-ignore
  execute: async ({
    artist_account_id,
    uploads_playlist_id,
    max_results = 25,
  }: { artist_account_id: string, uploads_playlist_id: string, max_results: number }) => {
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
      const playlistItems = await getYoutubePlaylistVideos({
        access_token,
        refresh_token: refresh_token || undefined,
        playlist_id: uploads_playlist_id,
        max_results,
      });

      return {
        success: true,
        status: "success",
        message: `Fetched ${playlistItems.videos.length} videos for channel playlist ${uploads_playlist_id}`,
        ...playlistItems,
      };
    } catch (error) {
      return YouTubeErrorBuilder.createToolError(
        error instanceof Error
          ? error.message
          : "Failed to fetch channel videos."
      );
    }
  },
});

export default getYouTubeChannelVideoList;
