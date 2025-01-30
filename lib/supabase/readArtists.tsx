import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { Database } from "@/packages/supabase/src/database.types";
import { getOrCreateAccountByEmail } from "./getAccountByEmail";

type AccountArtistId =
  Database["public"]["Tables"]["account_artist_ids"]["Row"];

const readArtists = async (userEmail: string): Promise<AccountArtistId[]> => {
  try {
    const client = getSupabaseServerAdminClient();

    // Get or create user account
    const account = await getOrCreateAccountByEmail(userEmail);

    // Get artist IDs for the account
    const { data: artistIds, error: artistError } = await client
      .from("account_artist_ids")
      .select("*")
      .eq("account_id", account.account_id);

    if (artistError) {
      throw artistError;
    }

    return artistIds || [];
  } catch (error) {
    console.error("Error in readArtists:", error);
    throw error;
  }
};

export default readArtists;
