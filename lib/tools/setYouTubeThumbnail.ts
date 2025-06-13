import { z } from "zod";
import { tool } from "ai";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";
import { createYouTubeAPIClient } from "@/lib/youtube/oauth-client";
import sharp from "sharp";

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
  execute: async ({ access_token, refresh_token, video_id, thumbnail_url }) => {
    if (!access_token || !video_id || !thumbnail_url) {
      return YouTubeErrorBuilder.createToolError(
        "Missing access_token, video_id, or thumbnail_url."
      );
    }
    try {
      // Fetch the image from the URL
      const res = await fetch(thumbnail_url);
      if (!res.ok) {
        return YouTubeErrorBuilder.createToolError(
          `Failed to fetch thumbnail from URL: ${res.status} ${res.statusText}`
        );
      }
      const arrayBuffer = await res.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      let buffer = Buffer.from(
        uint8.buffer,
        uint8.byteOffset,
        uint8.byteLength
      ) as Buffer;
      const MAX_SIZE = 2_097_152; // 2MB in bytes

      // If image is too large, resize and compress
      if (buffer.length > MAX_SIZE) {
        // Resize to fit within 1280x720, compress to JPEG quality 80
        buffer = await sharp(buffer)
          .resize({ width: 1280, height: 720, fit: "inside" })
          .jpeg({ quality: 80 })
          .toBuffer();
      }

      // Check again after resizing/compression
      if (buffer.length > MAX_SIZE) {
        return YouTubeErrorBuilder.createToolError(
          `Thumbnail image is too large even after resizing/compression (${buffer.length} bytes). Please provide a smaller image.`
        );
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
        thumbnails: response.data.items || response.data,
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
