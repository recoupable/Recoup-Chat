import { z } from "zod";
import { tool } from "ai";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import { YouTubeErrorBuilder } from "@/lib/youtube/error-builder";

const schema = z.object({
  account_id: z
    .string()
    .describe(
      "account_id from the system prompt of the human account signed in."
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
IMPORTANT: This tool requires the account_id parameter. Never ask the user for this parameter. It is always passed in the system prompt.`,
  parameters: schema,
  execute: async ({ account_id }): Promise<YouTubeLoginResultType> => {
    if (!account_id || account_id.trim() === "") {
      return YouTubeErrorBuilder.createToolError(
        "No account_id provided to YouTube login tool. The LLM must pass the account_id parameter. Please ensure you're passing the current human's account_id."
      );
    }
    try {
      const tokenValidation = await validateYouTubeTokens(account_id);
      if (!tokenValidation.success) {
        return YouTubeErrorBuilder.createToolError(
          `YouTube authentication required for this account. Please authenticate by connecting your YouTube account.`
        );
      }
      const tokens = tokenValidation.tokens!;
      return YouTubeErrorBuilder.createToolSuccess(
        "YouTube is connected for this account.",
        {
          authentication: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          },
        }
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
