import supabase from "./serverClient";

/**
 * Gets the custom instruction for an artist from account_info
 * @param artistId The artist account ID
 * @returns The instruction string or null if not found
 */
async function getArtistInstruction(artistId: string): Promise<string | null> {
  if (!artistId) return null;

  const { data } = await supabase
    .from("account_info")
    .select("instruction")
    .eq("account_id", artistId)
    .single();

  return data?.instruction || null;
}

export default getArtistInstruction;
