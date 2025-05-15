import { z } from "zod";
import { tool } from "ai";
import createArtistInDb from "../supabase/createArtistInDb";
import copyRoom from "../supabase/copyRoom";

export interface CreateArtistResult {
  artist?: {
    account_id: string;
    name: string;
    image?: string;
  };
  artistAccountId?: string;
  message: string;
  error?: string;
  newRoomId?: string | null;
}

const createArtist = tool({
  description: `
  Create a new artist account in the system and handles initial research.
  Requires the artist name, the account ID of the user with admin access to the new artist account,
  and the roomId to copy for this artist's first conversation.
  always follow this tool loop:
  <tool_loop>
    create_new_artist - create a new artist account in the system
    get_spotify_search - check for any existing Spotify artist data to connect to the new artist account
    update_account_info - update the new artist's profile picture based on the Spotify artist data
    update_artist_socials - add the Spotify artist's social profiles to the new artist's socials
    artist_deep_research - conduct comprehensive research on the artist across all platforms
  </tool_loop>

IMPORTANT: After creating the artist, you MUST continue with these steps in order:
  1. Call get_spotify_search with the artist's name to find their Spotify profile
  2. When a Spotify result is selected, call update_account_info to set their profile picture
  3. Call update_artist_socials to add their social profiles
  4. Call artist_deep_research to gather comprehensive data
  
  Do not stop after creating the artist - continue with all these steps to complete the setup.  
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
        artistAccountId: artist.account_id,
        message: `Successfully created artist "${name}". Now searching Spotify for this artist to connect their profile...`,
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
