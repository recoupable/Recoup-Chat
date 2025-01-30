import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

type ArtistInfo = {
  id: string;
  account_id: string;
  name: string | null;
  image: string | null;
  instruction: string | null;
  organization: string | null;
  account_socials: Array<{
    id: string;
    account_id: string | null;
    social_id: string;
  }>;
};

/**
 * Gets all artists associated with an email
 * @param email The email to lookup artists for
 * @returns Array of artist details
 * @throws Error if email is not provided or if there's a database error
 */
export async function getArtistsByEmail(email: string): Promise<ArtistInfo[]> {
  if (!email) {
    throw new Error("Email is required");
  }

  const client = getSupabaseServerAdminClient();

  // Find account by email
  const { data: accountEmail, error: emailError } = await client
    .from("account_emails")
    .select("account_id")
    .eq("email", email)
    .single();

  if (emailError) {
    if (emailError.code === "PGRST116") {
      return []; // No account found for email
    }
    throw new Error("Error finding account");
  }

  if (!accountEmail?.account_id) {
    return [];
  }

  // Get artist IDs for account
  const { data: accountArtistIds, error: artistIdsError } = await client
    .from("account_artist_ids")
    .select("artist_id")
    .eq("account_id", accountEmail.account_id);

  if (artistIdsError) {
    throw new Error("Error fetching artist IDs");
  }

  // Filter out any null artist IDs and get unique values
  const validArtistIds =
    accountArtistIds
      ?.map((ele) => ele.artist_id)
      .filter((id): id is string => id !== null) || [];
  const artistIds = [...new Set(validArtistIds)];

  if (artistIds.length === 0) {
    return [];
  }

  // Get artist details
  const { data: artists, error: artistsError } = await client
    .from("accounts")
    .select("*, account_info(*), account_socials(*)")
    .in("id", artistIds);

  if (artistsError) {
    throw new Error("Error fetching artist details");
  }

  if (!artists) {
    return [];
  }

  return artists.map((artist) => ({
    ...artist.account_info[0],
    ...artist,
    account_id: artist.id,
  }));
}
