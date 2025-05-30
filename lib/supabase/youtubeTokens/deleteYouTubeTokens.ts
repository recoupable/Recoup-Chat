import supabase from "@/lib/supabase/serverClient";

/**
 * Delete YouTube tokens for an account
 * @param accountId - The account ID to delete tokens for
 * @returns True if deleted successfully, false otherwise
 */
const deleteYouTubeTokens = async (accountId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("youtube_tokens")
      .delete()
      .eq("account_id", accountId);

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