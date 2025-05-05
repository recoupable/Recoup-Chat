import supabase from "./serverClient";
import getArtistById from "./artist/getArtistById";

/**
 * Delete an artist association from an account
 * If no other accounts have this artist, also delete the artist account and related data
 *
 * @param artistAccountId The ID of the artist account to delete
 * @param ownerAccountId The ID of the owner account
 * @returns Object with success status, message, and artist name if successful
 */
export async function deleteArtistFromAccount(
  artistAccountId: string,
  ownerAccountId: string
) {
  try {
    // First get the artist data using getArtistById utility
    const artistData = await getArtistById(artistAccountId);

    const artistName = artistData?.name || "Unknown artist";

    // Delete the account_artist_ids record
    const { data: deletedLinks, error: deleteError } = await supabase
      .from("account_artist_ids")
      .delete()
      .eq("artist_id", artistAccountId)
      .eq("account_id", ownerAccountId)
      .select();

    if (deleteError) {
      console.error("Error deleting artist link:", deleteError);
      return {
        success: false,
        message: "Failed to delete artist link",
      };
    }

    // If no rows were deleted, the link didn't exist
    if (!deletedLinks || deletedLinks.length === 0) {
      return {
        success: false,
        message: "Could not find artist link to delete",
      };
    }

    // Check if any other accounts still have this artist
    const { data: remainingLinks, error: checkError } = await supabase
      .from("account_artist_ids")
      .select("id")
      .eq("artist_id", artistAccountId);

    if (checkError) {
      console.error("Error checking remaining links:", checkError);
      return {
        success: true,
        message:
          "Artist link removed, but could not verify if artist should be deleted",
        artistName,
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
        .eq("id", artistAccountId);

      if (artistDeleteError) {
        console.error("Error deleting artist account:", artistDeleteError);
        return {
          success: true,
          message: "Artist link removed, but failed to delete artist account",
          artistName,
        };
      }

      return {
        success: true,
        message: "Artist and all associated data deleted successfully",
        artistName,
      };
    }

    return {
      success: true,
      message: "Artist link removed successfully",
      artistName,
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
