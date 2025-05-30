import supabase from "@/lib/supabase/serverClient";
import type { YouTubeTokensRow } from "./types";

/**
 * Get YouTube tokens for a specific account
 * @param accountId - The account ID to get tokens for
 * @returns YouTube tokens or null if not found
 */
const getYouTubeTokens = async (
  accountId: string
): Promise<YouTubeTokensRow | null> => {
  try {
    const { data, error } = await supabase
      .from("youtube_tokens")
      .select("*")
      .eq("account_id", accountId)
      .single();

    if (error) {
      // Don't log error for "not found" cases as this is expected
      if (error.code !== "PGRST116") {
        console.error("Error fetching YouTube tokens:", error);
      }
      return null;
    }

    return data as YouTubeTokensRow;
  } catch (error) {
    console.error("Unexpected error fetching YouTube tokens:", error);
    return null;
  }
};

export default getYouTubeTokens; 