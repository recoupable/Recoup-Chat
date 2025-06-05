import { tool } from "ai";
import { z } from "zod";
import { validateYouTubeTokens } from "../youtube/token-validator";
import { YouTubeErrorBuilder } from "../youtube/error-builder";

const schema = z.object({
  artist_account_id: z
    .string()
    .describe(
      "artist_account_id from system prompt"
    ),
});

const loginWithYouTube = tool({
  description:
    "This tool checks if we have access to the artist's YouTube account or not. If we don't have access, a sign in with youtube button will be displayed.",
  parameters: schema,
  execute: async ({ artist_account_id }) => {
    console.log("Check Youtube Login Access", artist_account_id);
    // Validate YouTube tokens (internal authentication check)
    const tokenValidation = await validateYouTubeTokens(artist_account_id);

    if (!tokenValidation.success) {
      return YouTubeErrorBuilder.createToolError(
        `YouTube authentication required for this account. ${tokenValidation.error!.message} Please authenticate by connecting your YouTube account.`
      );
    }

    return {
      success: true,
      message:
        "YouTube access for the artist account is confirmed. You can now ask me to get YouTube revenue, channel info, or any other YouTube data you need.",
    };
  },
});

export default loginWithYouTube;
