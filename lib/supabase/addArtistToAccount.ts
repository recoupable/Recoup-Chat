import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

/**
 * Adds an artist ID to an account's artist_ids array
 * @param email The account's email
 * @param artistId The artist ID to add
 * @returns Success status
 * @throws Error if email or artistId is not provided, or if account is not found
 */
export async function addArtistToAccount(
  email: string,
  artistId: string
): Promise<boolean> {
  if (!email || !artistId) {
    throw new Error("Email and artistId are required");
  }

  const client = getSupabaseServerAdminClient();

  // Find account by email
  const { data: emailData, error: emailError } = await client
    .from("account_emails")
    .select("account_id")
    .eq("email", email)
    .single();

  if (emailError) {
    if (emailError.code === "PGRST116") {
      throw new Error("Account not found");
    }
    throw new Error("Error finding account");
  }

  if (!emailData?.account_id) {
    throw new Error("Account not found");
  }

  // Get current artist IDs
  const { data: artistData, error: artistError } = await client
    .from("account_artist_ids")
    .select("*")
    .eq("account_id", emailData.account_id);

  if (artistError) {
    throw new Error("Error fetching artist IDs");
  }

  // Check if artist ID already exists
  const exists = artistData?.some((a) => a.artist_id === artistId);
  if (exists) {
    return true;
  }

  // Add new artist ID
  const { error: insertError } = await client
    .from("account_artist_ids")
    .insert({
      account_id: emailData.account_id,
      artist_id: artistId,
    });

  if (insertError) {
    throw new Error("Error adding artist ID");
  }

  return true;
}
