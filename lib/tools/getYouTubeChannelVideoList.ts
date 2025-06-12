import { z } from "zod";
import { tool } from "ai";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";
import { getYoutubePlaylistVideos } from "@/lib/youtube/getYoutubePlaylistVideos";

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
Requires a valid access_token and uploads_playlist_id. 
Returns an array of video metadata including id, title, publishedAt, thumbnails, likes, views, and more.
This tool follows YouTube API best practices by retrieving videos from the channel's uploads playlist.`,
  parameters: schema,
  execute: async ({
    access_token,
    refresh_token,
    uploads_playlist_id,
    max_results = 25,
  }) => {
    if (!access_token || !uploads_playlist_id) {
      return YouTubeErrorBuilder.createToolError(
        "Missing access_token or uploadsPlaylistId."
      );
    }

    try {
      const playlistItems = await getYoutubePlaylistVideos({
        access_token,
        refresh_token,
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
