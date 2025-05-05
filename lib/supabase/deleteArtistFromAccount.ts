import supabase from "./serverClient";

/**
 * Delete an artist association from an account
 * If no other accounts have this artist, also delete the artist account and related data
 *
 * @param artistAccountId The ID of the account_artist_ids record to delete
 * @returns Object with success status and message
 */
export async function deleteArtistFromAccount(artistAccountId: string) {
  try {
    // First get the artist_id from the account_artist_ids table
    const { data: artistLink, error: fetchError } = await supabase
      .from("account_artist_ids")
      .select("artist_id")
      .eq("id", artistAccountId)
      .single();

    if (fetchError || !artistLink) {
      console.error("Error fetching artist link:", fetchError);
      return {
        success: false,
        message: "Could not find artist link",
      };
    }

    const artistId = artistLink.artist_id;

    // Delete the account_artist_ids record
    const { error: deleteError } = await supabase
      .from("account_artist_ids")
      .delete()
      .eq("id", artistAccountId);

    if (deleteError) {
      console.error("Error deleting artist link:", deleteError);
      return {
        success: false,
        message: "Failed to delete artist link",
      };
    }

    // Check if any other accounts still have this artist
    const { data: remainingLinks, error: checkError } = await supabase
      .from("account_artist_ids")
      .select("id")
      .eq("artist_id", artistId);

    if (checkError) {
      console.error("Error checking remaining links:", checkError);
      return {
        success: true,
        message:
          "Artist link removed, but could not verify if artist should be deleted",
      };
    }

    // If no other accounts have this artist, delete the artist account and related data
    if (!remainingLinks || remainingLinks.length === 0) {
      // The ON DELETE CASCADE should handle:
      // - account_info
      // - account_socials
      // - fan_segment table
      // - Any other tables with foreign key constraints
      const { error: artistDeleteError } = await supabase
        .from("accounts")
        .delete()
        .eq("id", artistId);

      if (artistDeleteError) {
        console.error("Error deleting artist account:", artistDeleteError);
        return {
          success: true,
          message: "Artist link removed, but failed to delete artist account",
        };
      }

      return {
        success: true,
        message: "Artist and all associated data deleted successfully",
      };
    }

    return {
      success: true,
      message: "Artist link removed successfully",
    };
  } catch (error) {
    console.error("Unexpected error in deleteArtistFromAccount:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

export default deleteArtistFromAccount;
