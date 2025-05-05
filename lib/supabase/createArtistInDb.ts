import supabase from "@/lib/supabase/serverClient";

/**
 * Create a new artist in the database and associate it with an account
 * @param name Name of the artist to create
 * @param account_id ID of the account that will have admin access to the artist
 * @returns Created artist object or null if creation failed
 */
export async function createArtistInDb(name: string, account_id: string) {
  try {
    // Create the artist account
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .insert({
        name,
      })
      .select("*")
      .single();

    if (accountError || !account) {
      console.error("Error creating artist account:", accountError);
      return null;
    }

    // Create account info for the artist
    const { error: infoError } = await supabase.from("account_info").insert({
      account_id: account.id,
    });

    if (infoError) {
      console.error("Error creating artist account info:", infoError);
      return null;
    }

    // Get the full artist data
    const { data: artist, error: artistError } = await supabase
      .from("accounts")
      .select("*, account_socials(*), account_info(*)")
      .eq("id", account.id)
      .single();

    if (artistError || !artist) {
      console.error("Error fetching created artist:", artistError);
      return null;
    }

    // Associate the artist with the account
    const { error: associationError } = await supabase
      .from("account_artist_ids")
      .insert({
        account_id,
        artist_id: account.id,
      });

    if (associationError) {
      console.error("Error associating artist with account:", associationError);
      return null;
    }

    // Return formatted artist data
    return {
      ...artist,
      account_id: artist.id,
      ...artist.account_info[0],
    };
  } catch (error) {
    console.error("Unexpected error creating artist:", error);
    return null;
  }
}

export default createArtistInDb;
