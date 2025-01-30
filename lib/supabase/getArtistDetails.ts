import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

type ArtistResponse = {
  id: string;
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
 * Gets artist details by ID
 * @param artistId The ID of the artist to fetch
 * @returns Artist details including account info and socials
 * @throws Error if artistId is not provided or if artist is not found
 */
export async function getArtistDetails(
  artistId: string
): Promise<ArtistResponse> {
  if (!artistId) {
    throw new Error("Artist ID is required");
  }

  const client = getSupabaseServerAdminClient();

  const { data: account, error } = await client
    .from("accounts")
    .select("*, account_info(*), account_socials(*)")
    .eq("id", artistId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Artist not found");
    }
    throw new Error("Error fetching artist details");
  }

  if (!account?.account_info?.[0]) {
    throw new Error("Artist details not found");
  }

  const accountInfo = account.account_info[0];
  return {
    id: account.id,
    name: account.name,
    image: accountInfo.image,
    instruction: accountInfo.instruction,
    organization: accountInfo.organization,
    account_socials: account.account_socials || [],
  };
}
