import supabase from "@/lib/supabase/serverClient";

/**
 * Delete YouTube tokens for an artist
 * @param artistId - The artist ID to delete tokens for
 * @returns True if deleted successfully, false otherwise
 */
const deleteYouTubeTokens = async (artistId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("youtube_tokens")
      .delete()
      .eq("artist_id", artistId);

    if (error) {
      console.error("Error deleting YouTube tokens:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error deleting YouTube tokens:", error);
    return false;
  }
};

export default deleteYouTubeTokens; 