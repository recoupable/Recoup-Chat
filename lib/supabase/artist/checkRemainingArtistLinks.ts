import supabase from "@/lib/supabase/serverClient";

/**
 * Check if any accounts are still linked to an artist
 *
 * @param artistId The ID of the artist to check
 * @returns Object with count of remaining links and any error
 */
export async function checkRemainingArtistLinks(artistId: string) {
  try {
    const { data, error } = await supabase
      .from("account_artist_ids")
      .select("id")
      .eq("artist_id", artistId);

    if (error) {
      console.error("Error checking remaining artist links:", error);
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      remainingCount: data?.length || 0,
      hasRemainingLinks: data && data.length > 0,
    };
  } catch (error) {
    console.error("Unexpected error in checkRemainingArtistLinks:", error);
    return {
      success: false,
      error,
    };
  }
}

export default checkRemainingArtistLinks;
