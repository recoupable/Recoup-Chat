import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

/**
 * Updates or creates an artist profile
 * @param artistId Optional artist ID to update. If not provided, creates new artist
 * @param email Required when creating new artist
 * @param image Artist profile image
 * @param name Artist name
 * @param instruction Artist instructions
 * @param label Artist label
 * @param knowledges Artist knowledge base
 * @returns The artist ID
 * @throws Error if required data is missing or if there's a database error
 */
export async function updateArtistProfile(
  artistId: string | undefined,
  email: string,
  image: string,
  name: string,
  instruction: string,
  label: string,
  knowledges: string
): Promise<string> {
  const client = getSupabaseServerAdminClient();

  if (artistId) {
    // Update existing artist
    const { data: account, error: accountError } = await client
      .from("accounts")
      .update({ name })
      .eq("id", artistId)
      .select()
      .single();

    if (accountError || !account) {
      throw new Error("Artist does not exist");
    }

    // Get or create account info
    const { data: accountInfo, error: infoError } = await client
      .from("account_info")
      .select()
      .eq("account_id", artistId)
      .single();

    if (infoError && infoError.code !== "PGRST116") {
      throw new Error("Error fetching artist info");
    }

    if (accountInfo) {
      // Update existing account info
      const { error: updateError } = await client
        .from("account_info")
        .update({
          image,
          instruction,
          knowledges,
          label,
        })
        .eq("account_id", artistId);

      if (updateError) {
        throw new Error("Error updating artist info");
      }
    } else {
      // Create new account info
      const { error: insertError } = await client.from("account_info").insert({
        image,
        instruction,
        knowledges,
        label,
        account_id: artistId,
      });

      if (insertError) {
        throw new Error("Error creating artist info");
      }
    }

    return artistId;
  } else {
    // Create new artist
    if (!email) {
      throw new Error("Email is required when creating new artist");
    }

    // Get account ID from email
    const { data: emailData, error: emailError } = await client
      .from("account_emails")
      .select("account_id")
      .eq("email", email)
      .single();

    if (emailError || !emailData) {
      throw new Error("Account not found for email");
    }

    // Create new artist account
    const { data: newArtist, error: artistError } = await client
      .from("accounts")
      .insert({ name })
      .select()
      .single();

    if (artistError || !newArtist) {
      throw new Error("Error creating artist account");
    }

    // Link artist to account
    const { error: linkError } = await client
      .from("account_artist_ids")
      .insert({
        account_id: emailData.account_id,
        artist_id: newArtist.id,
      });

    if (linkError) {
      throw new Error("Error linking artist to account");
    }

    // Create artist info
    const { error: infoError } = await client.from("account_info").insert({
      image,
      instruction,
      knowledges,
      label,
      account_id: newArtist.id,
    });

    if (infoError) {
      throw new Error("Error creating artist info");
    }

    return newArtist.id;
  }
}

export default updateArtistProfile;
