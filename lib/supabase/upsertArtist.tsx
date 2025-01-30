import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { getOrCreateAccountByEmail } from "./getAccountByEmail";
import { Database } from "@/packages/supabase/src/database.types";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

/**
 * Creates a new artist account and links it to the user's account
 * @param artistName Name of the artist to create
 * @param userEmail Email of the user to link the artist to
 * @returns The created artist account data
 * @throws Error if required data is missing or if there's a database error
 */
export async function upsertArtist(
  artistName: string,
  userEmail: string
): Promise<Account> {
  if (!artistName || !userEmail) {
    throw new Error("Artist name and user email are required");
  }

  const client = getSupabaseServerAdminClient();

  // Get or create user account
  const userAccount = await getOrCreateAccountByEmail(userEmail);

  // Create new artist account
  const { data: newArtist, error: artistError } = await client
    .from("accounts")
    .insert({
      name: artistName,
      timestamp: Math.floor(Date.now() / 1000), // Convert to Unix timestamp
    })
    .select()
    .single();

  if (artistError || !newArtist) {
    throw new Error("Error creating artist account");
  }

  // Link artist to user's account
  const { error: linkError } = await client.from("account_artist_ids").insert({
    account_id: userAccount.account_id,
    artist_id: newArtist.id,
  });

  if (linkError) {
    throw new Error("Error linking artist to account");
  }

  return newArtist;
}

export default upsertArtist;
