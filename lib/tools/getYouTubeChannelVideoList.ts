import { z } from "zod";
import { tool } from "ai";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";
import { createYouTubeAPIClient } from "@/lib/youtube/oauth-client";

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
  uploadsPlaylistId: z
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
Requires a valid access_token and channel_id. 
Returns an array of video metadata including id, title, publishedAt, thumbnails, and more.
This tool follows YouTube API best practices by retrieving videos from the channel's uploads playlist.`,
  parameters: schema,
  execute: async ({
    access_token,
    refresh_token,
    uploadsPlaylistId,
    max_results = 25,
  }) => {
    if (!access_token || !uploadsPlaylistId) {
      return YouTubeErrorBuilder.createToolError(
        "Missing access_token or uploadsPlaylistId."
      );
    }

    try {
      const youtube = createYouTubeAPIClient(access_token, refresh_token);

      // Step 1: Get videos from the uploads playlist
      const playlistResponse = await youtube.playlistItems.list({
        playlistId: uploadsPlaylistId,
        part: ["snippet", "contentDetails", "status"],
        maxResults: max_results,
      });

      const videos = (playlistResponse.data.items || []).map((item) => ({
        id: item.contentDetails?.videoId,
        title: item.snippet?.title,
        publishedAt: item.snippet?.publishedAt,
        description: item.snippet?.description,
        thumbnails: item.snippet?.thumbnails,
        position: item.snippet?.position,
        channelTitle: item.snippet?.channelTitle,
        playlistId: item.snippet?.playlistId,
        resourceId: item.snippet?.resourceId,
        status: item.status,
      }));

      return {
        success: true,
        status: "success",
        message: `Fetched ${videos.length} videos for channel playlist ${uploadsPlaylistId}`,
        videos,
        nextPageToken: playlistResponse.data.nextPageToken,
        totalResults: playlistResponse.data.pageInfo?.totalResults,
        resultsPerPage: playlistResponse.data.pageInfo?.resultsPerPage,
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
