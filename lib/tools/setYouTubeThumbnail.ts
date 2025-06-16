import { z } from "zod";
import { tool } from "ai";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";
import { createYouTubeAPIClient } from "@/lib/youtube/oauth-client";
import { getResizedImageBuffer } from "@/lib/youtube/getResizedImageBuffer";
import { YouTubeSetThumbnailResult } from "@/types/youtube";

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
  video_id: z
    .string()
    .describe("The YouTube video ID to set the thumbnail for."),
  thumbnail_url: z
    .string()
    .url()
    .describe(
      "A direct URL to the thumbnail image file (e.g., https://arweave.net/...). Must be a valid image URL."
    ),
});

const setYouTubeThumbnail = tool({
  description: `Set a custom thumbnail for a YouTube video. Requires a valid access_token, video_id, and a thumbnail_url. Downloads the image, resizes/compresses if needed, and uploads it to YouTube using the Data API thumbnails.set endpoint.`,
  parameters: schema,
  execute: async ({
    access_token,
    refresh_token,
    video_id,
    thumbnail_url,
  }): Promise<YouTubeSetThumbnailResult> => {
    if (!access_token || !video_id || !thumbnail_url) {
      return YouTubeErrorBuilder.createToolError(
        "Missing access_token, video_id, or thumbnail_url."
      );
    }
    try {
      const { buffer, error } = await getResizedImageBuffer(thumbnail_url);
      if (error) {
        return YouTubeErrorBuilder.createToolError(error);
      }
      const mimeType = "image/jpeg";
      const youtube = createYouTubeAPIClient(access_token, refresh_token);
      const response = await youtube.thumbnails.set({
        videoId: video_id,
        media: {
          mimeType,
          body: buffer,
        },
      });
      return {
        success: true,
        status: "success",
        message: `Thumbnail set for video ${video_id}`,
        thumbnails: response.data.items as YouTubeSetThumbnailResult["thumbnails"],
      };
    } catch (error) {
      return YouTubeErrorBuilder.createToolError(
        error instanceof Error
          ? error.message
          : "Failed to set video thumbnail."
      );
    }
  },
});

export default setYouTubeThumbnail;
