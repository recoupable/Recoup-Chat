import supabase from "@/lib/supabase/serverClient";

/**
 * Get all account-artist relationships for a specific artist
 *
 * @param artistId The ID of the artist to check
 * @returns Object with account-artist IDs data and metadata
 */
export async function getAccountArtistIdsByArtistId(artistId: string) {
  try {
    const { data, error } = await supabase
      .from("account_artist_ids")
      .select("*") // Select all columns to get more complete data
      .eq("artist_id", artistId);

    if (error) {
      console.error("Error getting account-artist IDs:", error);
      return {
        success: false,
        error,
        data: null,
      };
    }

    return {
      success: true,
      data,
      count: data?.length || 0,
      hasLinks: data && data.length > 0,
    };
  } catch (error) {
    console.error("Unexpected error in getAccountArtistIdsByArtistId:", error);
    return {
      success: false,
      error,
      data: null,
    };
  }
}

export default getAccountArtistIdsByArtistId;
