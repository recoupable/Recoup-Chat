import { z } from "zod";
import { tool } from "ai";
import createArtistInDb from "../supabase/createArtistInDb";
import copyConversation from "../supabase/copyConversation";

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
  roomId?: string; // The original room ID
}

const createArtist = tool({
  description: `
  Create a new artist account in the system.
  This tool should be called when a user wants to create a new artist profile.
  Requires the artist name, the account ID of the user with admin access to the new artist account,
  and the roomId to copy for this artist's first conversation.
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
        newRoomId = await copyConversation(roomId, artist.account_id);
        console.log(`Created new room for artist: ${newRoomId}`);
      }

      return {
        artist,
        message: `Successfully created artist "${name}".`,
        newRoomId,
        roomId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create artist for unknown reason";
      return {
        error: errorMessage,
        message: `Failed to create artist: ${errorMessage}`,
        roomId,
      };
    }
  },
});

export default createArtist;
