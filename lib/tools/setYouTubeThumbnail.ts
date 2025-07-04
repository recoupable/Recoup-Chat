import { z } from "zod";
import { tool } from "ai";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";
import { createYouTubeAPIClient } from "@/lib/youtube/oauth-client";
import { getResizedImageBuffer } from "@/lib/youtube/getResizedImageBuffer";
import { YouTubeSetThumbnailResult } from "@/types/youtube";
import { validateYouTubeTokens } from "../youtube/token-validator";

const schema = z.object({
  artist_account_id: z
    .string()
    .describe(
      "artist_account_id from the system prompt of the active artist."
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
  description: `Set a custom thumbnail for a YouTube video. Requires the artist_account_id parameter from the system prompt of the active artist, video_id, and a thumbnail_url. Downloads the image, resizes/compresses if needed, and uploads it to YouTube using the Data API thumbnails.set endpoint.
IMPORTANT: Always call the youtube_login tool first to obtain the required authentication before calling this tool.`,
  parameters: schema,
  execute: async ({
    artist_account_id,
    video_id,
    thumbnail_url,
  }: { artist_account_id: string, video_id: string, thumbnail_url: string }): Promise<YouTubeSetThumbnailResult> => {
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
      const refresh_token = tokenValidation.tokens!.refresh_token || undefined;

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
