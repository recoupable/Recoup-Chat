import { z } from "zod";
import { tool } from "ai";
import createArtistInDb from "../supabase/createArtistInDb";

/**
 * Interface for artist creation result
 */
export interface CreateArtistResult {
  artist?: {
    account_id: string;
    name: string;
    image?: string;
  };
  message: string;
  error?: string;
}

const createArtist = tool({
  description: `
  Create a new artist account in the system.
  This tool should be called when a user wants to create a new artist profile.
  Requires the artist name and the account ID of the user with admin access to the new artist account.
  `,
  parameters: z.object({
    name: z.string().describe("The name of the artist to be created"),
    account_id: z
      .string()
      .describe(
        "The account ID of the human with admin access to the new artist account"
      ),
  }),
  execute: async ({ name, account_id }): Promise<CreateArtistResult> => {
    try {
      const artist = await createArtistInDb(name, account_id);

      if (!artist) {
        throw new Error("Failed to create artist");
      }

      return {
        artist,
        message: `Successfully created artist "${name}".`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create artist for unknown reason";
      return {
        error: errorMessage,
        message: `Failed to create artist: ${errorMessage}`,
      };
    }
  },
});

export default createArtist;
