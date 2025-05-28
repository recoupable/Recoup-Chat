import supabase from "@/lib/supabase/serverClient";

/**
 * Get all account-artist relationships for an array of artist IDs
 *
 * @param artistIds Array of artist IDs to check
 * @returns Object with account-artist IDs data and metadata
 */
export async function getAccountArtistIds(artistIds: string[]) {
  try {
    const { data, error } = await supabase
      .from("account_artist_ids")
      .select("*") // Select all columns to get more complete data
      .in("artist_id", artistIds);

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
    console.error("Unexpected error in getAccountArtistIds:", error);
    return {
      success: false,
      error,
      data: null,
    };
  }
}

export default getAccountArtistIds;
