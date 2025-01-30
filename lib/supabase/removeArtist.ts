import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

/**
 * Removes an artist account by ID
 * @param artistId The ID of the artist account to remove
 * @returns Success status
 * @throws Error if artistId is not provided or if there's a database error
 */
export async function removeArtist(artistId: string): Promise<boolean> {
  if (!artistId) {
    throw new Error("Artist ID is required");
  }

  const client = getSupabaseServerAdminClient();

  const { error } = await client.from("accounts").delete().eq("id", artistId);

  if (error) {
    throw new Error("Error removing artist account");
  }

  return true;
}
