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
  /**
   * If present, the UI should immediately call get_spotify_search with this name
   */
  nextAction?: {
    type: "get_spotify_search";
    name: string;
    artist_account_id: string;
  };
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
    perplexity_ask - ask Perplexity for any additional research information about the artist
    generate_txt_file - store the current artist research in a TXT file
    update_account_info - update the new artist's knowledge base with the TXT file URL
  </tool_loop>
  After the artist is created, the UI should immediately call the get_spotify_search tool (with type: artist) to check for any existing Spotify artist data to connect to the new artist account. When the user selects a Spotify result, call update_account_info to update the new artist's profile picture.
  If responding with successful information, reply only with the artist name and the artist.account_id. Do not share any other info unless explicitly asked.
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

      // Step 3: Signal to UI to immediately call get_spotify_search
      return {
        artist,
        message: `Successfully created artist "${name}". Next: Search Spotify for this artist to connect a profile picture.",`,
        newRoomId,
        nextAction: {
          type: "get_spotify_search",
          name: artist.name,
          artist_account_id: artist.account_id,
        },
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
