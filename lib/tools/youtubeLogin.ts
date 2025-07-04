import { z } from "zod";
import { tool } from "ai";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";

const schema = z.object({
  artist_account_id: z
    .string()
    .describe(
      "artist_account_id from the system prompt of the active artist."
    ),
});

export interface YouTubeLoginResultType {
  success: boolean;
  message: string;
  status: string;
  authentication?: {
    access_token: string | null;
    refresh_token: string | null;
  };
}

const youtubeLoginTool = tool({
  description: `Check YouTube authentication status for a specific account. 
Returns authentication status and token expiry if authenticated, or clear instructions if not. 
IMPORTANT: This tool requires the artist_account_id parameter. Never ask the user for this parameter. It is always passed in the system prompt.`,
  parameters: schema,
  execute: async ({ artist_account_id }: { artist_account_id: string }): Promise<YouTubeLoginResultType> => {
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

      return YouTubeErrorBuilder.createToolSuccess(
        "YouTube is connected for this account.",
        {}
      );
    } catch (error) {
      return YouTubeErrorBuilder.createToolError(
        error instanceof Error
          ? error.message
          : "Failed to check YouTube authentication. Please try again."
      );
    }
  },
});

export default youtubeLoginTool;
