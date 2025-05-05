import { z } from "zod";
import { tool } from "ai";
import createArtistInDb from "../supabase/createArtistInDb";
import copyRoom from "../supabase/copyRoom";

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
  newRoomId?: string | null;
}

const createArtist = tool({
  description: `
  Create a new artist account in the system.
  This tool should be called when a user wants to create a new artist profile.
  Requires the artist name, the account ID of the user with admin access to the new artist account,
  and the roomId to copy for this artist's first conversation.
  If called, reply with the artist name and the artist.account_id. Do not share any other info unless explicitly asked.
  `,
  parameters: z.object({
    name: z.string().describe("The name of the artist to be created"),
    account_id: z
      .string()
      .describe(
        "The account ID of the human with admin access to the new artist account"
      ),
    roomId: z
      .string()
      .describe(
        "The ID of the room/conversation to copy for this artist's first conversation"
      ),
  }),
  execute: async ({
    name,
    account_id,
    roomId,
  }): Promise<CreateArtistResult> => {
    try {
      // Step 1: Create the artist account
      const artist = await createArtistInDb(name, account_id);

      if (!artist) {
        throw new Error("Failed to create artist");
      }

      // Step 2: Copy the conversation to the new artist
      let newRoomId = null;
      if (roomId) {
        newRoomId = await copyRoom(roomId, artist.account_id);
      }

      return {
        artist,
        message: `Successfully created artist "${name}".`,
        newRoomId,
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
