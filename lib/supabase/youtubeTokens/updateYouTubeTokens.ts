import supabase from "@/lib/supabase/serverClient";
import type { YouTubeTokensRow, YouTubeTokensUpdate } from "./types";

/**
 * Update YouTube tokens for an artist
 * @param artistId - The artist ID to update tokens for
 * @param update - Partial YouTube tokens data to update
 * @returns Updated YouTube tokens or null if operation failed
 */
const updateYouTubeTokens = async (
  artistId: string,
  update: YouTubeTokensUpdate
): Promise<YouTubeTokensRow | null> => {
  try {
    const { data, error } = await supabase
      .from("youtube_tokens")
      .update(update)
      .eq("artist_id", artistId)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating YouTube tokens:", error);
      return null;
    }

    return data as YouTubeTokensRow;
  } catch (error) {
    console.error("Unexpected error updating YouTube tokens:", error);
    return null;
  }
};

export default updateYouTubeTokens; 